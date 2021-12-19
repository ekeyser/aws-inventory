/* eslint-disable */
/**
 * @author ekeyser
 */
'use strict';


import {
    route53_ListHostedZones
} from "./services/route53";

import {
    acm_ListCertificates
} from './services/acm';

import {
    sqs_ListQueues
} from './services/sqs';

import {
    ec2_DescribeVpcs,
    ec2_DescribeAvailabilityZones,
    ec2_DescribeSecurityGroups,
    ec2_DescribeVolumes,
    ec2_DescribeRouteTables,
    ec2_DescribeSubnets,
    ec2_DescribeInstances,
} from './services/ec2';

import {
    iam_ListUsers,
    iam_ListRoles,
    iam_ListPolicies,
} from './services/iam';

import {
    sts_GetCallerIdentity
} from "./services/sts";

const {
    ElasticLoadBalancingV2Client,
    DescribeLoadBalancerAttributesCommand,
    paginateDescribeLoadBalancers,
    paginateDescribeTargetGroups,
    paginateDescribeListeners,
} = require('@aws-sdk/client-elastic-load-balancing-v2');

const {
    LambdaClient,
    paginateListFunctions,
} = require('@aws-sdk/client-lambda');

const {
    CloudFrontClient,
    ListCachePoliciesCommand,
    paginateListDistributions,
} = require('@aws-sdk/client-cloudfront');

const {
    ElastiCacheClient,
    paginateDescribeCacheClusters,
    paginateDescribeReplicationGroups,
    paginateDescribeCacheSubnetGroups,
} = require('@aws-sdk/client-elasticache');

const {
    AutoScalingClient,
    paginateDescribeLaunchConfigurations,
    paginateDescribeAutoScalingGroups,
} = require('@aws-sdk/client-auto-scaling');

const {
    DynamoDBClient,
    DescribeTableCommand,
    paginateListTables,
} = require('@aws-sdk/client-dynamodb');

const {
    CloudWatchClient,
    paginateDescribeAlarms,
} = require('@aws-sdk/client-cloudwatch');

import {
    ECSClient,
    DescribeClustersCommand,
    DescribeServicesCommand,
    DescribeTaskDefinitionCommand,
    paginateListTaskDefinitions,
    paginateListClusters,
    paginateListServices,
} from '@aws-sdk/client-ecs';

const {
    ECRClient,
    paginateDescribeRepositories,
} = require('@aws-sdk/client-ecr');

const {
    RDSClient,
    paginateDescribeDBClusters,
    paginateDescribeOptionGroups,
    paginateDescribeDBParameterGroups,
    paginateDescribeDBSubnetGroups,
    paginateDescribeDBInstances,
} = require('@aws-sdk/client-rds');

const {
    S3Client,
    ListBucketsCommand,
} = require('@aws-sdk/client-s3');

const {
    APIGatewayClient,
    GetMethodCommand,
    paginateGetResources,
    paginateGetUsagePlans,
    paginateGetRestApis,
} = require('@aws-sdk/client-api-gateway');

export class AwsInventory {

    constructor(config) {
        this.credentials = config.credentials;
        this.calls = config.calls;
    }

    obtainAccountNumber(region) {
        return new Promise((resolve, reject) => {

            sts_GetCallerIdentity(region, this.credentials)
                .then((p) => {
                    resolve(p);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }


    run(region, strService, apiCall) {
        return new Promise((resolve, reject) => {

            let credentials = this.credentials;

            if (this.objGlobal[region] === undefined) {
                this.objGlobal[region] = {};
            }

            let cloudfront_ListCachePolicies = (region, credentials) => {
                return new Promise((resolve, reject) => {

                    const client = new CloudFrontClient(
                        {
                            region,
                            credentials
                        }
                    );

                    let obj = {
                        [region]: {
                            CachePolicies: []
                        }
                    };

                    client.send(new ListCachePoliciesCommand({}))
                        .then((data) => {
                            data.CachePolicyList.Items.forEach((cachePolicy) => {
                                // if (this.objGlobal[region].CachePolicies === undefined) {
                                //     this.objGlobal[region].CachePolicies = [];
                                // }
                                obj[region].CachePolicies.push(cachePolicy);

                                // this.objGlobal[region].CachePolicies.push(cachePolicy);
                            });
                            // resolve(`${region}/cloudfront_ListCachePolicies`);

                            resolve(obj);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let cloudfront_ListDistributions = (region, credentials) => {
                return new Promise(async (resolve, reject) => {

                    const client = new CloudFrontClient(
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

                    const paginator = paginateListDistributions(pConfig, cmdParams);

                    const arr = [];

                    try {

                        for await (const page of paginator) {
                            arr.push(...page.DistributionList.Items);
                        }
                    } catch (e) {
                        reject(e);
                    }
                    // this.objGlobal[region].Distributions = arr;
                    // resolve(`${region}/cloudfront_ListDistributions`);

                    let objGlobal = {
                        [region]: {
                            Distributions: arr
                        }
                    };
                    resolve(objGlobal);
                });
            };


            let lambda_ListFunctions = (region, credentials) => {
                return new Promise(async (resolve, reject) => {

                    const client = new LambdaClient(
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

                    const paginator = paginateListFunctions(pConfig, cmdParams);

                    const arr = [];

                    try {

                        for await (const page of paginator) {
                            arr.push(...page.Functions);
                        }

                    } catch (e) {
                        reject(e);
                    }

                    // this.objGlobal[region].Functions = arr;
                    // resolve(`${region}/lambda_ListFunctions`);
                    let obj = {
                        [region]: {
                            Functions: arr
                        }
                    };
                    resolve(obj);
                });
            };


            let elasticache_DescribeCacheClusters = (region, credentials) => {
                return new Promise(async (resolve, reject) => {

                    const client = new ElastiCacheClient(
                        {
                            region,
                            credentials
                        }
                    );

                    const pConfig = {
                        client,
                        pageSize: 100,
                    };

                    const cmdParams = {
                        ShowCacheNodeInfo: true,
                        ShowCacheClustersNotInReplicationGroups: true,
                    };

                    const paginator = paginateDescribeCacheClusters(pConfig, cmdParams);

                    const arr = [];

                    try {

                        for await (const page of paginator) {
                            arr.push(...page.CacheClusters);
                        }
                    } catch (e) {
                        reject(e);
                    }

                    // this.objGlobal[region].CacheClusters = arr;
                    // resolve(`${region}/elasticache_DescribeCacheClusters`);
                    let objGlobal = {
                        [region]: {
                            CacheClusters: arr
                        }
                    };
                    resolve(objGlobal);
                });
            };


            let elasticache_DescribeCacheSubnetGroups = (region, credentials) => {
                return new Promise(async (resolve, reject) => {

                    const client = new ElastiCacheClient(
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

                    const paginator = paginateDescribeCacheSubnetGroups(pConfig, cmdParams);

                    const arr = [];

                    try {

                        for await (const page of paginator) {
                            arr.push(...page.CacheSubnetGroups);
                        }

                    } catch (e) {
                        reject(e);
                    }

                    // this.objGlobal[region].CacheSubnetGroups = arr;
                    // resolve(`${region}/elasticache_DescribeCacheSubnetGroups`);
                    let objGlobal = {
                        [region]: {
                            CacheSubnetGroups: arr
                        }
                    };
                    resolve(objGlobal);
                });
            };


            let elasticache_DescribeReplicationGroups = (region, credentials) => {
                return new Promise(async (resolve, reject) => {

                    const client = new ElastiCacheClient(
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

                    const paginator = paginateDescribeReplicationGroups(pConfig, cmdParams);

                    const arr = [];

                    try {

                        for await (const page of paginator) {
                            arr.push(...page.ReplicationGroups);
                        }

                    } catch (e) {
                        reject(e);
                    }

                    // this.objGlobal[region].ReplicationGroups = arr;
                    // resolve(`${region}/elasticache_DescribeReplicationGroups`);
                    let objGlobal = {
                        [region]: {
                            ReplicationGroups: arr
                        }
                    };
                    resolve(objGlobal);
                });
            };


            let autoscaling_DescribeAutoScalingGroups = (region, credentials) => {
                return new Promise(async (resolve, reject) => {

                    const client = new AutoScalingClient(
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

                    const paginator = paginateDescribeAutoScalingGroups(pConfig, cmdParams);

                    const arr = [];

                    try {

                        for await (const page of paginator) {
                            arr.push(...page.AutoScalingGroups);
                        }
                    } catch (e) {
                        reject(e);
                    }

                    // this.objGlobal[region].AutoScalingGroups = arr;
                    // resolve(`${region}/autoscaling_DescribeAutoScalingGroups`);
                    let obj = {
                        [region]: {
                            AutoScalingGroups: arr
                        }
                    };
                    resolve(obj);
                });
            };


            let autoscaling_DescribeLaunchConfigurations = (region, credentials) => {
                return new Promise(async (resolve, reject) => {

                    const client = new AutoScalingClient(
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

                    const paginator = paginateDescribeLaunchConfigurations(pConfig, cmdParams);

                    const arr = [];

                    try {

                        for await (const page of paginator) {
                            arr.push(...page.LaunchConfigurations);
                        }

                    } catch (e) {
                        reject(e);
                    }

                    // this.objGlobal[region].LaunchConfigurations = arr;
                    // resolve(`${region}/autoscaling_DescribeLaunchConfigurations`);
                    let obj = {
                        [region]: {
                            LaunchConfigurations: arr
                        }
                    };
                    resolve(obj);
                });
            };


            let dynamodb_DescribeTable = (TableName, client) => {
                return new Promise((resolve, reject) => {

                    client.send(new DescribeTableCommand(
                        {
                            TableName
                        }
                    ))
                        .then((data) => {
                            resolve(data.Table);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let dynamodb_ListTables = (region, credentials) => {
                return new Promise(async (resolve, reject) => {

                    const client = new DynamoDBClient(
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

                    const paginator = paginateListTables(pConfig, cmdParams);

                    const arr = [];

                    try {

                        for await (const page of paginator) {
                            arr.push(...page.TableNames);
                        }
                    } catch (e) {
                        reject(e);
                    }

                    const Tables = [];

                    for (let i = 0; i < arr.length; i++) {
                        let TableName = arr[i];
                        let Table = await dynamodb_DescribeTable(TableName, client);
                        Tables.push(Table);
                    }

                    // this.objGlobal[region].Tables = Tables;
                    // resolve(`${region}/dynamodb_ListTables`);
                    let obj = {
                        [region]: {
                            Tables: Tables
                        }
                    };
                    resolve(obj);
                });
            };


            let rds_DescribeDBSubnetGroups = (region, credentials) => {
                return new Promise(async (resolve, reject) => {

                    const client = new RDSClient(
                        {
                            region,
                            credentials,
                        }
                    );

                    const pConfig = {
                        client,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateDescribeDBSubnetGroups(pConfig, cmdParams);

                    const arr = [];

                    try {

                        for await (const page of paginator) {
                            arr.push(...page.DBSubnetGroups);
                        }

                    } catch (e) {
                        reject(e);
                    }

                    // this.objGlobal[region].DBSubnetGroups = arr;
                    // resolve(`${region}/rds_DescribeDBSubnetGroups`);
                    let objGlobal = {
                        [region]: {
                            DBSubnetGroups: arr
                        }
                    };
                    resolve(objGlobal);
                });
            };


            let rds_DescribeDBParameterGroups = (region, credentials) => {
                return new Promise(async (resolve, reject) => {

                    const client = new RDSClient(
                        {
                            region,
                            credentials,
                        }
                    );

                    const pConfig = {
                        client,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateDescribeDBParameterGroups(pConfig, cmdParams);

                    const arr = [];

                    try {

                        for await (const page of paginator) {
                            arr.push(...page.DBParameterGroups);
                        }

                    } catch (e) {
                        reject(e);
                    }

                    // this.objGlobal[region].ParameterGroups = arr;
                    // resolve(`${region}/rds_DescribeDBParameterGroups`);
                    let objGlobal = {
                        [region]: {
                            ParameterGroups: arr
                        }
                    };
                    resolve(objGlobal);
                });
            };


            let rds_DescribeOptionGroups = (region, credentials) => {
                return new Promise(async (resolve, reject) => {

                    const client = new RDSClient(
                        {
                            region,
                            credentials,
                        }
                    );

                    const pConfig = {
                        client,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateDescribeOptionGroups(pConfig, cmdParams);

                    const arr = [];

                    try {

                        for await (const page of paginator) {
                            arr.push(...page.OptionGroupsList);
                        }

                    } catch (e) {
                        reject(e);
                    }

                    // this.objGlobal[region].OptionGroups = arr;
                    // resolve(`${region}/rds_DescribeOptionGroups`);
                    let obj = {
                        [region]: {
                            OptionGroups: arr
                        }
                    };
                    resolve(obj);
                });
            };


            let rds_DescribeDBClusters = (region, credentials) => {
                return new Promise(async (resolve, reject) => {

                    const client = new RDSClient(
                        {
                            region,
                            credentials,
                        }
                    );

                    const pConfig = {
                        client,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateDescribeDBClusters(pConfig, cmdParams);

                    const arr = [];

                    try {

                        for await (const page of paginator) {
                            arr.push(...page.DBClusters);
                        }

                    } catch (e) {
                        reject(e);
                    }

                    // this.objGlobal[region].DBClusters = arr;
                    // resolve(`${region}/rds_DescribeDBClusters`);
                    let obj = {
                        [region]: {
                            DBClusters: arr
                        }
                    };
                    resolve(obj);
                });
            };


            let rds_DescribeDBInstances = (region, credentials) => {
                return new Promise(async (resolve, reject) => {

                    const client = new RDSClient(
                        {
                            region,
                            credentials,
                        }
                    );

                    const pConfig = {
                        client,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateDescribeDBInstances(pConfig, cmdParams);

                    const arr = [];

                    try {

                        for await (const page of paginator) {
                            arr.push(...page.DBInstances);
                        }
                    } catch (e) {
                        reject(e);
                    }

                    // this.objGlobal[region].DBInstances = arr;
                    // resolve(`${region}/rds_DescribeDBInstances`);
                    let obj = {
                        [region]: {
                            DBInstances: arr
                        }
                    };
                    resolve(obj);
                });
            };


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


            let ecs_ListClusters = (region, credentials) => {
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


            let ecs_ListTaskDefinitions = (region, credentials) => {
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


            let ecr_DescribeRepositories = (region, credentials) => {
                return new Promise(async (resolve, reject) => {

                    const client = new ECRClient(
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

                    const paginator = paginateDescribeRepositories(pConfig, cmdParams);

                    const arr = [];

                    try {

                        for await (const page of paginator) {
                            arr.push(...page.repositories);
                        }
                    } catch (e) {
                        reject(e);
                    }
                    // this.objGlobal[region].ECRRepositories = arr;
                    // resolve(`${region}/ecr_DescribeRepositories`);
                    let obj = {
                        [region]: {
                            ECRRepositories: arr
                        }
                    };
                    resolve(obj);
                });
            };


            let cloudwatch_DescribeAlarms = (region, credentials) => {
                return new Promise(async (resolve, reject) => {

                    const client = new CloudWatchClient(
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

                    const paginator = paginateDescribeAlarms(pConfig, cmdParams);

                    const arr = [];

                    try {

                        for await (const page of paginator) {
                            arr.push(...page.MetricAlarms);
                        }

                    } catch (e) {
                        reject(e);
                    }

                    // this.objGlobal[region].MetricAlarms = arr;
                    // resolve(`${region}/cloudwatch_DescribeAlarms`);
                    let obj = {
                        [region]: {
                            MetricAlarms: arr
                        }
                    };
                    resolve(obj);
                });
            };


            // let ec2_DescribeAvailabilityZones = () => {
            //     return new Promise((resolve, reject) => {
            //
            //         ec2client.send(new DescribeAvailabilityZonesCommand({}))
            //             .then((data) => {
            //                 data.AvailabilityZones.forEach((AvailabilityZone) => {
            //                     if (this.objGlobal[region].AvailabilityZones === undefined) {
            //                         this.objGlobal[region].AvailabilityZones = [];
            //                     }
            //
            //                     this.objGlobal[region].AvailabilityZones.push(AvailabilityZone);
            //                 });
            //                 resolve(`${region}/ec2_DescribeAvailabilityZones`);
            //             })
            //             .catch((e) => {
            //                 reject(e);
            //             });
            //     });
            // };
            //
            //
            // let ec2_DescribeRouteTables = () => {
            //     return new Promise(async (resolve, reject) => {
            //
            //         const pConfig = {
            //             client: ec2client,
            //             pageSize: 100,
            //         };
            //
            //         const cmdParams = {};
            //
            //         const paginator = paginateDescribeRouteTables(pConfig, cmdParams);
            //
            //         const arr = [];
            //
            //         try {
            //
            //             for await (const page of paginator) {
            //                 arr.push(...page.RouteTables);
            //             }
            //
            //         } catch (e) {
            //             reject(e);
            //         }
            //
            //
            //         this.objGlobal[region].RouteTables = arr;
            //         resolve(`${region}/ec2_DescribeRouteTables`);
            //     });
            // };
            //
            //
            // let ec2_DescribeVolumes = () => {
            //     return new Promise(async (resolve, reject) => {
            //
            //         const pConfig = {
            //             client: ec2client,
            //             pageSize: 100,
            //         };
            //
            //         const cmdParams = {};
            //
            //         const paginator = paginateDescribeVolumes(pConfig, cmdParams);
            //
            //         const arr = [];
            //
            //         try {
            //
            //             for await (const page of paginator) {
            //                 arr.push(...page.Volumes);
            //             }
            //         } catch (e) {
            //             reject(e);
            //         }
            //         this.objGlobal[region].Volumes = arr;
            //         resolve(`${region}/ec2_DescribeVolumes`);
            //     });
            // };
            //
            //
            // let ec2_DescribeVpcs = () => {
            //     return new Promise(async (resolve, reject) => {
            //         const pConfig = {
            //             client: ec2client,
            //             pageSize: 100,
            //         };
            //
            //         const cmdParams = {};
            //
            //         const paginator = paginateDescribeVpcs(pConfig, cmdParams);
            //
            //         const arr = [];
            //
            //         try {
            //
            //             for await (const page of paginator) {
            //                 arr.push(...page.Vpcs);
            //             }
            //         } catch (e) {
            //             reject(e);
            //         }
            //         this.objGlobal[region].Vpcs = arr;
            //         resolve(`${region}/ec2_DescribeVpcs`);
            //     });
            // };
            //
            //
            // let ec2_DescribeSubnets = () => {
            //     return new Promise(async (resolve, reject) => {
            //
            //         const pConfig = {
            //             client: ec2client,
            //             pageSize: 100,
            //         };
            //
            //         const cmdParams = {};
            //
            //         const paginator = paginateDescribeSubnets(pConfig, cmdParams);
            //
            //         const arr = [];
            //
            //         try {
            //
            //             for await (const page of paginator) {
            //                 arr.push(...page.Subnets);
            //             }
            //
            //         } catch (e) {
            //             reject(e);
            //         }
            //
            //
            //         this.objGlobal[region].Subnets = arr;
            //         resolve(`${region}/ec2_DescribeSubnets`);
            //     });
            // };
            //
            //
            // let ec2_DescribeInstances = () => {
            //     return new Promise(async (resolve, reject) => {
            //
            //         const pConfig = {
            //             client: ec2client,
            //             pageSize: 100,
            //         };
            //
            //         const cmdParams = {};
            //
            //         const paginator = paginateDescribeInstances(pConfig, cmdParams);
            //
            //         const arr = [];
            //
            //         try {
            //
            //             for await (const page of paginator) {
            //                 page.Reservations.forEach((reservation) => {
            //                     arr.push(...reservation.Instances)
            //                 });
            //             }
            //
            //         } catch (e) {
            //             reject(e);
            //         }
            //
            //
            //         this.objGlobal[region].Instances = arr;
            //         resolve(`${region}/ec2_DescribeInstances`);
            //     });
            // };
            //
            //
            // let ec2_DescribeSecurityGroups = () => {
            //     return new Promise(async (resolve, reject) => {
            //
            //         const pConfig = {
            //             client: ec2client,
            //             pageSize: 100,
            //         };
            //
            //         const cmdParams = {};
            //
            //         const paginator = paginateDescribeSecurityGroups(pConfig, cmdParams);
            //
            //         const arr = [];
            //
            //         try {
            //
            //             for await (const page of paginator) {
            //                 arr.push(...page.SecurityGroups)
            //             }
            //         } catch (e) {
            //             reject(e);
            //         }
            //         this.objGlobal[region].SecurityGroups = arr;
            //         resolve(`${region}/ec2_DescribeSecurityGroups`);
            //     });
            // };


            let apigateway_GetMethod = (httpMethod, resourceId, restApiId, client) => {
                return new Promise((resolve, reject) => {

                    client.send(new GetMethodCommand(
                        {
                            httpMethod,
                            resourceId,
                            restApiId,
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


            let apigateway_GetResources = (restApiId, client) => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client,
                        pageSize: 100,
                    };

                    const cmdParams = {
                        restApiId,
                    };

                    const paginator = paginateGetResources(pConfig, cmdParams);

                    const arr = [];

                    try {

                        for await (const page of paginator) {
                            arr.push(page.items);
                        }
                    } catch (e) {
                        reject(e);
                    }

                    const arrResources = [];
                    for (let i = 0; i < arr.length; i++) {
                        let Resource = arr[i];
                        if (Resource.Methods === undefined) {
                            Resource.Methods = [];
                        }
                        let arrResourceMethods = [];
                        if (Resource.resourceMethods !== undefined) {
                            arrResourceMethods = Object.keys(Resource.resourceMethods);
                        }
                        for (let j = 0; j < arrResourceMethods.length; j++) {
                            let METHOD = arrResourceMethods[j];
                            let oMethod = await apigateway_GetMethod(METHOD, Resource.id, restApiId, client);
                            Resource.Methods.push(oMethod);
                        }
                        arrResources.push(Resource);
                    }

                    resolve(arrResources);
                });
            };


            let apigateway_GetRestApis = (region, credentials) => {
                return new Promise(async (resolve, reject) => {

                    const client = new APIGatewayClient(
                        {
                            region,
                            credentials,
                        }
                    );

                    const pConfig = {
                        client,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateGetRestApis(pConfig, cmdParams);

                    const arr = [];

                    try {

                        for await (const page of paginator) {
                            arr.push(...page.items)
                        }
                    } catch (e) {
                        reject(e);
                    }

                    for (let i = 0; i < arr.length; i++) {
                        let RestApi = arr[i];
                        const arrResources = await apigateway_GetResources(RestApi.id, client);
                        arr[i].Resources = arrResources;
                    }

                    this.objGlobal[region].RestApis = arr;
                    resolve(`${region}-rAgwRGAs`);

                });
            };


            let elasticloadbalancing_DescribeLoadBalancerAttributes = (loadbalancer, client) => {
                return new Promise((resolve, reject) => {

                    client.send(new DescribeLoadBalancerAttributesCommand(
                        {
                            LoadBalancerArn: loadbalancer.LoadBalancerArn,
                        }
                    ))
                        .then((data) => {
                            resolve(data.Attributes);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                });
            };


            let elasticloadbalancing_DescribeLoadBalancers = () => {
                return new Promise(async (resolve, reject) => {

                    const client = new ElasticLoadBalancingV2Client(
                        {
                            region,
                            credentials,
                        }
                    );

                    const pConfig = {
                        client,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateDescribeLoadBalancers(pConfig, cmdParams);

                    const arr = [];

                    try {

                        for await (const page of paginator) {
                            arr.push(...page.LoadBalancers);
                        }
                    } catch (e) {
                        reject(e);
                    }
                    const arrLoadBalancers = [];

                    for (let i = 0; i < arr.length; i++) {
                        let loadBalancer = arr[i];
                        let Attributes = await elasticloadbalancing_DescribeLoadBalancerAttributes(loadBalancer, client);
                        loadBalancer.Attributes = Attributes;
                        arrLoadBalancers.push(loadBalancer);
                    }

                    // this.objGlobal[region].ApplicationLoadBalancers = arrLoadBalancers;
                    // resolve(`${region}/elasticloadbalancing_DescribeLoadBalancers`);
                    let obj = {
                        [region]: {
                            ApplicationLoadBalancers: arrLoadBalancers
                        }
                    };
                    resolve(obj);
                });
            };


            // let acm_DescribeCertificate = (cert) => {
            //     return new Promise((resolve, reject) => {
            //
            //         acmclient.send(new DescribeCertificateCommand(
            //             {
            //                 CertificateArn: cert.CertificateArn,
            //             }
            //         ))
            //             .then((data) => {
            //                 resolve(data.Certificate);
            //             })
            //             .catch((err) => {
            //                 reject(err);
            //             });
            //     });
            // };
            //
            //
            // let acm_ListCertificates = () => {
            //     return new Promise(async (resolve, reject) => {
            //
            //         const pConfig = {
            //             client: acmclient,
            //             pageSize: 100,
            //         };
            //
            //         const cmdParams = {};
            //
            //         const paginator = paginateListCertificates(pConfig, cmdParams);
            //
            //         const arr = [];
            //
            //         try {
            //
            //             for await (const page of paginator) {
            //                 arr.push(...page.CertificateSummaryList);
            //             }
            //         } catch (e) {
            //             reject(e);
            //         }
            //
            //         const arrCertificates = []
            //         for (let i = 0; i < arr.length; i++) {
            //             let cert = arr[i];
            //             let Certificate = await acm_DescribeCertificate(cert);
            //             arrCertificates.push(Certificate);
            //         }
            //
            //
            //         this.objGlobal[region].Certificates = arrCertificates;
            //         resolve(`${region}/acm_ListCertificates`);
            //     });
            // };


            let s3_ListAllMyBuckets = (region, credentials) => {
                return new Promise((resolve, reject) => {

                    const client = new S3Client(
                        {
                            region,
                            credentials
                        }
                    );

                    client.send(new ListBucketsCommand({}))
                        .then((data) => {
                            data.Buckets.forEach((bucket) => {
                                if (this.objGlobal[region].Buckets === undefined) {
                                    this.objGlobal[region].Buckets = [];
                                }

                                this.objGlobal[region].Buckets.push(bucket);
                            });
                            resolve(`${region}/s3_ListAllMyBuckets`);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                });
            };


            // let sqs_GetQueueAttributes = (QueueUrl) => {
            //     return new Promise((resolve, reject) => {
            //         sqsclient.send(new GetQueueAttributesCommand(
            //             {
            //                 AttributeNames: [
            //                     'All'
            //                 ],
            //                 QueueUrl,
            //             }
            //         ))
            //             .then((data) => {
            //                 resolve(data);
            //             })
            //             .catch((err) => {
            //                 reject(err);
            //             });
            //     });
            // };
            //
            //
            // let sqs_ListQueues = () => {
            //     return new Promise(async (resolve, reject) => {
            //
            //         const pConfig = {
            //             client: sqsclient,
            //             pageSize: 100,
            //         };
            //
            //         const cmdParams = {};
            //
            //         const paginator = paginateListQueues(pConfig, cmdParams);
            //
            //         const arr = [];
            //
            //         try {
            //
            //             for await (const page of paginator) {
            //                 if (page.QueueUrls !== undefined) {
            //                     arr.push(...page.QueueUrls);
            //                 }
            //             }
            //
            //         } catch (e) {
            //             reject(e);
            //         }
            //
            //         const arrQueues = [];
            //
            //         for (let i = 0; i < arr.length; i++) {
            //             let QueueUrl = arr[i];
            //             let Queue = await sqs_GetQueueAttributes(QueueUrl);
            //             Queue.Attributes.QueueUrl = QueueUrl;
            //             arrQueues.push(Queue);
            //         }
            //
            //         this.objGlobal[region].Queues = arrQueues;
            //         resolve(`${region}/sqs_ListQueues`);
            //     });
            // };


            const RETRIES = 2;
            let requestSender = (fName, retry) => {
                return new Promise(async (resolve, reject) => {
                    if (retry === undefined) {
                        retry = 0;
                    }


                    let fRand = Math.random();
                    let rWait = Math.round(fRand * this.MAX_WAIT);
                    await new Promise(resolve => setTimeout(resolve, rWait));


                    let fnName;
                    switch (fName) {
                        case 'acm_ListCertificates':
                            fnName = acm_ListCertificates;
                            break;
                        case 'autoscaling_DescribeLaunchConfigurations':
                            fnName = autoscaling_DescribeLaunchConfigurations;
                            break;
                        case 'autoscaling_DescribeAutoScalingGroups':
                            fnName = autoscaling_DescribeAutoScalingGroups;
                            break;
                        case 'cloudfront_ListCachePolicies':
                            fnName = cloudfront_ListCachePolicies;
                            break;
                        case 'cloudfront_ListDistributions':
                            fnName = cloudfront_ListDistributions;
                            break;
                        case 'cloudwatch_DescribeAlarms':
                            fnName = cloudwatch_DescribeAlarms;
                            break;
                        case 'dynamodb_ListTables':
                            fnName = dynamodb_ListTables;
                            break;
                        case 'ec2_DescribeVpcs':
                            fnName = ec2_DescribeVpcs;
                            break;
                        case 'ec2_DescribeAvailabilityZones':
                            fnName = ec2_DescribeAvailabilityZones;
                            break;
                        case 'ec2_DescribeSecurityGroups':
                            fnName = ec2_DescribeSecurityGroups;
                            break;
                        case 'ec2_DescribeVolumes':
                            fnName = ec2_DescribeVolumes;
                            break;
                        case 'ec2_DescribeRouteTables':
                            fnName = ec2_DescribeRouteTables;
                            break;
                        case 'ec2_DescribeSubnets':
                            fnName = ec2_DescribeSubnets;
                            break;
                        case 'ec2_DescribeInstances':
                            fnName = ec2_DescribeInstances;
                            break;
                        case 'ecr_DescribeRepositories':
                            fnName = ecr_DescribeRepositories;
                            break;
                        // case 'ecs_ListClusters':
                        //     fnName = ecs_ListClusters;
                        //     break;
                        // case 'ecs_ListTaskDefinitions':
                        //     fnName = ecs_ListTaskDefinitions;
                        //     break;
                        case 'elasticache_DescribeCacheClusters':
                            fnName = elasticache_DescribeCacheClusters;
                            break;
                        case 'elasticache_DescribeReplicationGroups':
                            fnName = elasticache_DescribeReplicationGroups;
                            break;
                        case 'elasticache_DescribeCacheSubnetGroups':
                            fnName = elasticache_DescribeCacheSubnetGroups;
                            break;
                        case 'elasticloadbalancing_DescribeLoadBalancers':
                            fnName = elasticloadbalancing_DescribeLoadBalancers;
                            break;
                        case 'iam_ListUsers':
                            fnName = iam_ListUsers;
                            break;
                        case 'iam_ListPolicies':
                            fnName = iam_ListPolicies;
                            break;
                        case 'iam_ListRoles':
                            fnName = iam_ListRoles;
                            break;
                        case 'lambda_ListFunctions':
                            fnName = lambda_ListFunctions;
                            break;
                        case 'rds_DescribeDBSubnetGroups':
                            fnName = rds_DescribeDBSubnetGroups;
                            break;
                        case 'rds_DescribeDBParameterGroups':
                            fnName = rds_DescribeDBParameterGroups;
                            break;
                        case 'rds_DescribeOptionGroups':
                            fnName = rds_DescribeOptionGroups;
                            break;
                        case 'rds_DescribeDBClusters':
                            fnName = rds_DescribeDBClusters;
                            break;
                        case 'rds_DescribeDBInstances':
                            fnName = rds_DescribeDBInstances;
                            break;
                        case 'route53_ListHostedZones':
                            fnName = route53_ListHostedZones;
                            break;
                        case 'sqs_ListQueues':
                            fnName = sqs_ListQueues;
                            break;
                        default:
                            const message = `${region}/fName '${fName}' is not an inventory initatior.`;
                            resolve(message);
                    }


                    if (fnName !== undefined) {

                        // try {

                        fnName(region, this.credentials)
                            .then((p) => {
                                console.log(p);
                                let Resources = Object.keys(p[region]);
                                console.log(Resources);
                                Resources.forEach((resource) => {
                                    let something = p[region][resource];
                                    this.objGlobal[region][resource] = something;
                                });
                                // this.objGlobal[region] = p[region];
                                console.log(this.objGlobal);
                                resolve(p);
                            })
                            .catch(async (e) => {

                                switch (e.name) {
                                    case 'AuthFailure':
                                        console.warn(`AuthFailure: will not retry.`);
                                        resolve(e);
                                        break;

                                    case 'AccessDeniedException':
                                        console.warn(`AccessDeniedException: will not retry.`);
                                        resolve(e);
                                        break;

                                    case 'InvalidClientTokenId':
                                        console.warn(`InvalidClientTokenId: will not retry.`);
                                        resolve(e);
                                        break;

                                    case 'UnrecognizedClientException':
                                        console.warn(`UnrecognizedClientException: will not retry.`);
                                        resolve(e);
                                        break;

                                    default:
                                        console.log(`Mk.606`);
                                        console.warn(`Problem w requestSender on Fn '${fName}' for region ${region}.`);
                                        console.log(e.name);
                                        console.log(Object.keys(e));


                                        let p;
                                        if (retry < RETRIES) {
                                            console.log(`Mk.707`);
                                            console.log(`Retrying, prev error was ${e.name}`);
                                            p = await requestSender(fName, retry + 1);
                                        } else {
                                            console.log(`Mk.708`);
                                            console.warn(`Too many retries; failing.`);
                                            resolve(e);
                                        }
                                }
                            });

                        // } catch (e) {

                        // console.warn(fName);
                        // console.warn(fnName);
                        // console.error(e);

                        // }

                    }
                });
            };


            let strApiCallFn = `${strService}_${apiCall}`;
            switch (strService) {
                case 'cloudfront':
                    if (region === 'us-east-1') {
                        requestSender(strApiCallFn)
                            .then((p) => {
                                resolve(p);
                            })
                            .catch((e) => {
                                reject(e);
                            });
                    } else {
                        resolve(`We don't make calls to ${strService} outside of us-east-1.`);
                    }
                    break;
                case 'iam':
                    if (region === 'us-east-1') {
                        requestSender(strApiCallFn)
                            .then((p) => {
                                resolve(p);
                            })
                            .catch((e) => {
                                reject(e);
                            });
                    } else {
                        resolve(`We don't make calls to ${strService} outside of us-east-1.`);
                    }
                    break;
                case 'route53':
                    if (region === 'us-east-1') {
                        requestSender(strApiCallFn)
                            .then((p) => {
                                resolve(p);
                            })
                            .catch((e) => {
                                reject(e);
                            });
                    } else {
                        resolve(`We don't make calls to ${strService} outside of us-east-1.`);
                    }
                    break;
                default:
                    requestSender(strApiCallFn)
                        .then((p) => {
                            resolve(p);
                        })
                        .catch((e) => {
                            reject(e);
                        });
            }

        });
    };


    inventory() {
        return new Promise(async (resolve) => {

            this.objGlobal = {};
            let Account;


            /*
            Calculate temporal spread
             */
            let numCalls = 0;
            Object.keys(this.calls).forEach((region) => {
                Object.keys(this.calls[region]).forEach((service) => {
                    this.calls[region][service].forEach((oS) => {
                        numCalls++;
                    });
                });
            });


            this.MAX_WAIT = Math.floor((numCalls) / 10) * 1000;


            let arrRequests = [];
            arrRequests.push(this.obtainAccountNumber('us-east-1')
                .then((data) => {
                    Account = data.Account;
                }));


            Object.keys(this.calls).forEach((strRegion) => {
                let arrServices = Object.keys(this.calls[strRegion])
                arrServices.forEach((strService) => {
                    this.calls[strRegion][strService].forEach((apiCall) => {
                        arrRequests.push(this.run(strRegion, strService, apiCall));
                    });
                });
            });


            Promise.all(arrRequests)
                .then(() => {
                    const regions = [];
                    Object.keys(this.objGlobal).forEach((RegionName) => {
                        let objRegion = this.objGlobal[RegionName];
                        objRegion.RegionName = RegionName;
                        regions.push(objRegion)
                    });
                    let obj = {
                        Account,
                        cloudProviderName: 'aws',
                        regions,
                    };
                    resolve(obj);
                    // resolve(this.objGlobal);
                })
                .catch((e) => {
                    console.log(`Mk.808`);
                    console.error(e);
                    console.log(`Mk.809`);
                    let obj = {
                        Account,
                        cloudProviderName: 'aws',
                        regions,
                    };
                    resolve(obj);
                });
        });
    }
}

// module.exports = exports = AwsInventory.AwsInventory = AwsInventory;
