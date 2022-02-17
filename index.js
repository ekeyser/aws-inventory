/**
 * @author ekeyser
 */
'use strict';

import * as _acm from './services/acm';
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

            let svc = eval(service);
            let perms = svc.getPerms();
            permissions.push(...perms);

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


    run(region, strService, apiCall, svcCallsAll) {
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
                    switch (fName) {
                        case 'acm_ListCertificates':
                            fnName = _acm.acm_ListCertificates;
                            break;
                        case 'apigateway_GetRestApis':
                            fnName = _apigateway.apigateway_Begin;
                            // fnName = _apigateway.apigateway_GetRestApis;
                            break;
                        case 'autoscaling_DescribeLaunchConfigurations':
                            fnName = _autoscaling.autoscaling_DescribeLaunchConfigurations;
                            break;
                        case 'autoscaling_DescribeAutoScalingGroups':
                            fnName = _autoscaling.autoscaling_DescribeAutoScalingGroups;
                            break;
                        case 'cloudfront_ListCachePolicies':
                            fnName = _cloudfront.cloudfront_ListCachePolicies;
                            break;
                        case 'cloudfront_ListDistributions':
                            fnName = _cloudfront.cloudfront_ListDistributions;
                            break;
                        case 'cloudwatch_DescribeAlarms':
                            fnName = _cloudwatch.cloudwatch_DescribeAlarms;
                            break;
                        case 'cognito-idp_ListUserPools':
                            fnName = _cognitoidp.cognitoidp_ListUserPools;
                            break;
                        case 'dynamodb_ListTables':
                            fnName = _dynamodb.dynamodb_ListTables;
                            break;
                        case 'ec2_DescribeVpcs':
                            fnName = _ec2.ec2_DescribeVpcs;
                            break;
                        case 'ec2_DescribeAvailabilityZones':
                            fnName = _ec2.ec2_DescribeAvailabilityZones;
                            break;
                        case 'ec2_DescribeSecurityGroups':
                            fnName = _ec2.ec2_DescribeSecurityGroups;
                            break;
                        case 'ec2_DescribeVolumes':
                            fnName = _ec2.ec2_DescribeVolumes;
                            break;
                        case 'ec2_DescribeRouteTables':
                            fnName = _ec2.ec2_DescribeRouteTables;
                            break;
                        case 'ec2_DescribeSubnets':
                            fnName = _ec2.ec2_DescribeSubnets;
                            break;
                        case 'ec2_DescribeInstances':
                            fnName = _ec2.ec2_DescribeInstances;
                            break;
                        case 'ecr_DescribeRepositories':
                            fnName = _ecr.ecr_DescribeRepositories;
                            break;
                        case 'ecs_ListClusters':
                            fnName = _ecs.ecs_ListClusters;
                            break;
                        case 'ecs_ListTaskDefinitions':
                            fnName = _ecs.ecs_ListTaskDefinitions;
                            break;
                        case 'elasticache_DescribeCacheClusters':
                            fnName = _elasticache.elasticache_DescribeCacheClusters;
                            break;
                        case 'elasticache_DescribeReplicationGroups':
                            fnName = _elasticache.elasticache_DescribeReplicationGroups;
                            break;
                        case 'elasticache_DescribeCacheSubnetGroups':
                            fnName = _elasticache.elasticache_DescribeCacheSubnetGroups;
                            break;
                        case 'elasticloadbalancing_DescribeLoadBalancers':
                            fnName = _elasticloadbalancing.elasticloadbalancing_DescribeLoadBalancers;
                            break;
                        case 'iam_ListUsers':
                            fnName = _iam.iam_ListUsers;
                            break;
                        case 'iam_ListPolicies':
                            fnName = _iam.iam_ListPolicies;
                            break;
                        case 'iam_ListRoles':
                            fnName = _iam.iam_ListRoles;
                            break;
                        case 'lambda_ListFunctions':
                            fnName = _lambda.lambda_ListFunctions;
                            break;
                        case 'rds_DescribeDBSubnetGroups':
                            fnName = _rds.rds_DescribeDBSubnetGroups;
                            break;
                        case 'rds_DescribeDBParameterGroups':
                            fnName = _rds.rds_DescribeDBParameterGroups;
                            break;
                        case 'rds_DescribeOptionGroups':
                            fnName = _rds.rds_DescribeOptionGroups;
                            break;
                        case 'rds_DescribeDBClusters':
                            fnName = _rds.rds_DescribeDBClusters;
                            break;
                        case 'rds_DescribeDBInstances':
                            fnName = _rds.rds_DescribeDBInstances;
                            break;
                        case 'rds_DescribeDBProxies':
                            fnName = _rds.rds_DescribeDBProxies;
                            break;
                        case 'rds_DescribeDBProxyEndpoints':
                            fnName = _rds.rds_DescribeDBProxyEndpoints;
                            break;
                        case 'route53_ListHostedZones':
                            fnName = _route53.route53_ListHostedZones;
                            break;
                        case 's3_ListBuckets':
                            fnName = _s3.s3_ListBuckets;
                            break;
                        case 'sns_ListSubscriptions':
                            fnName = _sns.sns_ListSubscriptions;
                            break;
                        case 'sns_ListTopics':
                            fnName = _sns.sns_ListTopics;
                            break;
                        case 'sqs_ListQueues':
                            fnName = _sqs.sqs_ListQueues;
                            break;
                        case 'states_ListActivities':
                            fnName = _states.states_ListActivities;
                            break;
                        case 'states_ListStateMachines':
                            fnName = _states.states_ListStateMachines;
                            break;
                        // case 'states_ListExecutions':
                        //   fnName = _states.states_ListExecutions;
                        //   break;
                        default:
                            const message = `${region}/fName '${fName}' is not an inventory initatior.`;
                            resolve(message);
                    }


                    if (fnName !== undefined) {

                        fnName(region, this.credentials, svcCallsAll)
                            .then((p) => {

                                Object.keys(p[region]).forEach((resource) => {
                                    this.objGlobal[region][resource] = p[region][resource];
                                });

                                resolve(p);

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
            arrRequests.push(this.obtainAccountNumber('us-east-1')
                .then((data) => {
                    Account = data.Account;
                }));


            Object.keys(this.calls).forEach((strRegion) => {
                let arrServices = Object.keys(this.calls[strRegion])
                arrServices.forEach((strService) => {
                    this.calls[strRegion][strService].forEach((apiCall) => {
                        arrRequests.push(this.run(strRegion, strService, apiCall, this.calls[strRegion][strService]));
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
                        Account,
                        cloudProviderName: 'aws',
                        regions,
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
