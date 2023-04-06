/**
 * @author ekeyser
 */
'use strict';

import * as _acm from "./services/acm";
import * as _apigateway from "./services/apigateway";
import * as _autoscaling from "./services/autoscaling";
import * as _cloudfront from "./services/cloudfront";
import * as _cloudwatch from "./services/cloudwatch";
import * as _cognitoidp from "./services/cognitoidp";
import * as _dynamodb from "./services/dynamodb";
import * as _ec2 from './services/ec2';
import * as _ecr from "./services/ecr";
import * as _ecs from "./services/ecs";
import * as _elasticache from "./services/elasticache";
import * as _elasticloadbalancing from "./services/elasticloadbalancing";
import * as _iam from './services/iam';
import * as _lambda from "./services/lambda";
import * as _rds from "./services/rds";
import * as _route53 from "./services/route53";
import * as _s3 from "./services/s3";
import * as _states from './services/states';
import * as _sqs from './services/sqs';
import * as _sns from './services/sns';
import * as _sts from "./services/sts";

export class AwsInventory {

    constructor(config) {
        this.credentials = config.credentials;
        this.calls = config.calls;
        this.permissions = [];
        this.catcher = config.catcher;
        this.cohort = config.cohort;
    }


    static getPermissions = () => {

        let permissions = [];

        let services = [
            '_acm',
            '_apigateway',
            '_autoscaling',
            '_cloudfront',
            '_cloudwatch',
            '_cognitoidp',
            '_dynamodb',
            '_ec2',
            '_ecr',
            '_ecs',
            '_elasticache',
            '_elasticloadbalancing',
            '_iam',
            '_lambda',
            '_rds',
            '_route53',
            '_s3',
            '_states',
            '_sns',
            '_sqs',
            '_sts'
        ];
        services.forEach((service) => {

            // let svc = eval(service);
            switch (service) {
                case '_acm':
                    permissions.push(..._acm.getPerms());
                    break;
                case '_apigateway':
                    permissions.push(..._apigateway.getPerms());
                    break;
                case '_autoscaling':
                    permissions.push(..._autoscaling.getPerms());
                    break;
                case '_cloudfront':
                    permissions.push(..._cloudfront.getPerms());
                    break;
                case '_cloudwatch':
                    permissions.push(..._cloudwatch.getPerms());
                    break;
                case '_cognitoidp':
                    permissions.push(..._cognitoidp.getPerms());
                    break;
                case '_dynamodb':
                    permissions.push(..._dynamodb.getPerms());
                    break;
                case '_ec2':
                    permissions.push(..._ec2.getPerms());
                    break;
                case '_ecr':
                    permissions.push(..._ecr.getPerms());
                    break;
                case '_ecs':
                    permissions.push(..._ecs.getPerms());
                    break;
                case '_elasticache':
                    permissions.push(..._elasticache.getPerms());
                    break;
                case '_elasticloadbalancing':
                    permissions.push(..._elasticloadbalancing.getPerms());
                    break;
                case '_iam':
                    permissions.push(..._iam.getPerms());
                    break;
                case '_lambda':
                    permissions.push(..._lambda.getPerms());
                    break;
                case '_rds':
                    permissions.push(..._rds.getPerms());
                    break;
                case '_route53':
                    permissions.push(..._route53.getPerms());
                    break;
                case '_s3':
                    permissions.push(..._s3.getPerms());
                    break;
                case '_states':
                    permissions.push(..._states.getPerms());
                    break;
                case '_sns':
                    permissions.push(..._sns.getPerms());
                    break;
                case '_sqs':
                    permissions.push(..._sqs.getPerms());
                    break;
                case '_sts':
                    permissions.push(..._sts.getPerms());
                    break;
            }
            // let perms = _getPerms();
            // permissions.push(...perms);

        });

        return permissions;

    };


    static getCalls = () => {
        return config.calls;
    };


    obtainAccountNumber(region) {
        return new Promise((resolve, reject) => {

            _sts.sts_GetCallerIdentity(region, this.credentials)
                .then((p) => {
                    resolve(p);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }


    run(Account, region, strService, apiCall, svcCallsAll) {
        return new Promise((resolve, reject) => {

            let credentials = this.credentials;

            if (this.objGlobal[region] === undefined) {
                this.objGlobal[region] = {};
            }


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
                    let kind;
                    switch (fName) {
                        case 'acm_ListCertificates':
                            kind = 'Certificates';
                            fnName = _acm.acm_ListCertificates;
                            break;
                        case 'apigateway_GetRestApis':
                            kind = 'RestApis';
                            fnName = _apigateway.apigateway_Begin;
                            // fnName = _apigateway.apigateway_GetRestApis;
                            break;
                        case 'autoscaling_DescribeLaunchConfigurations':
                            kind = 'LaunchConfigurations';
                            fnName = _autoscaling.autoscaling_DescribeLaunchConfigurations;
                            break;
                        case 'autoscaling_DescribeAutoScalingGroups':
                            kind = 'AutoScalingGroups';
                            fnName = _autoscaling.autoscaling_DescribeAutoScalingGroups;
                            break;
                        case 'cloudfront_ListCachePolicies':
                            kind = 'CachePolicies';
                            fnName = _cloudfront.cloudfront_ListCachePolicies;
                            break;
                        case 'cloudfront_ListDistributions':
                            kind = 'Distributions';
                            fnName = _cloudfront.cloudfront_ListDistributions;
                            break;
                        case 'cloudwatch_DescribeAlarms':
                            kind = 'Alarms';
                            fnName = _cloudwatch.cloudwatch_DescribeAlarms;
                            break;
                        case 'cognito-idp_ListUserPools':
                            kind = 'UserPools';
                            fnName = _cognitoidp.cognitoidp_ListUserPools;
                            break;
                        case 'dynamodb_ListTables':
                            kind = 'Tables';
                            fnName = _dynamodb.dynamodb_ListTables;
                            break;
                        case 'ec2_DescribeVpcs':
                            kind = 'Vpcs';
                            fnName = _ec2.ec2_DescribeVpcs;
                            break;
                        case 'ec2_DescribeAvailabilityZones':
                            kind = 'AvailabilityZones';
                            fnName = _ec2.ec2_DescribeAvailabilityZones;
                            break;
                        case 'ec2_DescribeSecurityGroups':
                            kind = 'SecurityGroups';
                            fnName = _ec2.ec2_DescribeSecurityGroups;
                            break;
                        case 'ec2_DescribeVolumes':
                            kind = 'Volumes';
                            fnName = _ec2.ec2_DescribeVolumes;
                            break;
                        case 'ec2_DescribeRouteTables':
                            kind = 'RouteTables';
                            fnName = _ec2.ec2_DescribeRouteTables;
                            break;
                        case 'ec2_DescribeSubnets':
                            kind = 'Subnets';
                            fnName = _ec2.ec2_DescribeSubnets;
                            break;
                        case 'ec2_DescribeInstances':
                            kind = 'Instances';
                            fnName = _ec2.ec2_DescribeInstances;
                            break;
                        case 'ecr_DescribeRepositories':
                            kind = 'Repositories';
                            fnName = _ecr.ecr_DescribeRepositories;
                            break;
                        case 'ecs_ListClusters':
                            kind = 'Clusters';
                            fnName = _ecs.ecs_ListClusters;
                            break;
                        case 'ecs_ListTaskDefinitions':
                            kind = 'TaskDefinitions';
                            fnName = _ecs.ecs_ListTaskDefinitions;
                            break;
                        case 'elasticache_DescribeCacheClusters':
                            kind = 'CacheClusters';
                            fnName = _elasticache.elasticache_DescribeCacheClusters;
                            break;
                        case 'elasticache_DescribeReplicationGroups':
                            kind = 'ReplicationGroups';
                            fnName = _elasticache.elasticache_DescribeReplicationGroups;
                            break;
                        case 'elasticache_DescribeCacheSubnetGroups':
                            kind = 'CacheSubnetGroups';
                            fnName = _elasticache.elasticache_DescribeCacheSubnetGroups;
                            break;
                        case 'elasticloadbalancing_DescribeLoadBalancers':
                            kind = 'LoadBalancers';
                            fnName = _elasticloadbalancing.elasticloadbalancing_DescribeLoadBalancers;
                            break;
                        case 'iam_ListUsers':
                            kind = 'Users';
                            fnName = _iam.iam_ListUsers;
                            break;
                        case 'iam_ListPolicies':
                            kind = 'Policies';
                            fnName = _iam.iam_ListPolicies;
                            break;
                        case 'iam_ListRoles':
                            kind = 'Roles';
                            fnName = _iam.iam_ListRoles;
                            break;
                        case 'lambda_ListFunctions':
                            kind = 'Functions';
                            fnName = _lambda.lambda_ListFunctions;
                            break;
                        case 'rds_DescribeDBSubnetGroups':
                            kind = 'DBSubnetGroups';
                            fnName = _rds.rds_DescribeDBSubnetGroups;
                            break;
                        case 'rds_DescribeDBParameterGroups':
                            kind = 'DBParameterGroups';
                            fnName = _rds.rds_DescribeDBParameterGroups;
                            break;
                        case 'rds_DescribeOptionGroups':
                            kind = 'OptionGroups';
                            fnName = _rds.rds_DescribeOptionGroups;
                            break;
                        case 'rds_DescribeDBClusters':
                            kind = 'DBClusters';
                            fnName = _rds.rds_DescribeDBClusters;
                            break;
                        case 'rds_DescribeDBInstances':
                            kind = 'DBInstances';
                            fnName = _rds.rds_DescribeDBInstances;
                            break;
                        case 'rds_DescribeDBProxies':
                            kind = 'DBProxies';
                            fnName = _rds.rds_DescribeDBProxies;
                            break;
                        case 'rds_DescribeDBProxyEndpoints':
                            kind = 'DBProxyEndpoints';
                            fnName = _rds.rds_DescribeDBProxyEndpoints;
                            break;
                        case 'route53_ListHostedZones':
                            kind = 'HostedZones';
                            fnName = _route53.route53_ListHostedZones;
                            break;
                        case 's3_ListBuckets':
                            kind = 'Buckets';
                            fnName = _s3.s3_ListBuckets;
                            break;
                        case 'sns_ListSubscriptions':
                            kind = 'Subscriptions';
                            fnName = _sns.sns_ListSubscriptions;
                            break;
                        case 'sns_ListTopics':
                            kind = 'Topics';
                            fnName = _sns.sns_ListTopics;
                            break;
                        case 'sqs_ListQueues':
                            kind = 'Queues';
                            fnName = _sqs.sqs_ListQueues;
                            break;
                        case 'states_ListActivities':
                            kind = 'Activities';
                            fnName = _states.states_ListActivities;
                            break;
                        case 'states_ListStateMachines':
                            kind = 'StateMachines';
                            fnName = _states.states_ListStateMachines;
                            break;
                        // case 'states_ListExecutions':
                        //   fnName = _states.states_ListExecutions;
                        //   break;
                        default:
                            const message = `${region}/fName '${fName}' is not an inventory initatior.`;
                            resolve(message);
                    }


                    const objAttribs = {
                        region,
                        kind,
                        aws_access_key_id: credentials.accessKeyId,
                        Account,
                        cohort: this.cohort,
                    };


                    if (fnName !== undefined) {

                        fnName(region, this.credentials, svcCallsAll, objAttribs, this.catcher)
                            .then((resources) => {

                                Object.keys(resources[region]).forEach((resourceType) => {
                                    this.objGlobal[region][resourceType] = resources[region][resourceType];
                                });

                                resolve(resources);

                            })
                            .catch(async (e) => {

                                switch (e.name) {
                                    case 'ValidationError':
                                    case 'AuthFailure':
                                    case 'AccessDenied':
                                    case 'UnauthorizedOperation':
                                    case 'AccessDeniedException':
                                    case 'InvalidClientTokenId':
                                    case 'UnrecognizedClientException':
                                    case 'AuthorizationError':
                                    case 'TypeError':
                                        // console.warn(`${e.name}: will not attempt retry.`);
                                        resolve(e);
                                        break;
                                    default:
                                        // console.error(`--------> Mk.706 Problem w requestSender on Fn '${fName}' for region ${region}.`);
                                        // console.warn(e.name);
                                        // console.warn(Object.keys(e));

                                        let p;
                                        if (retry < RETRIES) {
                                            // console.log(`----------> Mk.707 Retrying, prev error was ${e.name}`);
                                            p = await requestSender(fName, retry + 1);
                                        } else {
                                            // console.warn(`----------> Mk.708 Too many retries; failing.`);
                                            resolve(e);
                                        }
                                }
                            });

                    }
                });
            };


            let strApiCallFn = `${strService}_${apiCall}`;
            switch (strService) {
                case 's3':
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


            this.MAX_WAIT = Math.floor((numCalls) / 200) * 1000;


            let arrRequests = [];

            Account = await this.obtainAccountNumber('us-east-1');
            // arrRequests.push(this.obtainAccountNumber('us-east-1')
            //     .then((data) => {
            //         Account = data.Account;
            //     }));


            Object.keys(this.calls).forEach((strRegion) => {
                let arrServices = Object.keys(this.calls[strRegion])
                arrServices.forEach((strService) => {
                    this.calls[strRegion][strService].forEach((apiCall) => {
                        arrRequests.push(this.run(Account.Account, strRegion, strService, apiCall, this.calls[strRegion][strService]));
                    });
                });
            });


            let regions = {};
            Promise.all(arrRequests)
                .then(() => {


                    Object.keys(this.objGlobal).forEach((region) => {
                        regions[region] = this.objGlobal[region];
                    });

                    let obj = {
                        aws: {
                            Account,
                            cloudProviderName: 'aws',
                            regions,
                        },
                    };

                    resolve(obj);

                })
                .catch((e) => {

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
