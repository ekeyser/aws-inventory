'use strict';

import {ECRClient, paginateDescribeRepositories} from "@aws-sdk/client-ecr";

let serviceCallManifest;

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


export let ecr_DescribeRepositories = (region, credentials, svcCallsAll) => {
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

        try {

            for await (const page of paginator) {
                arr.push(...page.repositories);
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
