'use strict';

import {
    APIGatewayClient,
    GetMethodCommand,
    paginateGetResources,
    paginateGetRestApis,
} from '@aws-sdk/client-api-gateway';

let apigateway_GetMethod = (httpMethod, resourceId, restApiId, client) => {
    return new Promise((resolve, reject) => {

        client.send(new GetMethodCommand(
            {
                httpMethod,
                resourceId,
                restApiId,
            }
        ))
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};


let apigateway_GetResources = (restApiId, client) => {
    return new Promise(async (resolve, reject) => {

        const pConfig = {
            client,
            pageSize: 100,
        };

        const cmdParams = {
            restApiId,
        };

        const paginator = paginateGetResources(pConfig, cmdParams);

        const arr = [];

        try {

            for await (const page of paginator) {
                arr.push(page.items);
            }
        } catch (e) {
            reject(e);
        }

        const arrResources = [];
        for (let i = 0; i < arr.length; i++) {
            let Resource = arr[i];
            if (Resource.Methods === undefined) {
                Resource.Methods = [];
            }
            let arrResourceMethods = [];
            if (Resource.resourceMethods !== undefined) {
                arrResourceMethods = Object.keys(Resource.resourceMethods);
            }
            for (let j = 0; j < arrResourceMethods.length; j++) {
                let METHOD = arrResourceMethods[j];
                let oMethod = await apigateway_GetMethod(METHOD, Resource.id, restApiId, client);
                Resource.Methods.push(oMethod);
            }
            arrResources.push(Resource);
        }

        resolve(arrResources);
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
            pageSize: 100,
        };

        const cmdParams = {};

        const paginator = paginateGetRestApis(pConfig, cmdParams);

        const arr = [];

        try {

            for await (const page of paginator) {
                arr.push(...page.items)
            }
        } catch (e) {
            reject(e);
        }

        for (let i = 0; i < arr.length; i++) {
            let RestApi = arr[i];
            const arrResources = await apigateway_GetResources(RestApi.id, client);
            arr[i].Resources = arrResources;
        }

        let obj = {
            [region]: {
                RestApis: arr
            }
        };
        resolve(obj);

    });
};