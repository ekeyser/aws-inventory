'use strict';

import {
    Route53Client,
    paginateListHostedZones,
} from '@aws-sdk/client-route-53';


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


export let route53_ListHostedZones = (region, credentials, oRC) => {
    return new Promise(async (resolve, reject) => {

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
                // oRC.incr();
                arr.push(...page.HostedZones);
            }
        } catch (e) {
            // oRC.incr();
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
