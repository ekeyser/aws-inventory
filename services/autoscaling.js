'use strict';


import {
    AutoScalingClient,
    paginateDescribeAutoScalingGroups,
    paginateDescribeLaunchConfigurations
} from "@aws-sdk/client-auto-scaling";

let serviceCallManifest;

export function getPerms() {
    return [
        {
            "service": "autoscaling",
            "call": "DescribeLaunchConfigurations",
            "permission": "DescribeLaunchConfigurations",
            "initiator": true
        },
        {
            "service": "autoscaling",
            "call": "DescribeAutoScalingGroups",
            "permission": "DescribeAutoScalingGroups",
            "initiator": true
        }
    ];
}


export let autoscaling_DescribeAutoScalingGroups = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {

        serviceCallManifest = svcCallsAll;
        const client = new AutoScalingClient(
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

        const paginator = paginateDescribeAutoScalingGroups(pConfig, cmdParams);

        const arr = [];
        const _arrc = [];

        try {

            for await (const page of paginator) {
                arr.push(...page.AutoScalingGroups);
                _arrC.push(catcher.handle(page.AutoScalingGroups, objAttribs));
            }
        } catch (e) {
            reject(e);
        }

        // this.objGlobal[region].AutoScalingGroups = arr;
        // resolve(`${region}/autoscaling_DescribeAutoScalingGroups`);
        let obj = {
            [region]: {
                AutoScalingGroups: arr
            }
        };
        resolve(obj);
    });
};


export let autoscaling_DescribeLaunchConfigurations = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {

        serviceCallManifest = svcCallsAll;
        const client = new AutoScalingClient(
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

        const paginator = paginateDescribeLaunchConfigurations(pConfig, cmdParams);

        const arr = [];
        const _arrc = [];

        try {

            for await (const page of paginator) {
                arr.push(...page.LaunchConfigurations);
                _arrC.push(catcher.handle(page.LaunchConfigurations, objAttribs));
            }

        } catch (e) {
            reject(e);
        }

        // this.objGlobal[region].LaunchConfigurations = arr;
        // resolve(`${region}/autoscaling_DescribeLaunchConfigurations`);
        let obj = {
            [region]: {
                LaunchConfigurations: arr
            }
        };
        resolve(obj);
    });
};
