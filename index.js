/**
 * @author ekeyser
 */
'use strict';

import config from './config';
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
import {
    lambda_ListFunctions
} from "./services/lambda";
import {
    cloudfront_ListCachePolicies,
    cloudfront_ListDistributions,
} from "./services/cloudfront";
import {
    rds_DescribeDBClusters,
    rds_DescribeDBInstances,
    rds_DescribeDBParameterGroups,
    rds_DescribeDBSubnetGroups,
    rds_DescribeOptionGroups
} from "./services/rds";
import {
    ecr_DescribeRepositories
} from "./services/ecr";
import {
    cloudwatch_DescribeAlarms
} from "./services/cloudwatch";
import {
    elasticloadbalancing_DescribeLoadBalancers
} from "./services/elasticloadbalancing";
import {
    elasticache_DescribeCacheClusters,
    elasticache_DescribeCacheSubnetGroups,
    elasticache_DescribeReplicationGroups
} from "./services/elasticache";
import {
    autoscaling_DescribeAutoScalingGroups,
    autoscaling_DescribeLaunchConfigurations
} from "./services/autoscaling";
import {
    dynamodb_ListTables
} from "./services/dynamodb";
import {
    ecs_ListClusters,
    ecs_ListTaskDefinitions
} from "./services/ecs";
import {
    apigateway_GetRestApis
} from "./services/apigateway";
import {
    s3_ListBuckets
} from "./services/s3";


export class AwsInventory {

    constructor(config) {
        this.credentials = config.credentials;
        this.calls = config.calls;
    }

    getInventoryInitiators = () => {
        return {
            "acm": [
                "ListCertificates"
            ],
            "apigateway": [
                "GetRestApis"
            ],
            "autoscaling": [],
            "cloudfront": [],
            "cloudwatch": [],
            "dynamodb": [],
            "ec2": [],
            "ecr": [],
            "ecs": [],
            "elasticache": [],
            "elasticloadbalancing": [],
            "iam": [],
            "lambda": [],
            "rds": [],
            "route53": [],
            "s3": [],
            "sqs": [],
            "sts": [],
        };
    };


    static getRequestPermissions = () => {
        return config.permissions;
    };


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
                        // case 'apigateway_GetRestApis':
                        //     fnName = apigateway_GetRestApis;
                        //     break;
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
                        // case 's3_ListBuckets':
                        //     fnName = s3_ListBuckets;
                        //     break;
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

                                Object.keys(p[region]).forEach((resource) => {
                                    this.objGlobal[region][resource] = p[region][resource];
                                });

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


            this.MAX_WAIT = Math.floor((numCalls) / 50) * 1000;


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

                    console.error(e);
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
