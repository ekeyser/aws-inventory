/* eslint-disable */
/**
 * @author ekeyser
 */
'use strict';


const {
    STSClient,
    GetCallerIdentityCommand,
} = require('@aws-sdk/client-sts');

const {
    SQSClient,
    GetQueueAttributesCommand,
    paginateListQueues,
} = require('@aws-sdk/client-sqs');

const {
    ACMClient,
    DescribeCertificateCommand,
    paginateListCertificates,
} = require('@aws-sdk/client-acm');

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
    IAMClient,
    paginateListPolicies,
    paginateListUsers,
    paginateListRoles,
} = require('@aws-sdk/client-iam');

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
    Route53Client,
    paginateListHostedZones,
} = require('@aws-sdk/client-route-53');

const {
    DynamoDBClient,
    DescribeTableCommand,
    paginateListTables,
} = require('@aws-sdk/client-dynamodb');

const {
    CloudWatchClient,
    paginateDescribeAlarms,
} = require('@aws-sdk/client-cloudwatch');

const {
    ECSClient,
    DescribeClustersCommand,
    DescribeServicesCommand,
    DescribeTaskDefinitionCommand,
    paginateListTaskDefinitions,
    paginateListClusters,
    paginateListServices,
} = require('@aws-sdk/client-ecs');

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

const {
    EC2Client,
    DescribeVpcsCommand,
    DescribeAvailabilityZonesCommand,
    paginateDescribeSecurityGroups,
    paginateDescribeVolumes,
    paginateDescribeRouteTables,
    paginateDescribeSubnets,
    paginateDescribeVpcs,
    paginateDescribeInstances,
} = require('@aws-sdk/client-ec2');

class AwsInventory {

    // MAX_WAIT = 5000;
    // objGlobal = {};
    // credentials;
    // regions;
    // services;


    constructor(config) {
        this.credentials = config.credentials;
        this.regions = config.regions;
        this.services = config.services;
    }


    obtainAccountNumber() {
        return new Promise((resolve, reject) => {

            let credentials = this.credentials;
            let region = 'us-east-1';
            const stsclient = new STSClient(
                {
                    region,
                    credentials,
                }
            );


            let rStsGCI = () => {
                return new Promise((resolve, reject) => {

                    stsclient.send(new GetCallerIdentityCommand({}))
                        .then((data) => {
                            this.objGlobal[region][`Account`] = data.Account;
                            resolve(`rStsGCI`);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };

            rStsGCI()
                .then((p) => {
                    resolve(p);
                });
        });
    }


    run(region, services, credentials) {
        return new Promise((resolve) => {
            if (this.objGlobal[region] === undefined) {
                this.objGlobal[region] = {};
            }

            const agwclient = new APIGatewayClient(
                {
                    region,
                    credentials,
                }
            );

            const acmclient = new ACMClient(
                {
                    region,
                    credentials,
                }
            );

            const elbv2client = new ElasticLoadBalancingV2Client(
                {
                    region,
                    credentials,
                }
            );

            const s3client = new S3Client(
                {
                    region,
                    credentials
                }
            );

            const lambdaclient = new LambdaClient(
                {
                    region,
                    credentials
                }
            );

            const cfclient = new CloudFrontClient(
                {
                    region,
                    credentials
                }
            );

            const iamclient = new IAMClient(
                {
                    region,
                    credentials
                }
            );

            const asgclient = new AutoScalingClient(
                {
                    region,
                    credentials
                }
            );

            const elcclient = new ElastiCacheClient(
                {
                    region,
                    credentials
                }
            );

            const r53client = new Route53Client(
                {
                    region,
                    credentials
                }
            );

            const ec2client = new EC2Client(
                {
                    region,
                    credentials
                }
            );

            const rdsclient = new RDSClient(
                {
                    region,
                    credentials,
                }
            );

            const ddbclient = new DynamoDBClient(
                {
                    region,
                    credentials
                }
            );

            const cwclient = new CloudWatchClient(
                {
                    region,
                    credentials
                }
            );

            const ecrclient = new ECRClient(
                {
                    region,
                    credentials
                }
            );

            const ecsclient = new ECSClient(
                {
                    region,
                    credentials
                }
            );

            const sqsclient = new SQSClient(
                {
                    region,
                    credentials
                }
            );


            /*
            ONLY US-EAST-1
             */
            let rCfLCP = () => {
                return new Promise((resolve, reject) => {

                    cfclient.send(new ListCachePoliciesCommand({}))
                        .then((data) => {
                            data.CachePolicyList.Items.forEach((cachePolicy) => {
                                if (this.objGlobal[region].CachePolicies === undefined) {
                                    this.objGlobal[region].CachePolicies = [];
                                }

                                this.objGlobal[region].CachePolicies.push(cachePolicy);
                            });
                            resolve(`rCfLCP`);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rCfLD = () => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client: cfclient,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateListDistributions(pConfig, cmdParams);

                    const arr = [];

                    for await (const page of paginator) {
                        arr.push(...page.DistributionList.Items);
                    }
                    this.objGlobal[region].Distributions = arr;
                    resolve(`${region}-rCfLD`);
                });
            };


            let rIamLU = () => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client: iamclient,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateListUsers(pConfig, cmdParams);

                    const arr = [];

                    for await (const page of paginator) {
                        arr.push(...page.Users);
                    }
                    this.objGlobal[region].Users = arr;
                    resolve(`${region}-rIamLU`);
                });
            };


            let rIamLP = () => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client: iamclient,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateListPolicies(pConfig, cmdParams);

                    const arr = [];

                    for await (const page of paginator) {
                        arr.push(...page.Policies);
                    }
                    this.objGlobal[region].Policies = arr;
                    resolve(`${region}-rIamLP`);
                });
            };


            let rIamLR = () => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client: iamclient,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateListRoles(pConfig, cmdParams);

                    const arr = [];

                    for await (const page of paginator) {
                        arr.push(...page.Roles);
                    }
                    this.objGlobal[region].Roles = arr;
                    resolve(`${region}-rIamLR`);
                });
            };


            let rR53LHZ = () => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client: r53client,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateListHostedZones(pConfig, cmdParams);

                    const arr = [];

                    for await (const page of paginator) {
                        arr.push(...page.HostedZones);
                    }
                    this.objGlobal[region].HostedZones = arr;
                    resolve(`${region}-rR53LHZ`);
                });
            };


            /*
            ALL REGIONS
             */
            let rLamLF = () => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client: lambdaclient,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateListFunctions(pConfig, cmdParams);

                    const arr = [];

                    for await (const page of paginator) {
                        arr.push(...page.Functions);
                    }
                    this.objGlobal[region].Functions = arr;
                    resolve(`${region}-rLamLF`);
                });
            };


            let rElcDCC = () => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client: elcclient,
                        pageSize: 100,
                    };

                    const cmdParams = {
                        ShowCacheNodeInfo: true,
                        ShowCacheClustersNotInReplicationGroups: true,
                    };

                    const paginator = paginateDescribeCacheClusters(pConfig, cmdParams);

                    const arr = [];

                    for await (const page of paginator) {
                        arr.push(...page.CacheClusters);
                    }
                    this.objGlobal[region].CacheClusters = arr;
                    resolve(`${region}-rElcDCC`);
                });
            };


            let rElcDCSG = () => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client: elcclient,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateDescribeCacheSubnetGroups(pConfig, cmdParams);

                    const arr = [];

                    for await (const page of paginator) {
                        arr.push(...page.CacheSubnetGroups);
                    }
                    this.objGlobal[region].CacheSubnetGroups = arr;
                    resolve(`${region}-rElcDCSG`);
                });
            };


            let rElcDRG = () => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client: elcclient,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateDescribeReplicationGroups(pConfig, cmdParams);

                    const arr = [];

                    for await (const page of paginator) {
                        arr.push(...page.ReplicationGroups);
                    }
                    this.objGlobal[region].ReplicationGroups = arr;
                    resolve(`${region}-rElcDRG`);
                });
            };


            let rAsgDASG = () => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client: asgclient,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateDescribeAutoScalingGroups(pConfig, cmdParams);

                    const arr = [];

                    for await (const page of paginator) {
                        arr.push(...page.AutoScalingGroups);
                    }
                    this.objGlobal[region].AutoScalingGroups = arr;
                    resolve(`${region}-rAsgDASG`);
                });
            };


            let rAsgDLC = () => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client: asgclient,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateDescribeLaunchConfigurations(pConfig, cmdParams);

                    const arr = [];

                    for await (const page of paginator) {
                        arr.push(...page.LaunchConfigurations);
                    }
                    this.objGlobal[region].LaunchConfigurations = arr;
                    resolve(`${region}-rAsgDLC`);
                });
            };


            let rDdbDT = (TableName) => {
                return new Promise((resolve, reject) => {

                    ddbclient.send(new DescribeTableCommand(
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


            let rDdbLT = () => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client: ddbclient,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateListTables(pConfig, cmdParams);

                    const arr = [];

                    for await (const page of paginator) {
                        arr.push(...page.TableNames);
                    }

                    const Tables = [];

                    for (let i = 0; i < arr.length; i++) {
                        let TableName = arr[i];
                        let Table = await rDdbDT(TableName);
                        Tables.push(Table);
                    }

                    this.objGlobal[region].Tables = Tables;
                    resolve(`${region}-rDdbLT`);
                });
            };


            let rRdsDSG = () => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client: rdsclient,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateDescribeDBSubnetGroups(pConfig, cmdParams);

                    const arr = [];

                    for await (const page of paginator) {
                        arr.push(...page.DBSubnetGroups);
                    }
                    this.objGlobal[region].DBSubnetGroups = arr;
                    resolve(`${region}-rRdsDSG`);
                });
            };


            let rRdsDPG = () => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client: rdsclient,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateDescribeDBParameterGroups(pConfig, cmdParams);

                    const arr = [];

                    for await (const page of paginator) {
                        arr.push(...page.DBParameterGroups);
                    }
                    this.objGlobal[region].ParameterGroups = arr;
                    resolve(`${region}-rRdsDPG`);
                });
            };


            let rRdsDOG = () => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client: rdsclient,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateDescribeOptionGroups(pConfig, cmdParams);

                    const arr = [];

                    for await (const page of paginator) {
                        arr.push(...page.OptionGroupsList);
                    }
                    this.objGlobal[region].OptionGroups = arr;
                    resolve(`${region}-rRdsDOG`);
                });
            };


            let rRdsDC = () => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client: rdsclient,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateDescribeDBClusters(pConfig, cmdParams);

                    const arr = [];

                    for await (const page of paginator) {
                        arr.push(...page.DBClusters);
                    }
                    this.objGlobal[region].DBClusters = arr;
                    resolve(`${region}-rRdsDC`);
                });
            };


            let rRdsDI = () => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client: rdsclient,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateDescribeDBInstances(pConfig, cmdParams);

                    const arr = [];

                    for await (const page of paginator) {
                        arr.push(...page.DBInstances);
                    }
                    this.objGlobal[region].DBInstances = arr;
                    resolve(`${region}-rRdsDI`);
                });
            };


            let rEcsDS = (cluster, services) => {
                return new Promise((resolve, reject) => {

                    ecsclient.send(new DescribeServicesCommand({
                        cluster,
                        services
                    }))
                        .then((data) => {
                            data.services.forEach((service) => {
                                if (this.objGlobal[region].ECSServices === undefined) {
                                    this.objGlobal[region].ECSServices = [];
                                }

                                this.objGlobal[region].ECSServices.push(service);
                            });
                            resolve(`rEcsDS`);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rEcsLS = (cluster) => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client: ecsclient,
                        pageSize: 100,
                    };

                    const cmdParams = {
                        cluster: cluster.clusterArn
                    };

                    const paginator = paginateListServices(pConfig, cmdParams);

                    const arr = [];

                    for await (const page of paginator) {
                        arr.push(...page.serviceArns);
                    }

                    for (let i = 0; i < arr.length; i++) {
                        let serviceArn = arr[i];
                        await rEcsDS(cluster.clusterArn, serviceArn);
                    }
                    resolve(`${region}-rEcsLS`);
                });
            };


            let rEcsDC = (clusters) => {
                return new Promise((resolve, reject) => {

                    ecsclient.send(new DescribeClustersCommand({
                        clusters
                    }))
                        .then((data) => {
                            data.clusters.forEach((cluster) => {
                                rEcsLS(cluster);
                                if (this.objGlobal[region].ECSClusters === undefined) {
                                    this.objGlobal[region].ECSClusters = [];
                                }

                                this.objGlobal[region].ECSClusters.push(cluster);
                            });
                            resolve(`rEcsDC`);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rEcsLC = () => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client: ecsclient,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateListClusters(pConfig, cmdParams);

                    const arr = [];

                    for await (const page of paginator) {
                        arr.push(...page.clusterArns);
                    }

                    for (let i = 0; i < arr.length; i++) {
                        rEcsDC(arr[i].clusterArns)
                    }
                    resolve(`${region}-rEcsLC`);
                });
            };


            let rEcrDR = () => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client: ecrclient,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateDescribeRepositories(pConfig, cmdParams);

                    const arr = [];

                    for await (const page of paginator) {
                        arr.push(...page.repositories);
                    }
                    this.objGlobal[region].ECRRepositories = arr;
                    resolve(`${region}-rEcrDR`);
                });
            };


            let rCwDA = () => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client: cwclient,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateDescribeAlarms(pConfig, cmdParams);

                    const arr = [];

                    for await (const page of paginator) {
                        arr.push(...page.MetricAlarms);
                    }
                    this.objGlobal[region].MetricAlarms = arr;
                    resolve(`${region}-rCwDA`);
                });
            };


            let rEc2DAZ = () => {
                return new Promise((resolve, reject) => {

                    ec2client.send(new DescribeAvailabilityZonesCommand({}))
                        .then((data) => {
                            data.AvailabilityZones.forEach((AvailabilityZone) => {
                                if (this.objGlobal[region].AvailabilityZones === undefined) {
                                    this.objGlobal[region].AvailabilityZones = [];
                                }

                                this.objGlobal[region].AvailabilityZones.push(AvailabilityZone);
                            });
                            resolve(`rEc2DAZ`);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rEc2DRT = () => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client: ec2client,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateDescribeRouteTables(pConfig, cmdParams);

                    const arr = [];

                    for await (const page of paginator) {
                        arr.push(...page.RouteTables);
                    }
                    this.objGlobal[region].RouteTables = arr;
                    resolve(`${region}-rEc2DRT`);
                });
            };


            let rEc2DVo = () => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client: ec2client,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateDescribeVolumes(pConfig, cmdParams);

                    const arr = [];

                    for await (const page of paginator) {
                        arr.push(...page.Volumes);
                    }
                    this.objGlobal[region].Volumes = arr;
                    resolve(`${region}-rEc2DVo`);
                });
            };


            let rEc2DV = () => {
                return new Promise((resolve, reject) => {

                    ec2client.send(new DescribeVpcsCommand({}))
                        .then((data) => {
                            data.Vpcs.forEach((vpc) => {
                                if (this.objGlobal[region].Vpcs === undefined) {
                                    this.objGlobal[region].Vpcs = [];
                                }

                                this.objGlobal[region].Vpcs.push(vpc);
                            });
                            resolve(`rEc2DV`);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rEc2DS = () => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client: ec2client,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateDescribeSubnets(pConfig, cmdParams);

                    const arr = [];

                    for await (const page of paginator) {
                        arr.push(...page.Subnets);
                    }
                    this.objGlobal[region].Subnets = arr;
                    resolve(`${region}-rEc2DS`);
                });
            };


            let rEc2DI = () => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client: ec2client,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateDescribeInstances(pConfig, cmdParams);

                    const arr = [];

                    for await (const page of paginator) {
                        page.Reservations.forEach((reservation) => {
                            arr.push(...reservation.Instances)
                        });
                    }
                    this.objGlobal[region].Ec2Instances = arr;
                    resolve(`${region}-rEc2DI`);
                });
            };


            let rEcsDTD = (taskDefinitionArn) => {
                return new Promise((resolve, reject) => {

                    ecsclient.send(new DescribeTaskDefinitionCommand(
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


            let rEcsLTD = () => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client: ecsclient,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateListTaskDefinitions(pConfig, cmdParams);

                    const arr = [];

                    for await (const page of paginator) {
                        arr.push(...page.taskDefinitionArns);
                    }

                    const arrTaskDefinitions = []
                    for (let i = 0; i < arr.length; i++) {
                        let taskDefArn = arr[i];
                        let taskDefinition = await rEcsDTD(taskDefArn);
                        arrTaskDefinitions.push(taskDefinition);
                    }

                    this.objGlobal[region].TaskDefinitions = arrTaskDefinitions;
                    resolve(`${region}-rEcsLTD`);
                });
            };


            let rEc2DSG = () => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client: ec2client,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateDescribeSecurityGroups(pConfig, cmdParams);

                    const arr = [];

                    for await (const page of paginator) {
                        arr.push(...page.SecurityGroups)
                    }
                    this.objGlobal[region].SecurityGroups = arr;
                    resolve(`${region}-rEc2DSG`);
                });
            };


            let rAgwGM = (httpMethod, resourceId, restApiId) => {
                return new Promise((resolve, reject) => {

                    agwclient.send(new GetMethodCommand(
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


            let rAgwGR = (restApiId) => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client: agwclient,
                        pageSize: 100,
                    };

                    const cmdParams = {
                        restApiId,
                    };

                    const paginator = paginateGetResources(pConfig, cmdParams);

                    const arr = [];

                    for await (const page of paginator) {
                        arr.push(page.items);
                    }

                    const arrResources = [];
                    for (let i = 0; i < arr.length; i++) {
                        let Resource = arr[i];
                        if (Resource.Methods === undefined) {
                            Resource.Methods = [];
                        }
                        const arrResourceMethods = [];
                        if (Resource.resourceMethods !== undefined) {
                            arrResourceMethods = Object.keys(Resource.resourceMethods);
                        }
                        for (let j = 0; j < arrResourceMethods.length; j++) {
                            let METHOD = arrResourceMethods[j];
                            let oMethod = await rAgwGM(METHOD, Resource.id, restApiId);
                            Resource.Methods.push(oMethod);
                        }
                        arrResources.push(Resource);
                    }

                    resolve(arrResources);
                });
            };


            let rAgwGRAs = () => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client: agwclient,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateGetRestApis(pConfig, cmdParams);

                    const arr = [];

                    for await (const page of paginator) {
                        arr.push(...page.items)
                    }

                    for (let i = 0; i < arr.length; i++) {
                        let RestApi = arr[i];
                        const arrResources = await rAgwGR(RestApi.id);
                        arr[i].Resources = arrResources;
                    }

                    this.objGlobal[region].RestApis = arr;
                    resolve(`${region}-rAgwRGAs`);

                });
            };


            let rELBV2DLBA = (loadbalancer) => {
                return new Promise((resolve, reject) => {

                    elbv2client.send(new DescribeLoadBalancerAttributesCommand(
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


            let rELBV2DLB = () => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client: elbv2client,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateDescribeLoadBalancers(pConfig, cmdParams);

                    const arr = [];

                    for await (const page of paginator) {
                        arr.push(...page.LoadBalancers);
                    }

                    const arrLoadBalancers = [];

                    for (let i = 0; i < arr.length; i++) {
                        let loadBalancer = arr[i];
                        let Attributes = await rELBV2DLBA(loadBalancer);
                        loadBalancer.Attributes = Attributes;
                        arrLoadBalancers.push(loadBalancer);
                    }

                    this.objGlobal[region].ApplicationLoadBalancers = arrLoadBalancers;
                    resolve(`${region}-rELBV2DLB`);
                });
            };


            let rAcmDC = (cert) => {
                return new Promise((resolve, reject) => {

                    acmclient.send(new DescribeCertificateCommand(
                        {
                            CertificateArn: cert.CertificateArn,
                        }
                    ))
                        .then((data) => {
                            resolve(data.Certificate);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                });
            };


            let rAcmLC = () => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client: acmclient,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateListCertificates(pConfig, cmdParams);

                    const arr = [];

                    for await (const page of paginator) {
                        arr.push(...page.CertificateSummaryList);
                    }

                    const arrCertificates = []
                    for (let i = 0; i < arr.length; i++) {
                        let cert = arr[i];
                        let Certificate = await rAcmDC(cert);
                        arrCertificates.push(Certificate);
                    }


                    this.objGlobal[region].Certificates = arrCertificates;
                    resolve(`${region}-rEc2DRT`);
                });
            };


            let rS3LB = () => {
                return new Promise((resolve, reject) => {

                    s3client.send(new ListBucketsCommand({}))
                        .then((data) => {
                            data.Buckets.forEach((bucket) => {
                                if (this.objGlobal[region].Buckets === undefined) {
                                    this.objGlobal[region].Buckets = [];
                                }

                                this.objGlobal[region].Buckets.push(bucket);
                            });
                            resolve(`rS3LB`);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                });
            };


            let rSqsGQA = (QueueUrl) => {
                return new Promise((resolve, reject) => {
                    sqsclient.send(new GetQueueAttributesCommand(
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
            };


            let rSqsLQ = () => {
                return new Promise(async (resolve, reject) => {

                    const pConfig = {
                        client: sqsclient,
                        pageSize: 100,
                    };

                    const cmdParams = {};

                    const paginator = paginateListQueues(pConfig, cmdParams);

                    const arr = [];

                    for await (const page of paginator) {
                        if (page.QueueUrls !== undefined) {
                            arr.push(...page.QueueUrls);
                        }
                    }

                    const arrQueues = [];

                    for (let i = 0; i < arr.length; i++) {
                        let QueueUrl = arr[i];
                        let Queue = await rSqsGQA(QueueUrl);
                        Queue.Attributes.QueueUrl = QueueUrl;
                        arrQueues.push(Queue);
                    }

                    this.objGlobal[region].Queues = arrQueues;
                    resolve(`${region}-rSqsLQ`);
                });
            };


            const RETRIES = 2;
            let requestSender = (fName, retry) => {
                return new Promise(async (resolve, reject) => {
                    if (retry === undefined) {
                        retry = 0;
                    }
                    // console.log(`Attempt ${retry + 1} for ${fName.name} for region ${region}`);


                    let fRand = Math.random();
                    let rWait = Math.round(fRand * this.MAX_WAIT);
                    await new Promise(resolve => setTimeout(resolve, rWait));


                    fName()
                        .then((p) => {
                            resolve(p);
                        })
                        .catch(async (e) => {
                            console.warn(`Problem w requestSender on Fn ${fName.name} for region ${region}.`);
                            console.log(e.name);
                            console.log(Object.keys(e));

                            switch (e.name) {
                                case 'AccessDeniedException':
                                    console.warn(`No retry - access denied insurmountable exception.`);
                                    reject(e);
                                    break;

                                case 'UnrecognizedClientException':
                                    console.warn(`No retry - Unrecognized excpetion, likely no access to region.`);
                                    reject(e);
                                    break;

                                default:
                                    let p;
                                    if (retry < RETRIES) {
                                        console.log(`Retrying, prev error was ${e.name}`);
                                        p = await requestSender(fName, retry + 1);
                                    } else {
                                        console.warn(`Too many retries; failing.`);
                                        reject(e);
                                    }
                            }
                            // let re = /AccessDenied/g;
                            // let arrMatches = e.match(re);
                            // if (arrMatches !== null) {
                            // }
                        });
                });
            };


            let arrRegionRequests = [];
            services.forEach((svc) => {
                switch (svc) {
                    case 'cf':
                        if (region === 'us-east-1') {
                            arrRegionRequests.push(requestSender(rCfLD));
                            arrRegionRequests.push(requestSender(rCfLCP));
                        }
                        break;

                    case 'iam':
                        if (region === 'us-east-1') {
                            arrRegionRequests.push(requestSender(rIamLP));
                            arrRegionRequests.push(requestSender(rIamLR));
                            arrRegionRequests.push(requestSender(rIamLU));
                        }
                        break;

                    case 'r53':
                        if (region === 'us-east-1') {
                            arrRegionRequests.push(requestSender(rR53LHZ));
                        }
                        break;

                    case 'lam':
                        arrRegionRequests.push(requestSender(rLamLF));
                        break;

                    case 'elc':
                        arrRegionRequests.push(requestSender(rElcDCC));
                        arrRegionRequests.push(requestSender(rElcDCSG));
                        arrRegionRequests.push(requestSender(rElcDRG));
                        break;

                    case 'asg':
                        arrRegionRequests.push(requestSender(rAsgDASG));
                        arrRegionRequests.push(requestSender(rAsgDLC));
                        break;

                    case 'ddb':
                        arrRegionRequests.push(requestSender(rDdbLT));
                        break;

                    case 'rds':
                        arrRegionRequests.push(requestSender(rRdsDI));
                        arrRegionRequests.push(requestSender(rRdsDC));
                        arrRegionRequests.push(requestSender(rRdsDOG));
                        arrRegionRequests.push(requestSender(rRdsDPG));
                        arrRegionRequests.push(requestSender(rRdsDSG));
                        break;

                    case 'ec2':
                        arrRegionRequests.push(requestSender(rEc2DI));
                        arrRegionRequests.push(requestSender(rEc2DSG));
                        arrRegionRequests.push(requestSender(rEc2DS));
                        arrRegionRequests.push(requestSender(rEc2DV));
                        arrRegionRequests.push(requestSender(rEc2DVo));
                        arrRegionRequests.push(requestSender(rEc2DRT));
                        arrRegionRequests.push(requestSender(rEc2DAZ));
                        break;

                    case 'cw':
                        arrRegionRequests.push(requestSender(rCwDA));
                        break;

                    case 'ecr':
                        arrRegionRequests.push(requestSender(rEcrDR));
                        break;

                    case 'ecs':
                        arrRegionRequests.push(requestSender(rEcsLC));
                        arrRegionRequests.push(requestSender(rEcsLTD));
                        break;

                    case 's3':
                        arrRegionRequests.push(requestSender(rS3LB));
                        break;

                    case 'elb':
                        arrRegionRequests.push(requestSender(rELBV2DLB));
                        break;

                    case 'acm':
                        arrRegionRequests.push(requestSender(rAcmLC));
                        break;

                    case 'agw':
                        arrRegionRequests.push(requestSender(rAgwGRAs));
                        break;

                    case 'sqs':
                        arrRegionRequests.push(requestSender(rSqsLQ));
                        break;

                    default:
                        console.error(`Unknown service: '${svc}'`);
                }
            });


            Promise.all(arrRegionRequests)
                .then((p) => {
                    resolve(p);
                });
        });
    };


    inventory() {
        return new Promise(async (resolve) => {

            this.objGlobal = {};
            let arrRequests = [];

            /*
            Calculate temporal spread
             */
            this.MAX_WAIT = Math.floor((this.regions.length + this.services.length) / 2) * 1000;
            arrRequests.push(this.obtainAccountNumber());
            this.regions.forEach((region) => {
                arrRequests.push(this.run(region, this.services, this.credentials));
            });

            Promise.all(arrRequests)
                .then(() => {
                    resolve(this.objGlobal);
                });
        });
    }
}

module.exports = exports = AwsInventory.AwsInventory = AwsInventory;
