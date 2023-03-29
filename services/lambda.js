'use strict';

import {LambdaClient, paginateListFunctions} from "@aws-sdk/client-lambda";

let serviceCallManifest;

export function getPerms() {
    return [
        {
            "service": "lambda",
            "call": "ListFunctions",
            "permission": "ListFunctions",
            "initiator": true
        }
    ];
};


export let lambda_ListFunctions = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {

        serviceCallManifest = svcCallsAll;
        const client = new LambdaClient(
            {
                region,
                credentials
            }
        );


        const pConfig = {
            client,
            pageSize: 100,
        };

        const cmdParams = {};

        const paginator = paginateListFunctions(pConfig, cmdParams);

        const arr = [];
        const arr2 = [];

        try {

            for await (const page of paginator) {
                // oRC.incr();
                arr.push(...page.Functions);
                // catcher.handle(page.Functions);
                // console.log(objAttribs)
                arr2.push(catcher.handle(page.Functions, objAttribs))
            }

        } catch (e) {
            // oRC.incr();
            reject(e);
        }

        // this.objGlobal[region].Functions = arr;
        // resolve(`${region}/lambda_ListFunctions`);
        let obj = {
            [region]: {
                Functions: arr
            }
        };
        resolve(obj);
    });
};
