'use strict';

import {
    DescribeLoadBalancerAttributesCommand,
    DescribeLoadBalancerAttributesCommandOutput,
    ElasticLoadBalancingV2Client, LoadBalancer,
    paginateDescribeLoadBalancers
} from "@aws-sdk/client-elastic-load-balancing-v2";
import {AwsCredentialIdentity} from "@aws-sdk/types";

let serviceCallManifest;

interface _catcher {
    handle: Function,
}

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


let elasticloadbalancing_DescribeLoadBalancerAttributes = (loadbalancer: LoadBalancer, client: ElasticLoadBalancingV2Client, objAttribs: {}, catcher: _catcher): Promise<DescribeLoadBalancerAttributesCommandOutput> => {
    return new Promise((resolve, reject) => {

        client.send(new DescribeLoadBalancerAttributesCommand(
            {
                LoadBalancerArn: loadbalancer.LoadBalancerArn,
            }
        ))
            .then((data: DescribeLoadBalancerAttributesCommandOutput) => {
                resolve(data);
            })
            .catch((err: Error) => {
                reject(err);
            });
    });
};


export let elasticloadbalancing_DescribeLoadBalancers = (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => {
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
                if (page.LoadBalancers) arr.push(...page.LoadBalancers);
                _arrC.push(catcher.handle(page.LoadBalancers, objAttribs));
            }
        } catch (e) {
            reject(e);
        }
        const arrLoadBalancers = [];


        for (let i = 0; i < arr.length; i++) {
            let loadBalancer = arr[i];
            const _attribs = await elasticloadbalancing_DescribeLoadBalancerAttributes(loadBalancer, client, objAttribs, catcher);
            const objLoadBalancer = {
                Attributes: _attribs,
                LoadBalancer: loadBalancer,
            };
            arrLoadBalancers.push(objLoadBalancer);
        }

        let obj = {
            [region]: {
                ApplicationLoadBalancers: arrLoadBalancers
            }
        };
        resolve(obj);
    });
};
