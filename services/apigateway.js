'use strict';

import {
    APIGatewayClient,
    GetMethodCommand,
    paginateGetResources,
    paginateGetRestApis,
} from '@aws-sdk/client-api-gateway';
import sha256 from 'sha256';

let MAX_WAIT = 800;
let WAIT = 800;
// let MAX_WAIT_SHORT = 100;
// let WAIT_SHORT = 100;
let queue = {};
let objGlobalReturn = {};
let serviceCallManifest;


export function getPerms() {
    return [
        {
            "service": "apigateway",
            "call": "GetRestApis",
            "permission": "GET",
            "initiator": true
        },
        {
            "service": "apigateway",
            "call": "GetResources",
            "permission": "GET",
            "initiator": false
        },
        {
            "service": "apigateway",
            "call": "GetMethod",
            "permission": "GET",
            "initiator": false
        }
    ];
}


let randString = (length) => {
    let strRandom = '';
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < length; i++) {
        let rPos = Math.floor(Math.random() * chars.length);
        let char = chars.charAt(rPos);
        strRandom += char;
    }
    return strRandom;
};


let rStr = () => {
    return sha256(randString(64));
    // return hash;
};


let qR = () => {
    return new Promise(async (resolve) => {

        let promises = [];

        while (Object.keys(queue).length > 0) {

            let aHashes = Object.keys(queue);
            for (let i = 0; i < aHashes.length; i++) {

                let hash = aHashes[i];
                if (queue[hash] !== undefined) {

                    if (queue[hash].inFlight === false) {

                        queue[hash].inFlight = true;
                        // console.log(`Wainting ${WAIT}.`);
                        // console.log(queue[hash].wait);
                        if (queue[hash].wait === true) {
                            await new Promise(resolve => setTimeout(resolve, WAIT));
                        } else {
                            await new Promise(resolve => setTimeout(resolve, WAIT));
                        }
                        // console.log(queue[hash].fn);
                        promises.push(
                            queue[hash].fn(...queue[hash].params)
                                .then(() => {
                                    WAIT = Math.ceil(WAIT - 20);
                                    if (WAIT < 350) {
                                        WAIT = 350;
                                    }
                                    delete queue[hash];
                                })
                                .catch((e) => {
                                    queue[hash].inFlight = false;
                                    if (e.name === 'TooManyRequestsException') {
                                        WAIT = MAX_WAIT;
                                    } else {
                                        //   delete queue[hash];
                                    }
                                })
                        );

                    }

                }

            }
            await new Promise(resolve => setTimeout(resolve, 10));
            // console.log(Object.keys(queue).length);

        }

        Promise.all(promises)
            .then(() => {
                resolve();
            });

    });
};


let apigateway_GetMethod = (httpMethod, resourceId, restApiId, client, region) => {
    return new Promise((resolve, reject) => {

        client.send(new GetMethodCommand(
            {
                httpMethod,
                resourceId,
                restApiId,
            }
        ))
            .then((data) => {
                data.restApiId = restApiId;
                data.resourceId = resourceId;
                if (objGlobalReturn[region] === undefined) {
                    objGlobalReturn[region] = {
                        RestApis: [],
                        RestApiResources: [],
                        RestApiMethods: [],
                    };
                }
                objGlobalReturn[region].RestApiMethods.push(data);
                resolve();
            })
            .catch((e) => {

                reject(e);

            });

    });
};


let apigateway_GetResources = (restApiId, client, region) => {
    return new Promise(async (resolve, reject) => {

        const pConfig = {
            client,
            pageSize: 500,
        };

        const cmdParams = {
            restApiId,
        };

        const paginator = paginateGetResources(pConfig, cmdParams);

        const arrItems = [];

        try {
            for await (const page of paginator) {
                arrItems.push(...page.items);
            }
        } catch (e) {
            reject(e);
        }


        Promise.all(arrItems)
            .then((arrResources) => {
                // let arrPromisesM = [];
                //
                // let obj = {
                //   RestApiResources: [],
                //   RestApiMethods: [],
                // };


                arrResources.forEach((oResource) => {

                    oResource.RestApiId = restApiId;
                    if (objGlobalReturn[region] === undefined) {
                        objGlobalReturn[region] = {
                            RestApis: [],
                            RestApiResources: [],
                            RestApiMethods: [],
                        };
                    }
                    objGlobalReturn[region].RestApiResources.push(oResource);

                    if (oResource.resourceMethods !== undefined) {
                        Object.keys(oResource.resourceMethods).forEach((METHOD) => {
                            const nextCall = `GetMethod`;
                            const objFn = {
                                fn: apigateway_GetMethod,
                                wait: false,
                                inFlight: false,
                                params: [
                                    METHOD,
                                    oResource.id,
                                    restApiId,
                                    client,
                                    region,
                                ],
                            };

                            if (serviceCallManifest.indexOf(nextCall) > -1) {
                                queue[rStr()] = objFn;
                            }

                        });
                    }

                });

                resolve();

            });

    });
};


let apigateway_GetRestApis = (region, credentials) => {
    return new Promise(async (resolve, reject) => {

        const client = new APIGatewayClient(
            {
                region,
                credentials,
            }
        );

        const pConfig = {
            client,
            pageSize: 500,
        };

        const cmdParams = {};

        const paginator = paginateGetRestApis(pConfig, cmdParams);

        const arrItems = [];

        try {
            for await (const page of paginator) {
                arrItems.push(...page.items)
            }
        } catch (e) {
            reject(e);
        }


        if (objGlobalReturn[region] === undefined) {
            objGlobalReturn[region] = {
                RestApis: [],
                RestApiResources: [],
                RestApiMethods: [],
            };
        }
        objGlobalReturn[region].RestApis = arrItems;
        // let arrPromisesR = [];


        arrItems.forEach((objRestApi) => {
            let nextCall = `GetResources`;
            let objFn = {
                fn: apigateway_GetResources,
                wait: true,
                inFlight: false,
                params: [
                    objRestApi.id,
                    client,
                    region,
                ],
            };

            if (serviceCallManifest.indexOf(nextCall) > -1) {
                queue[rStr()] = objFn;
            }

        });

        resolve();

    });

};

export let apigateway_Begin = (region, credentials, svcCallsAll) => {
    return new Promise((resolve) => {

        serviceCallManifest = svcCallsAll;

        let nextCall = `GetRestApis`;
        let objFn = {
            fn: apigateway_GetRestApis,
            wait: true,
            inFlight: false,
            params: [
                region,
                credentials,
            ],
        };

        if (serviceCallManifest.indexOf(nextCall) > -1) {
            queue[rStr()] = objFn;
        }


        qR()
            .then(() => {
                // let objReturn = {
                //   [region]: objGlobalReturn
                // };
                resolve(objGlobalReturn);
            });

    });
};

