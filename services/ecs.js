'use strict';

import {
    ECSClient,
    DescribeClustersCommand,
    DescribeServicesCommand,
    DescribeTaskDefinitionCommand,
    paginateListClusters,
    paginateListServices,
    paginateListTaskDefinitions,
    paginateListTasks,
} from "@aws-sdk/client-ecs";

let serviceCallManifest;

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
};


let ecs_DescribeServices = (cluster, services, client, region, objAttribs, catcher) => {
    return new Promise((resolve, reject) => {

        let obj = {
            [region]: {
                ECSServices: []
            }
        };
        client.send(new DescribeServicesCommand({
            cluster,
            services
        }))
            .then((data) => {
                data.services.forEach((service) => {
                    obj[region].ECSServices.push(service);

                });
                resolve(obj);
            })
            .catch((e) => {
                reject(e);
            });
    });
};


let ecs_ListClusterServices = (cluster, client, region, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {

        const pConfig = {
            client,
            pageSize: 100,
        };

        const cmdParams = {
            cluster: cluster.clusterArn
        };

        const paginator = paginateListServices(pConfig, cmdParams);

        const arr = [];

        try {

            for await (const page of paginator) {
                arr.push(...page.serviceArns);
            }
        } catch (e) {
            reject(e);
        }


        let arr2 = [];

        if (arr.length > 0) {

            arr2.push(ecs_DescribeServices(serviceArns, client, region));

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


let ecs_DescribeClusters = (clusters, client, region, objAttribs, catcher) => {
    return new Promise((resolve, reject) => {

        client.send(new DescribeClustersCommand({
            clusters,
            include: [
                'ATTACHMENTS',
            ],
        }))
            .then((data) => {
                data.clusters.forEach((cluster) => {
                    ecs_ListClusterServices(cluster, client, region);
                });

                resolve(data);
            })
            .catch((e) => {
                reject(e);
            });
    });
};


export let ecs_ListClusters = (region, credentials, svcCallsAll, objAttribs, catcher) => {
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

        const arr = [];

        try {

            for await (const page of paginator) {
                arr.push(...page.clusterArns);
            }
        } catch (e) {
            reject(e);
        }


        let arr2 = [];
        arr2.push(ecs_DescribeClusters(arr, client, region));


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


let ecs_DescribeTaskDefinition = (taskDefinitionArn, client, objAttribs, catcher) => {
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


export let ecs_ListTaskDefinitions = (region, credentials, svcCallsAll, objAttribs, catcher) => {
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

        try {

            for await (const page of paginator) {
                arr.push(...page.taskDefinitionArns);
            }
        } catch (e) {
            reject(e);
        }

        const arrTaskDefinitions = []
        for (let i = 0; i < arr.length; i++) {
            let taskDefArn = arr[i];
            let taskDefinition = await ecs_DescribeTaskDefinition(taskDefArn);
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
