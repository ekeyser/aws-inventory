'use strict';

import {
    DescribeLoadBalancerAttributesCommand,
    ElasticLoadBalancingV2Client, paginateDescribeLoadBalancers
} from "@aws-sdk/client-elastic-load-balancing-v2";

let serviceCallManifest;

export function getPerms() {
    return [
        {
            "service": "elasticloadbalancing",
            "call": "DescribeLoadBalancerAttributes",
            "permission": "DescribeLoadBalancerAttributes",
            "initiator": false
        },
        {
            "service": "elasticloadbalancing",
            "call": "DescribeLoadBalancers",
            "permission": "DescribeLoadBalancers",
            "initiator": true
        },
        {
            "service": "elasticloadbalancing",
            "call": "DescribeTargetGroups",
            "permission": "DescribeTargetGroups",
            "initiator": false
        }
    ];
}


let elasticloadbalancing_DescribeLoadBalancerAttributes = (loadbalancer, client, objAttribs, catcher) => {
    return new Promise((resolve, reject) => {

        client.send(new DescribeLoadBalancerAttributesCommand(
            {
                LoadBalancerArn: loadbalancer.LoadBalancerArn,
            }
        ))
            .then((data) => {
                resolve(data.Attributes);
            })
            .catch((err) => {
                reject(err);
            });
    });
};


export let elasticloadbalancing_DescribeLoadBalancers = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {

        serviceCallManifest = svcCallsAll;
        const client = new ElasticLoadBalancingV2Client(
            {
                region,
                credentials,
            }
        );

        const pConfig = {
            client,
            pageSize: 100,
        };

        const cmdParams = {};

        const paginator = paginateDescribeLoadBalancers(pConfig, cmdParams);

        const arr = [];
        const _arrC = [];

        try {

            for await (const page of paginator) {
                arr.push(...page.LoadBalancers);
                _arrC.push(catcher.handle(page.LoadBalancers, objAttribs));
            }
        } catch (e) {
            reject(e);
        }
        const arrLoadBalancers = [];

        for (let i = 0; i < arr.length; i++) {
            let loadBalancer = arr[i];
            let Attributes = await elasticloadbalancing_DescribeLoadBalancerAttributes(loadBalancer, client);
            loadBalancer.Attributes = Attributes;
            arrLoadBalancers.push(loadBalancer);
        }

        let obj = {
            [region]: {
                ApplicationLoadBalancers: arrLoadBalancers
            }
        };
        resolve(obj);
    });
};
