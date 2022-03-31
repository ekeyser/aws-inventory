'use strict';

import {CloudWatchClient, paginateDescribeAlarms} from "@aws-sdk/client-cloudwatch";

let serviceCallManifest;

export function getPerms() {
    return [
        {
            "service": "cloudwatch",
            "call": "DescribeAlarms",
            "permission": "DescribeAlarms",
            "initiator": true
        }
    ];
};


export let cloudwatch_DescribeAlarms = (region, credentials, svcCallsAll) => {
    return new Promise(async (resolve, reject) => {

      serviceCallManifest = svcCallsAll;
        const client = new CloudWatchClient(
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

        const paginator = paginateDescribeAlarms(pConfig, cmdParams);

        const arr = [];

        try {

            for await (const page of paginator) {
                arr.push(...page.MetricAlarms);
            }

        } catch (e) {
            reject(e);
        }

        // this.objGlobal[region].MetricAlarms = arr;
        // resolve(`${region}/cloudwatch_DescribeAlarms`);
        let obj = {
            [region]: {
                MetricAlarms: arr
            }
        };
        resolve(obj);
    });
};
