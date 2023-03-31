'use strict';

import {
    SNSClient,
    paginateListSubscriptions,
    paginateListTopics,
    GetTopicAttributesCommand,
    GetSubscriptionAttributesCommand,
} from '@aws-sdk/client-sns';

let serviceCallManifest;

export function getPerms() {
    return [
        {
            "service": "sns",
            "call": "GetTopicAttributes",
            "permission": "GetTopicAttributes",
            "initiator": false
        },
        {
            "service": "sns",
            "call": "ListTopics",
            "permission": "ListTopics",
            "initiator": true
        },
        {
            "service": "sns",
            "call": "GetSubscriptionAttributes",
            "permission": "GetSubscriptionAttributes",
            "initiator": false
        },
        {
            "service": "sns",
            "call": "ListSubscriptions",
            "permission": "ListSubscriptions",
            "initiator": true
        }
    ];
};


let sns_GetSubscriptionAttributes = (SubscriptionArn, client, objAttribs, catcher) => {
    return new Promise((resolve, reject) => {

        if (SubscriptionArn !== 'PendingConfirmation') {

            client.send(new GetSubscriptionAttributesCommand(
                {
                    SubscriptionArn
                }
            ))
                .then((data) => {
                    resolve(data);
                })
                .catch((err) => {
                    reject(err);
                });

        }
    });
};


export let sns_ListSubscriptions = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {

        serviceCallManifest = svcCallsAll;
        let client = new SNSClient({
            region,
            credentials,
        });

        const pConfig = {
            client,
            pageSize: 100,
        };

        const cmdParams = {};

        const paginator = paginateListSubscriptions(pConfig, cmdParams);

        const arr = [];
        const arr2 = [];

        try {

            for await (const page of paginator) {
                arr.push(...page.Subscriptions);
                arr2.push(catcher.handle(page.Subscriptions, objAttribs))
            }

        } catch (e) {
            reject(e);
        }


        let arr3 = [];

        arr3.push(arr.forEach((Subscription, i) => {
            sns_GetSubscriptionAttributes(Subscription.SubscriptionArn, client)
                .then((p) => {

                    arr[i].Attributes = p.Attributes;

                });
        }));

        Promise.all(arr3)
            .then((aP) => {

                let objGlobal = {
                    [region]: {
                        Subscriptions: arr
                    }
                };
                resolve(objGlobal);

            });

    });
};


let sns_GetTopicAttributes = (TopicArn, client, objAttribs, catcher) => {
    return new Promise((resolve, reject) => {

        client.send(new GetTopicAttributesCommand(
            {
                TopicArn
            }
        ))
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });

    });
};


export let sns_ListTopics = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {

        serviceCallManifest = svcCallsAll;
        let client = new SNSClient({
            region,
            credentials,
        });

        const pConfig = {
            client,
            pageSize: 100,
        };

        const cmdParams = {};

        const paginator = paginateListTopics(pConfig, cmdParams);

        const arr = [];
        const arr2 = [];

        try {

            for await (const page of paginator) {
                arr.push(...page.Topics);
                arr2.push(catcher.handle(page.Topics, objAttribs))
            }

        } catch (e) {
            reject(e);
        }

        let arr3 = [];

        arr3.push(arr.forEach((Topic, i) => {
            sns_GetTopicAttributes(Topic.TopicArn, client)
                .then((p) => {

                    arr[i].Attributes = p.Attributes;

                });
        }));

        Promise.all(arr3)
            .then((aP) => {

                let objGlobal = {
                    [region]: {
                        Topics: arr
                    }
                };
                resolve(objGlobal);

            });
    });
}
