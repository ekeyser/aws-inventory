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


let ecs_DescribeServices = (cluster, services, client, region, oRC) => {
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
                // oRC.incr();
                data.services.forEach((service) => {
                    // if (this.objGlobal[region].ECSServices === undefined) {
                    //     this.objGlobal[region].ECSServices = [];
                    // }
                    //
                    // this.objGlobal[region].ECSServices.push(service);
                    obj[region].ECSServices.push(service);

                });
                // resolve(`${region}/ecs_DescribeServices`);
                resolve(obj);
            })
            .catch((e) => {
                // oRC.incr();
                reject(e);
            });
    });
};


let ecs_ListClusterServices = (cluster, client, region) => {
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
                // oRC.incr();
                arr.push(...page.serviceArns);
            }
        } catch (e) {
            // oRC.incr();
            reject(e);
        }


        let arr2 = [];

        if (arr.length > 0) {

            arr2.push(ecs_DescribeServices(serviceArns, client, region));

        }

        // arr.forEach((Service) => {
        //   ecs_DescribeServices()
        // });

        Promise.all(arr2)
            .then((aP) => {

                let obj = {
                    [region]: {
                        ECSServices: arr
                    }
                };
                resolve(obj);

            });

        // for (let i = 0; i < arr.length; i++) {
        //   let serviceArn = arr[i];
        //   await ecs_DescribeServices(cluster.clusterArn, serviceArn);
        // }
        // resolve(`${region}/ecs_ListServices`);
    });
};


let ecs_DescribeClusters = (clusters, client, region, oRC) => {
    return new Promise((resolve, reject) => {

        client.send(new DescribeClustersCommand({
            clusters,
            include: [
                'ATTACHMENTS',
            ],
        }))
            .then((data) => {
                // oRC.incr();
                data.clusters.forEach((cluster) => {
                    ecs_ListClusterServices(cluster, client, region);
                });

                resolve(data);
            })
            .catch((e) => {
                // oRC.incr();
                reject(e);
            });
    });
};


export let ecs_ListClusters = (region, credentials, oRC) => {
    return new Promise(async (resolve, reject) => {

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
                // oRC.incr();
                arr.push(...page.clusterArns);
            }
        } catch (e) {
            // oRC.incr();
            reject(e);
        }


        let arr2 = [];
        arr2.push(ecs_DescribeClusters(arr, client, region));

        // arr.forEach((clusterArn) => {
        //   arr2.push(ecs_DescribeClusters([clusterArn]), client);
        // });


        Promise.all(arr2)
            .then((aP) => {

                let obj = {
                    [region]: {
                        ECSClusters: arr
                    }
                };
                resolve(obj);

            });

        // for (let i = 0; i < arr.length; i++) {
        //   arrP.push(ecs_DescribeClusters(arr[i].clusterArns), client);
        // }

        // Promise.all(arrP)
        //   .then((aP) => {
        //     let arr = [];
        //     for (let i = 0; i < aP.length; i++) {
        //       arr.push()
        //     }
        //     let obj = {
        //       [region]: {
        //         ECSClusters: arr
        //       }
        //     };
        //     resolve(obj);
        //   });
    });
};


let ecs_DescribeTaskDefinition = (taskDefinitionArn, client, oRC) => {
    return new Promise((resolve, reject) => {

        client.send(new DescribeTaskDefinitionCommand(
            {
                taskDefinition: taskDefinitionArn,
            }
        ))
            .then((data) => {
                // oRC.incr();
                resolve(data.taskDefinition);
            })
            .catch((err) => {
                // oRC.incr();
                reject(err);
            });
    });
};


export let ecs_ListTaskDefinitions = (region, credentials, oRC) => {
    return new Promise(async (resolve, reject) => {

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
                // oRC.incr();
                arr.push(...page.taskDefinitionArns);
            }
        } catch (e) {
            // oRC.incr();
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
