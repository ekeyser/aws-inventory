'use strict';

import {CloudWatchClient, paginateDescribeAlarms} from "@aws-sdk/client-cloudwatch";


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


export let cloudwatch_DescribeAlarms = (region, credentials, oRC) => {
    return new Promise(async (resolve, reject) => {

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
                // oRC.incr();
                arr.push(...page.MetricAlarms);
            }

        } catch (e) {
            // oRC.incr();
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
