'use strict';

import {
    STSClient,
    GetCallerIdentityCommand,
} from '@aws-sdk/client-sts';


export function getPerms() {
    return [
        {
            "service": "sts",
            "call": "GetCallerIdentity",
            "permission": "GetCallerIdentity",
            "initiator": false
        }
    ];
};


export let sts_GetCallerIdentity = (region, credentials, objAttribs, catcher) => {
    return new Promise((resolve, reject) => {

        let client = new STSClient({
            region,
            credentials,
        });

        client.send(new GetCallerIdentityCommand({}))
            .then((data) => {
                // oRC.incr(SVC);
                resolve(data);
            })
            .catch((e) => {
                // oRC.incr(SVC);
                reject(e);
            });

    });
};
