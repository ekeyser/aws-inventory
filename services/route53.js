'use strict';

import {
    Route53Client,
    paginateListHostedZones,
} from '@aws-sdk/client-route-53';

let serviceCallManifest;

export function getPerms() {
    return [
        {
            "service": "route53",
            "call": "ListHostedZones",
            "permission": "ListHostedZones",
            "initiator": true
        }
    ];
};


export let route53_ListHostedZones = (region, credentials, svcCallsAll) => {
    return new Promise(async (resolve, reject) => {

      serviceCallManifest = svcCallsAll;
        let client = new Route53Client({
            region,
            credentials,
        });

        const pConfig = {
            client,
            pageSize: 100,
        };

        const cmdParams = {};

        const paginator = paginateListHostedZones(pConfig, cmdParams);

        const arr = [];

        try {

            for await (const page of paginator) {
                arr.push(...page.HostedZones);
            }
        } catch (e) {
            reject(e);
        }

        let obj = {
            [region]: {
                HostedZones: arr
            }
        };
        resolve(obj);
    });
};
