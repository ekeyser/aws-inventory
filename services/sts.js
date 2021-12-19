'use strict';

import {
    STSClient,
    GetCallerIdentityCommand,
} from '@aws-sdk/client-sts';


export let sts_GetCallerIdentity = (region, credentials) => {
    return new Promise((resolve, reject) => {

        let client = new STSClient({
            region,
            credentials,
        });

        client.send(new GetCallerIdentityCommand({}))
            .then((data) => {
                resolve(data);
            })
            .catch((e) => {
                reject(e);
            });

    });
};
