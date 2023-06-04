'use strict';

import {LambdaClient, paginateListFunctions} from "@aws-sdk/client-lambda";
import {AwsCredentialIdentity} from "@aws-sdk/types";

let serviceCallManifest;

interface _catcher {
    handle: Function,
}

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


export let lambda_ListFunctions = (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => {
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
        const _arrC = [];

        try {

            for await (const page of paginator) {
                // oRC.incr();
                if (page.Functions) arr.push(...page.Functions);
                // catcher.handle(page.Functions);
                // console.log(objAttribs)
                _arrC.push(catcher.handle(page.Functions, objAttribs));
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
