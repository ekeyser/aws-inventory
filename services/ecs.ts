'use strict';

import {
    ECSClient,
    DescribeClustersCommand,
    DescribeServicesCommand,
    DescribeTaskDefinitionCommand,
    paginateListClusters,
    paginateListServices,
    paginateListTaskDefinitions,
    paginateListTasks, Service, Cluster,
} from "@aws-sdk/client-ecs";
import {AwsCredentialIdentity} from "@aws-sdk/types";

let serviceCallManifest;

interface _catcher {
    handle: Function,
}

export function getPerms() {
    return [
        {
            "service": "ecs",
            "call": "DescribeServices",
            "permission": "DescribeServices",
            "initiator": false
        },
        {
            "service": "ecs",
            "call": "ListServices",
            "permission": "ListServices",
            "initiator": false
        },
        {
            "service": "ecs",
            "call": "DescribeClusters",
            "permission": "DescribeClusters",
            "initiator": false
        },
        {
            "service": "ecs",
            "call": "ListClusters",
            "permission": "ListClusters",
            "initiator": true
        },
        {
            "service": "ecs",
            "call": "DescribeTaskDefinition",
            "permission": "DescribeTaskDefinition",
            "initiator": false
        },
        {
            "service": "ecs",
            "call": "ListTaskDefinitions",
            "permission": "ListTaskDefinitions",
            "initiator": true
        }
    ];
}


let ecs_DescribeServices = (cluster: string, services: string[], client: ECSClient, region: string, objAttribs: {}, catcher: _catcher) => {
    return new Promise((resolve, reject) => {

        let obj: {
            [region: string]: {
                ECSServices: Service[]
            },
        } = {
            [region]: {
                ECSServices: []
            }
        };
        client.send(new DescribeServicesCommand({
            cluster,
            services
        }))
            .then((data) => {
                if (data.services) {

                    data.services.forEach((service) => {
                        obj[region].ECSServices.push(service);

                    });
                }
                resolve(obj);
            })
            .catch((e) => {
                reject(e);
            });
    });
};


let ecs_ListClusterServices = (cluster: Cluster, client: ECSClient, region: string, objAttribs: {}, catcher: _catcher) => {
    return new Promise(async (resolve, reject) => {

        const pConfig = {
            client,
            pageSize: 100,
        };

        const cmdParams = {
            cluster: cluster.clusterArn
        };

        const paginator = paginateListServices(pConfig, cmdParams);

        const arr: string[] = [];

        try {

            for await (const page of paginator) {
                if (page.serviceArns) arr.push(...page.serviceArns);
            }
        } catch (e) {
            reject(e);
        }


        let arr2 = [];

        if (arr.length > 0) {

            if (cluster.clusterArn) arr2.push(ecs_DescribeServices(cluster.clusterArn, arr, client, region, objAttribs, catcher));

        }


        Promise.all(arr2)
            .then((aP) => {

                let obj = {
                    [region]: {
                        ECSServices: arr
                    }
                };
                resolve(obj);

            });

    });
};


let ecs_DescribeClusters = (clusters: string[], client: ECSClient, region: string, objAttribs: {}, catcher: _catcher) => {
    return new Promise((resolve, reject) => {

        client.send(new DescribeClustersCommand({
            clusters,
            include: [
                'ATTACHMENTS',
            ],
        }))
            .then((data) => {
                if (data.clusters) {

                    data.clusters.forEach((cluster) => {
                        ecs_ListClusterServices(cluster, client, region, objAttribs, catcher);
                    });
                }

                resolve(data);
            })
            .catch((e) => {
                reject(e);
            });
    });
};


export let ecs_ListClusters = (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => {
    return new Promise(async (resolve, reject) => {

        serviceCallManifest = svcCallsAll;
        const client = new ECSClient(
            {
                region,
                credentials
            }
        );

        const pConfig = {
            client,
            pageSize: 100,
        };

        const cmdParams = {};

        const paginator = paginateListClusters(pConfig, cmdParams);

        const arr: string[] = [];
        const _arrC = [];

        try {

            for await (const page of paginator) {
                if (page.clusterArns) arr.push(...page.clusterArns);
                _arrC.push(catcher.handle(page.clusterArns, objAttribs));
            }
        } catch (e) {
            reject(e);
        }


        let arr2 = [];
        arr2.push(ecs_DescribeClusters(arr, client, region, objAttribs, catcher));


        Promise.all(arr2)
            .then((aP) => {

                let obj = {
                    [region]: {
                        ECSClusters: arr
                    }
                };
                resolve(obj);

            })
            .catch((e) => {
                reject(e);
            });

    });
};


let ecs_DescribeTaskDefinition = (taskDefinitionArn: string, client: ECSClient, objAttribs: {}, catcher: _catcher) => {
    return new Promise((resolve, reject) => {

        client.send(new DescribeTaskDefinitionCommand(
            {
                taskDefinition: taskDefinitionArn,
            }
        ))
            .then((data) => {
                resolve(data.taskDefinition);
            })
            .catch((err) => {
                reject(err);
            });
    });
};


export let ecs_ListTaskDefinitions = (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => {
    return new Promise(async (resolve, reject) => {

        serviceCallManifest = svcCallsAll;
        const client = new ECSClient(
            {
                region,
                credentials
            }
        );

        const pConfig = {
            client,
            pageSize: 100,
        };

        const cmdParams = {};

        const paginator = paginateListTaskDefinitions(pConfig, cmdParams);

        const arr = [];
        const _arrC = [];

        try {

            for await (const page of paginator) {
                if (page.taskDefinitionArns) arr.push(...page.taskDefinitionArns);
                _arrC.push(catcher.handle(page.taskDefinitionArns, objAttribs));
            }
        } catch (e) {
            reject(e);
        }

        const arrTaskDefinitions = []
        for (let i = 0; i < arr.length; i++) {
            let taskDefArn = arr[i];
            let taskDefinition = await ecs_DescribeTaskDefinition(taskDefArn, client, objAttribs, catcher);
            arrTaskDefinitions.push(taskDefinition);
        }

        let obj = {
            [region]: {
                TaskDefinitions: arrTaskDefinitions
            }
        };
        resolve(obj);
    });
};
