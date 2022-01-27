'use strict';

import {ECRClient, paginateDescribeRepositories} from "@aws-sdk/client-ecr";


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


export let ecr_DescribeRepositories = (region, credentials, oRC) => {
    return new Promise(async (resolve, reject) => {

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
                // oRC.incr();
                arr.push(...page.repositories);
            }
        } catch (e) {
            // oRC.incr();
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
