'use strict';

import {
    SQSClient,
    GetQueueAttributesCommand,
    paginateListQueues,
} from '@aws-sdk/client-sqs';


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
};


export function sqs_GetQueueAttributes(QueueUrl, client) {
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
            .catch((err) => {
                reject(err);
            });
    });
}


export function sqs_ListQueues(region, credentials) {
    return new Promise(async (resolve, reject) => {

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

        try {

            for await (const page of paginator) {
                if (page.QueueUrls !== undefined) {
                    arr.push(...page.QueueUrls);
                }
            }

        } catch (e) {
            reject(e);
        }

        const arrQueues = [];

        for (let i = 0; i < arr.length; i++) {
            let QueueUrl = arr[i];
            let Queue = await sqs_GetQueueAttributes(QueueUrl, client);
            Queue.Attributes.QueueUrl = QueueUrl;
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
