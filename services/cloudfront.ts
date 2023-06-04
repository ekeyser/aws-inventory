'use strict';

import {
    CachePolicySummary,
    CloudFrontClient,
    ListCachePoliciesCommand,
    paginateListDistributions
} from "@aws-sdk/client-cloudfront";
import {AwsCredentialIdentity} from "@aws-sdk/types";

let serviceCallManifest;

interface _catcher {
    handle: Function,
}

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


export let cloudfront_ListCachePolicies = (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => {
    return new Promise((resolve, reject) => {

        serviceCallManifest = svcCallsAll;
        const client = new CloudFrontClient(
            {
                region,
                credentials
            }
        );

        let obj: {
            [key: string]: {
                CachePolicies: CachePolicySummary[],
            }
        } = {
            [region]: {
                CachePolicies: [],
            }
        };
        const _arrC = [];

        client.send(new ListCachePoliciesCommand({}))
            .then((data) => {
                if (data.CachePolicyList && data.CachePolicyList.Items) {

                    data.CachePolicyList.Items.forEach((cachePolicySummary) => {
                        // if (this.objGlobal[region].CachePolicies === undefined) {
                        //     this.objGlobal[region].CachePolicies = [];
                        // }
                        obj[region].CachePolicies.push(cachePolicySummary);
                        _arrC.push(catcher.handle(cachePolicySummary, objAttribs));

                        // this.objGlobal[region].CachePolicies.push(cachePolicy);
                    });
                    // resolve(`${region}/cloudfront_ListCachePolicies`);
                }

                resolve(obj);
            })
            .catch((e) => {
                reject(e);
            });
    });
};


export let cloudfront_ListDistributions = (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => {
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
                if (page.DistributionList) {

                    if (page.DistributionList.Items) arr.push(...page.DistributionList.Items);
                    _arrC.push(catcher.handle(page.DistributionList.Items, objAttribs));
                }
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
