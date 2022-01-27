'use strict';

import {
    APIGatewayClient,
    GetMethodCommand,
    paginateGetResources,
    paginateGetRestApis,
} from '@aws-sdk/client-api-gateway';

const SVC = 'apigateway';

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


let apigateway_GetMethod = (httpMethod, resourceId, restApiId, region, credentials, client, oRC) => {
    return new Promise(async (resolve, reject) => {

        await oRC.pauser();
        client.send(new GetMethodCommand(
            {
                httpMethod,
                resourceId,
                restApiId,
            }
        ))
            .then(async (data) => {
                // oRC.incr(SVC);
                data.restApiId = restApiId;
                data.resourceId = resourceId;
                resolve(data);
            })
            .catch(async (err) => {
                oRC.pauser(SVC)
                    .then((bool) => {

                        apigateway_GetMethod(httpMethod, resourceId, restApiId, region, credentials, client, oRC);

                    });
            });
    });
};


let apigateway_GetResources = (restApiId, region, credentials, client, oRC) => {
    return new Promise(async (resolve, reject) => {

        const pConfig = {
            client,
            pageSize: 150,
        };

        const cmdParams = {
            restApiId,
        };

        const paginator = paginateGetResources(pConfig, cmdParams);

        const arr = [];

        try {

            for await (const page of paginator) {
                // oRC.incr(SVC);
                await oRC.pauser();
                arr.push(...page.items);
            }
        } catch (e) {

            switch (e.name) {
                case 'TooManyRequestsException':
                    oRC.pauser(SVC)
                        .then((bool) => {

                            apigateway_GetResources(restApiId, region, credentials, client, oRC);

                        });
                    break;
                default:
                    // console.warn(`Problem w requestSender on Fn '${fName}' for region ${region}.`);
                    // console.log(e.name);
                    // console.log(Object.keys(e));
                    reject(e);
            }
        }


        let arr2 = [];


        arr.forEach((oResource) => {

            if (oResource.resourceMethods !== undefined) {

                Object.keys(oResource.resourceMethods).forEach((METHOD) => {

                    arr2.push(apigateway_GetMethod(METHOD, oResource.id, restApiId, region, credentials, client, oRC));

                });

            }

        });


        Promise.all(arr2)
            .then((arrP) => {


                let objGlobal = {
                    [region]: {
                        RestApiResources: [...arrP]
                    }
                };


                resolve(objGlobal);

            });

    });
};


export let apigateway_GetRestApis = (region, credentials, oRC) => {
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
                // oRC.incr(SVC);
                await oRC.pauser();
                arr.push(...page.items)
            }
        } catch (e) {
            reject(e);
        }


        let objGlobal = {
            [region]: {
                RestApis: arr
            }
        };


        let arr2 = [];


        arr.forEach(async (objRestApi) => {
            arr2.push(apigateway_GetResources(objRestApi.id, region, credentials, client, oRC));
        });


        Promise.all(arr2)
            .then((arrP) => {

                let obj = {
                    [region]: {
                        RestApis: [...arrP]
                    }
                };
                resolve(obj);

            });

    });
};
