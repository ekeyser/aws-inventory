'use strict';


import {
    STSClient,
    GetCallerIdentityCommand,
} from '@aws-sdk/client-sts';
import {AwsCredentialIdentity} from "@aws-sdk/types";


export function getPerms() {
    return [
        {
            "service": "sts",
            "call": "GetCallerIdentity",
            "permission": "GetCallerIdentity",
            "initiator": false
        }
    ];
}


export let sts_GetCallerIdentity = (region: string, credentials: AwsCredentialIdentity) => {
    // return new Promise((resolve, reject) => {

    let client = new STSClient({
        region,
        credentials,
    });

    return client.send(new GetCallerIdentityCommand({}));
    // .then(async (data) => {
    //     await catcher.handle(data, objAttribs);
    //     // oRC.incr(SVC);
    //     resolve(data);
    // })
    // .catch((e) => {
    //     // oRC.incr(SVC);
    //     reject(e);
    // });

    // });
};
