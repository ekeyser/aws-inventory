'use strict';

import {
    SFNClient,
    DescribeStateMachineCommand,
    DescribeActivityCommand,
    paginateListActivities,
    paginateListExecutions,
    paginateListStateMachines, DescribeStateMachineCommandOutput, DescribeActivityCommandOutput,
} from '@aws-sdk/client-sfn';
import {AwsCredentialIdentity} from "@aws-sdk/types";

let serviceCallManifest;

interface _catcher {
    handle: Function,
}

export function getPerms() {
    return [
        {
            "service": "states",
            "call": "ListActivities",
            "permission": "ListActivities",
            "initiator": true,
        },
        // {
        //   "service": "states",
        //   "call": "ListExecutions",
        //   "permission": "ListExecutions",
        //   "initiator": true,
        // },
        {
            "service": "states",
            "call": "DescribeActivity",
            "permission": "DescribeActivity",
            "initiator": false
        },
        {
            "service": "states",
            "call": "DescribeStateMachine",
            "permission": "DescribeStateMachine",
            "initiator": false
        },
        {
            "service": "states",
            "call": "ListStateMachines",
            "permission": "ListStateMachines",
            "initiator": true
        }
    ];
}


function states_DescribeActivity(activityArn: string, client: SFNClient, objAttribs: {}, catcher: _catcher) {
    // return new Promise((resolve, reject) => {

    return client.send(new DescribeActivityCommand(
        {
            activityArn,
        }
    ));
    // .then((data) => {
    //     resolve(data);
    // })
    // .catch((err) => {
    //     reject(err);
    // });

    // });
}


function states_DescribeStateMachine(stateMachineArn: string, client: SFNClient, objAttribs: {}, catcher: _catcher) {
    // return new Promise((resolve, reject) => {

    return client.send(new DescribeStateMachineCommand(
        {
            stateMachineArn,
        }
    ));
    // .then((data) => {
    //     resolve(data);
    // })
    // .catch((err) => {
    //     reject(err);
    // });

    // });
}


export function states_ListActivities(region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) {
    return new Promise(async (resolve, reject) => {

        serviceCallManifest = svcCallsAll;
        let client = new SFNClient({
            region,
            credentials,
        });

        const pConfig = {
            client,
        };

        const cmdParams = {};

        const paginator = paginateListActivities(pConfig, cmdParams);

        const arr = [];
        const _arrC = [];

        try {

            for await (const page of paginator) {
                if (page.activities) arr.push(...page.activities);
                _arrC.push(catcher.handle(page.activities, objAttribs));
            }

        } catch (e) {
            reject(e);
        }

        const arrPromisesActivities: Promise<DescribeActivityCommandOutput>[] = [];

        arr.forEach((activity) => {
            if (activity.activityArn) arrPromisesActivities.push(states_DescribeActivity(activity.activityArn, client, objAttribs, catcher));
        });

        Promise.all(arrPromisesActivities)
            .then((arrActivities) => {

                let objGlobal = {
                    [region]: {
                        Activities: arrActivities
                    }
                };
                resolve(objGlobal);

            });

    });
}


export function states_ListStateMachines(region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) {
    return new Promise(async (resolve, reject) => {

        serviceCallManifest = svcCallsAll;
        let client = new SFNClient({
            region,
            credentials,
        });

        const pConfig = {
            client,
        };

        const cmdParams = {};

        const paginator = paginateListStateMachines(pConfig, cmdParams);

        const arr = [];
        const _arrC = [];

        try {

            for await (const page of paginator) {
                if (page.stateMachines) arr.push(...page.stateMachines);
                _arrC.push(catcher.handle(page.stateMachines, objAttribs));
            }

        } catch (e) {
            reject(e);
        }

        const arrPromisesStateMachines: Promise<DescribeStateMachineCommandOutput>[] = [];

        arr.forEach((stateMachine) => {
            if (stateMachine.stateMachineArn) arrPromisesStateMachines.push(states_DescribeStateMachine(stateMachine.stateMachineArn, client, objAttribs, catcher));
        });

        Promise.all(arrPromisesStateMachines)
            .then((arrStateMachines) => {

                let objGlobal = {
                    [region]: {
                        StateMachines: arrStateMachines
                    }
                };
                resolve(objGlobal);

            });

    });
}
