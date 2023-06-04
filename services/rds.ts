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
    RDSClient, DBProxyTarget, DBProxyTargetGroup, DBProxy
} from "@aws-sdk/client-rds";
import {AwsCredentialIdentity} from "@aws-sdk/types";

let serviceCallManifest;

interface _catcher {
    handle: Function,
}

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


let rds_DescribeDBProxyTargetGroups = (DBProxyName: string, region: string, credentials: AwsCredentialIdentity, objAttribs: {}, catcher: _catcher): Promise<{
    [key: string]: {
        DBTargetGroups: DBProxyTargetGroup[],
    }
}> => {
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
                if (page.TargetGroups) arr.push(...page.TargetGroups);
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


let rds_DescribeDBProxyTargets = (DBProxyName: string, region: string, credentials: AwsCredentialIdentity, objAttribs: {}, catcher: _catcher): Promise<{
    [key: string]: {
        DBTargets: DBProxyTarget[],
    }
}> => {
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
                if (page.Targets) arr.push(...page.Targets);
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


export let rds_DescribeDBProxyEndpoints = (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => {
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
                if (page.DBProxyEndpoints) arr.push(...page.DBProxyEndpoints);
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


export let rds_DescribeDBProxies = (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => {
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
                if (page.DBProxies) arr.push(...page.DBProxies);
                arr2.push(catcher.handle(page.DBProxies, objAttribs))
            }

        } catch (e) {
            reject(e);
        }


        let objGlobal: {
            [region: string]: {
                DBProxies: DBProxy[],
                DBProxyTargets: DBProxyTarget[],
                DBProxyTargetGroups: DBProxyTargetGroup[],
            }
        } = {
            [region]: {
                DBProxies: arr,
                DBProxyTargets: [],
                DBProxyTargetGroups: [],
            }
        };

        interface _regiontargets {
            [region: string]: {
                DBTargets: DBProxyTarget[],
            },
        }

        interface _regiontargetgroups {
            [region: string]: {
                DBTargetGroups: DBProxyTargetGroup[],
            },
        }

        let arr3: Promise<_regiontargets | _regiontargetgroups>[] = [];
        arr.forEach((objProxy) => {
            if (objProxy.DBProxyName) {

                arr3.push(rds_DescribeDBProxyTargets(objProxy.DBProxyName, region, credentials, objAttribs, catcher));
                arr3.push(rds_DescribeDBProxyTargetGroups(objProxy.DBProxyName, region, credentials, objAttribs, catcher));
            }
        });


        Promise.all(arr3)
            .then((arrP) => {

                arrP.forEach((obj) => {
                    const _regions = Object.keys(obj);

                    _regions.forEach((region) => {
                        let regionObjects = obj[region];
                        let regionObjectNames = Object.keys(regionObjects);

                        regionObjectNames.forEach((objectName) => {

                            // @ts-ignore
                            let resources: DBProxyTarget[] | DBProxyTargetGroup[] = regionObjects[objectName];

                            // @ts-ignore
                            if (objGlobal[region][objectName] !== undefined) {

                                // @ts-ignore
                                objGlobal[region][objectName].push(...resources);
                            } else {
                                // @ts-ignore
                                objGlobal[region][objectName] = resources;
                            }

                        });
                    });
                });

                resolve(objGlobal);

            });

    });
};


export let rds_DescribeDBSubnetGroups = (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => {
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
                if (page.DBSubnetGroups) arr.push(...page.DBSubnetGroups);
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


export let rds_DescribeDBParameterGroups = (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => {
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
                if (page.DBParameterGroups) arr.push(...page.DBParameterGroups);
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


export let rds_DescribeOptionGroups = (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => {
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
                if (page.OptionGroupsList) arr.push(...page.OptionGroupsList);
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


export let rds_DescribeDBClusters = (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => {
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
                if (page.DBClusters) arr.push(...page.DBClusters);
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


export let rds_DescribeDBInstances = (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => {
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
                if (page.DBInstances) arr.push(...page.DBInstances);
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

