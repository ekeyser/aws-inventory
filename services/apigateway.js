'use strict';

import {
    APIGatewayClient,
    GetMethodCommand,
    paginateGetResources,
    paginateGetRestApis,
} from '@aws-sdk/client-api-gateway';

let calls = 0;

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


let apigateway_GetMethod = (httpMethod, resourceId, restApiId, client, WAIT) => {
    return new Promise(async (resolve, reject) => {

        if (WAIT === undefined) {
            WAIT = 500;
        }
        WAIT += Math.random() * 1000;

        client.send(new GetMethodCommand(
            {
                httpMethod,
                resourceId,
                restApiId,
            }
        ))
            .then((data) => {
                calls++;
                data.restApiId = restApiId;
                data.resourceId = resourceId;
                resolve(data);
            })
            .catch(async (e) => {

                if (e.name === 'TooManyRequestsException') {
                    await new Promise(resolve => setTimeout(resolve, WAIT));
                    apigateway_GetMethod(httpMethod, resourceId, restApiId, client, WAIT * 2)
                        .then((data) => {

                            data.restApiId = restApiId;
                            data.resourceId = resourceId;
                            resolve(data);

                        });
                } else {
                    reject(e);
                }

            });

    });
};


let apigateway_GetResources = (restApiId, client, WAIT) => {
    return new Promise(async (resolve, reject) => {

        if (WAIT === undefined) {
            WAIT = 500;
        }
        WAIT += Math.random() * 1000;

        const pConfig = {
            client,
            pageSize: 150,
        };

        const cmdParams = {
            restApiId,
        };

        const paginator = paginateGetResources(pConfig, cmdParams);

        const arrPromisesR = [];

        try {

            for await (const page of paginator) {
                calls++;
                arrPromisesR.push(...page.items);
            }
        } catch (e) {

            if (e.name === 'TooManyRequestsException') {
                await new Promise(resolve => setTimeout(resolve, WAIT));
                arrPromisesR.push(apigateway_GetResources(restApiId, client, WAIT * 2));
            } else {
                reject(e);
            }
        }


        Promise.all(arrPromisesR)
            .then((arrResources) => {
                let arrPromisesM = [];

                let obj = {
                    RestApiResources: [],
                    RestApiMethods: [],
                };


                arrResources.forEach((oResource, i) => {

                    oResource.RestApiId = restApiId;
                    obj.RestApiResources.push(oResource);

                    if (oResource.resourceMethods !== undefined) {
                        Object.keys(oResource.resourceMethods).forEach((METHOD) => {
                            arrPromisesM.push(apigateway_GetMethod(METHOD, oResource.id, restApiId, client));
                        });
                    }

                });


                Promise.all(arrPromisesM)
                    .then((arrMP) => {

                        obj.RestApiMethods.push(...arrMP);

                        resolve(obj);

                    });

            });

    });
};


export let apigateway_GetRestApis = (region, credentials) => {
    return new Promise(async (resolve, reject) => {

        const client = new APIGatewayClient(
            {
                region,
                credentials,
            }
        );

        const pConfig = {
            client,
            pageSize: 200,
        };

        const cmdParams = {};

        const paginator = paginateGetRestApis(pConfig, cmdParams);

        const arr = [];

        try {
            for await (const page of paginator) {
                calls++;
                arr.push(...page.items)
            }
        } catch (e) {
            reject(e);
        }


        let arrPromisesR = [];


        arr.forEach((objRestApi, i) => {
            arrPromisesR.push(apigateway_GetResources(objRestApi.id, client));
        });


        Promise.all(arrPromisesR)
            .then((arrResources) => {

                let objReturn = {
                    [region]: {
                        RestApis: arr,
                        RestApiResources: [],
                        RestApiMethods: [],
                    }
                };

                arrResources.forEach((objResource) => {

                    objReturn[region].RestApiResources.push(...objResource.RestApiResources);
                    objReturn[region].RestApiMethods.push(...objResource.RestApiMethods);
                });

                resolve(objReturn);

            });

    });
};
