'use strict';

import {
    APIGatewayClient,
    GetMethodCommand,
    paginateGetResources,
    paginateGetRestApis, RestApi,
} from '@aws-sdk/client-api-gateway';
import sha256 from 'sha256';
import {AwsCredentialIdentity} from "@aws-sdk/types";

let MAX_WAIT = 800;
let WAIT = 800;
// let MAX_WAIT_SHORT = 100;
// let WAIT_SHORT = 100;
// interface _params1 {
//     region: string,
//     credentials:
// }

let queue: {
    [hash: string]: {
        wait: boolean,
        fn: typeof apigateway_GetRestApis | typeof apigateway_GetResources | typeof apigateway_GetMethod,
        // params: [],
        inFlight: boolean,
        region: string,
        credentials: AwsCredentialIdentity,
        restApiId: string,
        METHOD: string,
        resourceId: string,
        client: APIGatewayClient,
        catcher: _catcher,
        objAttribs: {},
    }
} = {};
let objGlobalReturn: {
    [region: string]: {
        RestApis: RestApi[]
        RestApiResources: {
            restApiId: string,
        }[],
        RestApiMethods: {
            restApiId: string,
            resourceId: string,
        }[],
    },
} = {};
let serviceCallManifest: string[];


interface _catcher {
    handle: Function,
}

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


let randString = (length: number) => {
    let strRandom = '';
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < length; i++) {
        let rPos = Math.floor(Math.random() * chars.length);
        let char = chars.charAt(rPos);
        strRandom += char;
    }
    return strRandom;
};


let rStr = (): string => {
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

                    if (!queue[hash].inFlight) {

                        queue[hash].inFlight = true;
                        // console.log(`Wainting ${WAIT}.`);
                        // console.log(queue[hash].wait);
                        if (queue[hash].wait) {
                            await new Promise(resolve => setTimeout(resolve, WAIT));
                        } else {
                            await new Promise(resolve => setTimeout(resolve, WAIT));
                        }
                        // console.log(queue[hash].fn);
                        // switch (queue[hash].fn.name) {
                        //
                        //     case 'apigateway_GetRestApis':
                        //             promises.push(
                        //                 queue[hash].fn(queue[hash].region, queue[hash].credentials, queue[hash].objAttribs, queue[hash].catcher, queue[hash].client, queue[hash].restApiId, queue[hash].METHOD, queue[hash].resourceId)
                        //                     .then(() => {
                        //                         WAIT = Math.ceil(WAIT - 20);
                        //                         if (WAIT < 350) {
                        //                             WAIT = 350;
                        //                         }
                        //                         delete queue[hash];
                        //                     })
                        //                     .catch((e: Error) => {
                        //                         queue[hash].inFlight = false;
                        //                         if (e.name === 'TooManyRequestsException') {
                        //                             WAIT = MAX_WAIT;
                        //                         } else {
                        //                             //   delete queue[hash];
                        //                         }
                        //                     })
                        //             );
                        //         break;
                        // }
                        promises.push(
                            // queue[hash].fn(...queue[hash].params)
                            queue[hash].fn(queue[hash].region, queue[hash].credentials, queue[hash].objAttribs, queue[hash].catcher, queue[hash].client, queue[hash].restApiId, queue[hash].METHOD, queue[hash].resourceId)
                                .then(() => {
                                    WAIT = Math.ceil(WAIT - 20);
                                    if (WAIT < 350) {
                                        WAIT = 350;
                                    }
                                    delete queue[hash];
                                })
                                .catch((e: Error) => {
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
                resolve(null);
            });

    });
};


let apigateway_GetMethod = (region: string, credentials: AwsCredentialIdentity, objAttribs: {}, catcher: _catcher, client: APIGatewayClient, restApiId: string, httpMethod: string, resourceId: string) => {
    return new Promise((resolve, reject) => {

        client.send(new GetMethodCommand(
            {
                httpMethod,
                resourceId,
                restApiId,
            }
        ))
            .then((data) => {
                const _values = {
                    restApiId,
                    resourceId,
                };
                // data.restApiId = restApiId;
                // data.resourceId = resourceId;
                if (objGlobalReturn[region] === undefined) {
                    objGlobalReturn[region] = {
                        RestApis: [],
                        RestApiResources: [],
                        RestApiMethods: [],
                    };
                }
                objGlobalReturn[region].RestApiMethods.push(_values);
                resolve(null);
            })
            .catch((e) => {

                reject(e);

            });

    });
};


let apigateway_GetResources = (region: string, credentials: AwsCredentialIdentity, objAttribs: {}, catcher: _catcher, client: APIGatewayClient, restApiId: string) => {
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
                if (page.items) arrItems.push(...page.items);
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

                    const _values = {
                        restApiId,
                    };
                    // oResource.RestApiId = restApiId;
                    if (objGlobalReturn[region] === undefined) {
                        objGlobalReturn[region] = {
                            RestApis: [],
                            RestApiResources: [],
                            RestApiMethods: [],
                        };
                    }
                    objGlobalReturn[region].RestApiResources.push(_values);

                    if (oResource.resourceMethods !== undefined) {
                        Object.keys(oResource.resourceMethods).forEach((METHOD) => {
                            const nextCall = `GetMethod`;
                            const objFn = {
                                fn: apigateway_GetMethod,
                                wait: false,
                                inFlight: false,
                                region,
                                credentials,
                                restApiId,
                                METHOD,
                                resourceId: oResource.id!,
                                client,
                                catcher,
                                objAttribs,
                                // params: [
                                //     METHOD,
                                //     oResource.id,
                                //     restApiId,
                                //     client,
                                //     region,
                                // ],
                            };

                            if (serviceCallManifest.indexOf(nextCall) > -1) {
                                queue[rStr()] = objFn;
                            }

                        });
                    }

                });

                resolve(null);

            });

    });
};


let apigateway_GetRestApis = (region: string, credentials: AwsCredentialIdentity, objAttribs: {}, catcher: _catcher) => {
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
                if (page.items) arrItems.push(...page.items)
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
                region,
                credentials,
                restApiId: objRestApi.id!,
                METHOD: '',
                resourceId: '',
                client,
                catcher,
                objAttribs,
                // params: [
                //     objRestApi.id,
                //     client,
                //     region,
                // ],
            };

            if (serviceCallManifest.indexOf(nextCall) > -1) {
                queue[rStr()] = objFn;
            }

        });

        resolve(null);

    });

};

export let apigateway_Begin = (region: string, credentials: AwsCredentialIdentity, svcCallsAll: [], objAttribs: {}, catcher: _catcher) => {
    return new Promise((resolve) => {

        serviceCallManifest = svcCallsAll;

        const client = new APIGatewayClient(
            {
                region,
                credentials,
            }
        );

        let nextCall = `GetRestApis`;
        let objFn = {
            fn: apigateway_GetRestApis,
            wait: true,
            inFlight: false,
            region,
            credentials,
            restApiId: '',
            METHOD: '',
            resourceId: '',
            client,
            catcher,
            objAttribs,
            // params: [
            //     region,
            //     credentials,
            // ],
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

