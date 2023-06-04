'use strict';

import {
    SQSClient,
    GetQueueAttributesCommand,
    paginateListQueues, GetQueueAttributesCommandOutput,
} from '@aws-sdk/client-sqs';
import {AwsCredentialIdentity} from "@aws-sdk/types";

let serviceCallManifest;

interface _catcher {
    handle: Function,
}

export function getPerms() {
    return [
        {
            "service": "sqs",
            "call": "GetQueueAttributes",
            "permission": "GetQueueAttributes",
            "initiator": false
        },
        {
            "service": "sqs",
            "call": "ListQueues",
            "permission": "ListQueues",
            "initiator": true
        }
    ];
}


function sqs_GetQueueAttributes(QueueUrl: string, client: SQSClient, objAttribs: {}, catcher: _catcher): Promise<GetQueueAttributesCommandOutput> {
    return new Promise((resolve, reject) => {

        client.send(new GetQueueAttributesCommand(
            {
                AttributeNames: [
                    'All'
                ],
                QueueUrl,
            }
        ))
            .then((data) => {
                resolve(data);
            })
            .catch((err: Error) => {
                reject(err);
            });
    });
}


export function sqs_ListQueues(region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) {
    return new Promise(async (resolve, reject) => {

        serviceCallManifest = svcCallsAll;
        let client = new SQSClient({
            region,
            credentials,
        });

        const pConfig = {
            client,
            pageSize: 100,
        };

        const cmdParams = {};

        const paginator = paginateListQueues(pConfig, cmdParams);

        const arr = [];
        const arr2 = [];

        try {

            for await (const page of paginator) {
                if (page.QueueUrls !== undefined) {
                    arr.push(...page.QueueUrls);
                    arr2.push(catcher.handle(page.QueueUrls, objAttribs))
                }
            }

        } catch (e) {
            reject(e);
        }

        const arrQueues = [];

        for (let i = 0; i < arr.length; i++) {
            let QueueUrl = arr[i];
            let Queue = await sqs_GetQueueAttributes(QueueUrl, client, objAttribs, catcher);
            if (Queue.Attributes) Queue.Attributes.QueueUrl = QueueUrl;
            arrQueues.push(Queue);
        }

        // this.objGlobal[region].Queues = arrQueues;
        // resolve(`${region}/sqs_ListQueues`);
        let objGlobal = {
            [region]: {
                Queues: arrQueues
            }
        };
        resolve(objGlobal);
    });
}
