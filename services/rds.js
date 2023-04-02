'use strict';

import {
    paginateDescribeDBClusters, paginateDescribeDBInstances,
    paginateDescribeDBParameterGroups,
    paginateDescribeDBSubnetGroups,
    paginateDescribeOptionGroups,
    paginateDescribeDBProxies,
    paginateDescribeDBProxyEndpoints,
    paginateDescribeDBProxyTargetGroups,
    paginateDescribeDBProxyTargets,
    RDSClient
} from "@aws-sdk/client-rds";

let serviceCallManifest;

export function getPerms() {
    return [
        {
            "service": "rds",
            "call": "DescribeDBSubnetGroups",
            "permission": "DescribeDBSubnetGroups",
            "initiator": true
        },
        {
            "service": "rds",
            "call": "DescribeDBParameterGroups",
            "permission": "DescribeDBParameterGroups",
            "initiator": true
        },
        {
            "service": "rds",
            "call": "DescribeOptionGroups",
            "permission": "DescribeOptionGroups",
            "initiator": true
        },
        {
            "service": "rds",
            "call": "DescribeDBClusters",
            "permission": "DescribeDBClusters",
            "initiator": true
        },
        {
            "service": "rds",
            "call": "DescribeDBInstances",
            "permission": "DescribeDBInstances",
            "initiator": true
        },
        {
            "service": "rds",
            "call": "DescribeDBProxies",
            "permission": "DescribeDBProxies",
            "initiator": true
        },
        {
            "service": "rds",
            "call": "DescribeDBProxyEndpoints",
            "permission": "DescribeDBProxyEndpoints",
            "initiator": true
        },
        {
            "service": "rds",
            "call": "DescribeDBProxyTargets",
            "permission": "DescribeDBProxyTargets",
            "initiator": false
        },
        {
            "service": "rds",
            "call": "DescribeDBProxyTargetGroups",
            "permission": "DescribeDBProxyTargetGroups",
            "initiator": false
        }
    ];
}


let rds_DescribeDBProxyTargetGroups = (DBProxyName, region, credentials, objAttribs, catcher) => {
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

        const cmdParams = {
            DBProxyName
        };

        const paginator = paginateDescribeDBProxyTargetGroups(pConfig, cmdParams);

        const arr = [];
        const arr2 = [];

        try {

            for await (const page of paginator) {
                arr.push(...page.TargetGroups);
                arr2.push(catcher.handle(page.TargetGroups, objAttribs))
            }

        } catch (e) {
            reject(e);
        }

        let objGlobal = {
            [region]: {
                DBTargetGroups: arr
            }
        };
        resolve(objGlobal);
    });
};


let rds_DescribeDBProxyTargets = (DBProxyName, region, credentials, objAttribs, catcher) => {
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

        const cmdParams = {
            DBProxyName
        };

        const paginator = paginateDescribeDBProxyTargets(pConfig, cmdParams);

        const arr = [];
        const arr2 = [];

        try {

            for await (const page of paginator) {
                arr.push(...page.Targets);
                arr2.push(catcher.handle(page.Targets, objAttribs))
            }

        } catch (e) {
            reject(e);
        }

        let objGlobal = {
            [region]: {
                DBTargets: arr
            }
        };
        resolve(objGlobal);
    });
};


export let rds_DescribeDBProxyEndpoints = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {

        serviceCallManifest = svcCallsAll;
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

        const paginator = paginateDescribeDBProxyEndpoints(pConfig, cmdParams);

        const arr = [];
        const arr2 = [];

        try {

            for await (const page of paginator) {
                arr.push(...page.DBProxyEndpoints);
                arr2.push(catcher.handle(page.DBProxyEndpoints, objAttribs))
            }

        } catch (e) {
            reject(e);
        }

        let objGlobal = {
            [region]: {
                DBProxyEndpoints: arr
            }
        };
        resolve(objGlobal);
    });
};


export let rds_DescribeDBProxies = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {

        serviceCallManifest = svcCallsAll;
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

        const paginator = paginateDescribeDBProxies(pConfig, cmdParams);

        const arr = [];
        const arr2 = [];

        try {

            for await (const page of paginator) {
                arr.push(...page.DBProxies);
                arr2.push(catcher.handle(page.DBProxies, objAttribs))
            }

        } catch (e) {
            reject(e);
        }


        let objGlobal = {
            [region]: {
                DBProxies: arr
            }
        };


        let arr3 = [];
        arr.forEach((objProxy, i) => {
            arr3.push(rds_DescribeDBProxyTargets(objProxy.DBProxyName, region, credentials, objAttribs, catcher));
            arr3.push(rds_DescribeDBProxyTargetGroups(objProxy.DBProxyName, region, credentials, objAttribs, catcher));
        });


        Promise.all(arr3)
            .then((arrP) => {

                arrP.forEach((obj) => {
                    Object.keys(obj[region]).forEach((sResourceType) => {
                        let aResources = obj[region][sResourceType];
                        if (objGlobal[region][sResourceType] !== undefined) {
                            objGlobal[region][sResourceType].push(...aResources);
                        } else {
                            objGlobal[region][sResourceType] = aResources;
                        }
                    });
                });

                resolve(objGlobal);

            });

    });
};


export let rds_DescribeDBSubnetGroups = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {

        serviceCallManifest = svcCallsAll;
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
        const arr2 = [];

        try {

            for await (const page of paginator) {
                arr.push(...page.DBSubnetGroups);
                arr2.push(catcher.handle(page.DBSubnetGroups, objAttribs))
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


export let rds_DescribeDBParameterGroups = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {

        serviceCallManifest = svcCallsAll;
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
        const arr2 = [];

        try {

            for await (const page of paginator) {
                arr.push(...page.DBParameterGroups);
                arr2.push(catcher.handle(page.DBParameterGroups, objAttribs))
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


export let rds_DescribeOptionGroups = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {

        serviceCallManifest = svcCallsAll;
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
        const arr2 = [];

        try {

            for await (const page of paginator) {
                arr.push(...page.OptionGroupsList);
                arr2.push(catcher.handle(page.OptionGroupsList, objAttribs))
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


export let rds_DescribeDBClusters = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {

        serviceCallManifest = svcCallsAll;
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
        const arr2 = [];

        try {

            for await (const page of paginator) {
                arr.push(...page.DBClusters);
                arr2.push(catcher.handle(page.DBClusters, objAttribs))
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


export let rds_DescribeDBInstances = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {

        serviceCallManifest = svcCallsAll;
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
        const arr2 = [];

        try {

            for await (const page of paginator) {
                arr.push(...page.DBInstances);
                arr2.push(catcher.handle(page.DBInstances, objAttribs))
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

