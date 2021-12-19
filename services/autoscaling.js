'use strict';


import {
    AutoScalingClient,
    paginateDescribeAutoScalingGroups,
    paginateDescribeLaunchConfigurations
} from "@aws-sdk/client-auto-scaling";

export let autoscaling_DescribeAutoScalingGroups = (region, credentials) => {
    return new Promise(async (resolve, reject) => {

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

        try {

            for await (const page of paginator) {
                arr.push(...page.AutoScalingGroups);
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


export let autoscaling_DescribeLaunchConfigurations = (region, credentials) => {
    return new Promise(async (resolve, reject) => {

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

        try {

            for await (const page of paginator) {
                arr.push(...page.LaunchConfigurations);
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
