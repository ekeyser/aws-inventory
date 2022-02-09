'use strict';

import {
    CloudFrontClient,
    ListCachePoliciesCommand,
    paginateListDistributions
} from "@aws-sdk/client-cloudfront";


export function getPerms() {
    return [
        {
            "service": "cloudfront",
            "call": "ListCachePolicies",
            "permission": "ListCachePolicies",
            "initiator": true
        },
        {
            "service": "cloudfront",
            "call": "ListDistributions",
            "permission": "ListDistributions",
            "initiator": true
        }
    ];
};


export let cloudfront_ListCachePolicies = (region, credentials) => {
    return new Promise((resolve, reject) => {

        const client = new CloudFrontClient(
            {
                region,
                credentials
            }
        );

        let obj = {
            [region]: {
                CachePolicies: []
            }
        };

        client.send(new ListCachePoliciesCommand({}))
            .then((data) => {
                data.CachePolicyList.Items.forEach((cachePolicy) => {
                    // if (this.objGlobal[region].CachePolicies === undefined) {
                    //     this.objGlobal[region].CachePolicies = [];
                    // }
                    obj[region].CachePolicies.push(cachePolicy);

                    // this.objGlobal[region].CachePolicies.push(cachePolicy);
                });
                // resolve(`${region}/cloudfront_ListCachePolicies`);

                resolve(obj);
            })
            .catch((e) => {
                reject(e);
            });
    });
};


export let cloudfront_ListDistributions = (region, credentials) => {
    return new Promise(async (resolve, reject) => {

        const client = new CloudFrontClient(
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

        const paginator = paginateListDistributions(pConfig, cmdParams);

        const arr = [];

        try {

            for await (const page of paginator) {
                arr.push(...page.DistributionList.Items);
            }
        } catch (e) {
            reject(e);
        }

        let objGlobal = {
            [region]: {
                Distributions: arr
            }
        };
        resolve(objGlobal);
    });
};
