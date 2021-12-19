'use strict';

import {
    DescribeClustersCommand,
    DescribeServicesCommand, DescribeTaskDefinitionCommand,
    ECSClient,
    paginateListClusters,
    paginateListServices, paginateListTaskDefinitions
} from "@aws-sdk/client-ecs";

let ecs_DescribeServices = (cluster, services, client) => {
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
                reject(e);
            });
    });
};


let ecs_ListServices = (cluster, client) => {
    return new Promise(async (resolve, reject) => {

        const pConfig = {
            client: client,
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

        for (let i = 0; i < arr.length; i++) {
            let serviceArn = arr[i];
            await ecs_DescribeServices(cluster.clusterArn, serviceArn);
        }
        resolve(`${region}/ecs_ListServices`);
    });
};


let ecs_DescribeClusters = (clusters, client) => {
    return new Promise((resolve, reject) => {

        client.send(new DescribeClustersCommand({
            clusters
        }))
            .then((data) => {
                data.clusters.forEach((cluster) => {
                    ecs_ListServices(cluster);
                    if (this.objGlobal[region].ECSClusters === undefined) {
                        this.objGlobal[region].ECSClusters = [];
                    }

                    this.objGlobal[region].ECSClusters.push(cluster);
                });
                // resolve(`${region}/ecs_DescribeClusters`);
                resolve(`${region}/ecs_DescribeClusters`);
                resolve(obj);
            })
            .catch((e) => {
                reject(e);
            });
    });
};


export let ecs_ListClusters = (region, credentials) => {
    return new Promise(async (resolve, reject) => {

        const client = new ECSClient(
            {
                region,
                credentials
            }
        );

        let arrP = [];
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

        for (let i = 0; i < arr.length; i++) {
            arrP.push(ecs_DescribeClusters(arr[i].clusterArns), client);
        }

        Promise.all(arrP)
            .then((aP) => {
                let arr = [];
                for (let i = 0; i < aP.length; i++) {
                    arr.push()
                }
                // resolve(`${region}/ecs_ListClusters`);
                let obj = {
                    [region]: {
                        ECSClusters: arr
                    }
                };
                resolve(obj);
            });
    });
};


let ecs_DescribeTaskDefinition = (taskDefinitionArn, client) => {
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


export let ecs_ListTaskDefinitions = (region, credentials) => {
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

        this.objGlobal[region].TaskDefinitions = arrTaskDefinitions;
        resolve(`${region}/ecs_ListTaskDefinitions`);
    });
};
