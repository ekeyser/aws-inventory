'use strict';

import {
    CloudFrontClient,
    ListCachePoliciesCommand,
    paginateListDistributions
} from "@aws-sdk/client-cloudfront";

let serviceCallManifest;

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
}


export let cloudfront_ListCachePolicies = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise((resolve, reject) => {

        serviceCallManifest = svcCallsAll;
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
        const _arrC = [];

        client.send(new ListCachePoliciesCommand({}))
            .then((data) => {
                data.CachePolicyList.Items.forEach((cachePolicy) => {
                    // if (this.objGlobal[region].CachePolicies === undefined) {
                    //     this.objGlobal[region].CachePolicies = [];
                    // }
                    obj[region].CachePolicies.push(cachePolicy);
                    _arrC.push(catcher.handle(cachePolicy, objAttribs));

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


export let cloudfront_ListDistributions = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {

        serviceCallManifest = svcCallsAll;
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
        const _arrC = [];

        try {

            for await (const page of paginator) {
                arr.push(...page.DistributionList.Items);
                _arrC.push(catcher.handle(page.DistributionList.Items, objAttribs));
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
