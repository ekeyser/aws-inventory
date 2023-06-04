'use strict';

import {
    SNSClient,
    paginateListSubscriptions,
    paginateListTopics,
    GetTopicAttributesCommand,
    GetSubscriptionAttributesCommand, Topic, Subscription, GetTopicAttributesCommandOutput,
} from '@aws-sdk/client-sns';
import {AwsCredentialIdentity} from "@aws-sdk/types";

let serviceCallManifest;

interface _catcher {
    handle: Function,
}

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
}


let sns_GetSubscriptionAttributes = (SubscriptionArn: string, client: SNSClient, objAttribs: {}, catcher: _catcher) => {
    // return new Promise((resolve, reject) => {

    // if (SubscriptionArn !== 'PendingConfirmation') {

    return client.send(new GetSubscriptionAttributesCommand(
        {
            SubscriptionArn
        }
    ));
    // .then((data) => {
    //     resolve(data);
    // })
    // .catch((err) => {
    //     reject(err);
    // });

    // }
    // });
};


export let sns_ListSubscriptions = (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => {
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

        const arr: Subscription[] = [];
        const arr2 = [];
        const _arr: {
            Subscription: Subscription,
            Attributes?: Record<string, string>
        }[] = []


        for await (const page of paginator) {
            if (page.Subscriptions) arr.push(...page.Subscriptions);
            arr2.push(catcher.handle(page.Subscriptions, objAttribs))
        }


        let arr3 = [];

        arr3.push(arr.forEach((Subscription, i) => {
            if (Subscription.SubscriptionArn) {

                sns_GetSubscriptionAttributes(Subscription.SubscriptionArn, client, objAttribs, catcher)
                    .then((p) => {

                        // arr[i].Attributes = p.Attributes;
                        _arr.push(
                            {
                                Subscription: Subscription,
                                Attributes: p.Attributes,
                            },
                        )

                    });
            }
        }));

        Promise.all(arr3)
            .then((aP) => {

                let objGlobal = {
                    [region]: {
                        Subscriptions: _arr
                    }
                };
                resolve(objGlobal);

            });

    });
};


let sns_GetTopicAttributes = (TopicArn: string, client: SNSClient, objAttribs: {}, catcher: _catcher) => {
    // return new Promise((resolve, reject) => {

    const cmd = new GetTopicAttributesCommand(
        {
            TopicArn,
        }
    );
    return client.send(cmd);
    // return client.send(cmd);
    //     client.send(new GetTopicAttributesCommand(
    //         {
    //             TopicArn
    //         }
    //     ))
    //         .then((data) => {
    //             resolve(data);
    //         })
    //         .catch((err) => {
    //             reject(err);
    //         });

    // });
};


export let sns_ListTopics = (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => {
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

        const arr: Topic[] = [];
        // const arr: {
        //     Attributes?: {},
        //     Topics: Topic[],
        // }[] = [];
        const arr2 = [];

        const _arr: {
            Topic: Topic,
            Attributes?: Record<string, string>,
        }[] = [];

        for await (const page of paginator) {
            if (page.Topics) arr.push(...page.Topics);
            arr2.push(catcher.handle(page.Topics, objAttribs))
        }

        let arr3: Promise<GetTopicAttributesCommandOutput | void>[] = [];


        arr.forEach((_topic, i) => {

            if (_topic.TopicArn) {
                arr3.push(sns_GetTopicAttributes(_topic.TopicArn, client, objAttribs, catcher)
                    .then((p) => {
                        // arr[i].Attributes = p.Attributes;
                        // const _obj: {
                        //     Topic: Topic,
                        //     Attributes?: Record<string, string>,
                        // } = {
                        //     Topic: _topic,
                        //     Attributes: p.Attributes,
                        // };
                        _arr.push(
                            {
                                Topic: _topic,
                                Attributes: p.Attributes,

                            }
                        );
                    }));
            }
        });
        // arr3.push(arr.forEach((Topic, i) => {
        //     sns_GetTopicAttributes(Topic.TopicArn, client, objAttribs, catcher)
        //         .then((p) => {
        //
        //             arr[i].Attributes = p.Attributes;
        //
        //         });
        // }));

        Promise.all(arr3)
            .then((aP) => {

                let objGlobal = {
                    [region]: {
                        Topics: _arr
                    }
                };
                resolve(objGlobal);

            });
    });
}
