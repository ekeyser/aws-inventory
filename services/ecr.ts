'use strict';

import {ECRClient, paginateDescribeRepositories} from "@aws-sdk/client-ecr";
import {AwsCredentialIdentity} from "@aws-sdk/types";

let serviceCallManifest;

interface _catcher {
    handle: Function,
}

export function getPerms() {
    return [
        {
            "service": "ecr",
            "call": "DescribeRepositories",
            "permission": "DescribeRepositories",
            "initiator": true
        }
    ];
};


export let ecr_DescribeRepositories = (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => {
    return new Promise(async (resolve, reject) => {

        serviceCallManifest = svcCallsAll;
        const client = new ECRClient(
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

        const paginator = paginateDescribeRepositories(pConfig, cmdParams);

        const arr = [];
        const _arrC = [];

        try {

            for await (const page of paginator) {
                if (page.repositories) arr.push(...page.repositories);
                _arrC.push(catcher.handle(page.repositories, objAttribs));
            }
        } catch (e) {
            reject(e);
        }
        // this.objGlobal[region].ECRRepositories = arr;
        // resolve(`${region}/ecr_DescribeRepositories`);
        let obj = {
            [region]: {
                ECRRepositories: arr
            }
        };
        resolve(obj);
    });
};
