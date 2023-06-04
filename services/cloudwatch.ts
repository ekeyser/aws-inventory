'use strict';

import {CloudWatchClient, paginateDescribeAlarms} from "@aws-sdk/client-cloudwatch";
import {AwsCredentialIdentity} from "@aws-sdk/types";

let serviceCallManifest;

interface _catcher {
    handle: Function,
}

export function getPerms() {
    return [
        {
            "service": "cloudwatch",
            "call": "DescribeAlarms",
            "permission": "DescribeAlarms",
            "initiator": true
        }
    ];
}


export let cloudwatch_DescribeAlarms = (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => {
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
        const _arrC = [];

        try {

            for await (const page of paginator) {
                if (page.MetricAlarms) arr.push(...page.MetricAlarms);
                _arrC.push(catcher.handle(page.MetricAlarms, objAttribs));
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
