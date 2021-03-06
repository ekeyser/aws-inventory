'use strict';

import {
    ElastiCacheClient,
    paginateDescribeCacheClusters,
    paginateDescribeCacheSubnetGroups, paginateDescribeReplicationGroups
} from "@aws-sdk/client-elasticache";

let serviceCallManifest;

export function getPerms() {
    return [
        {
            "service": "elasticache",
            "call": "DescribeCacheClusters",
            "permission": "DescribeCacheClusters",
            "initiator": true
        },
        {
            "service": "elasticache",
            "call": "DescribeReplicationGroups",
            "permission": "DescribeReplicationGroups",
            "initiator": true
        },
        {
            "service": "elasticache",
            "call": "DescribeCacheSubnetGroups",
            "permission": "DescribeCacheSubnetGroups",
            "initiator": true
        }
    ];
};


export let elasticache_DescribeCacheClusters = (region, credentials, svcCallsAll) => {
    return new Promise(async (resolve, reject) => {

      serviceCallManifest = svcCallsAll;
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


export let elasticache_DescribeCacheSubnetGroups = (region, credentials, svcCallsAll) => {
    return new Promise(async (resolve, reject) => {

      serviceCallManifest = svcCallsAll;
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


export let elasticache_DescribeReplicationGroups = (region, credentials, svcCallsAll) => {
    return new Promise(async (resolve, reject) => {

      serviceCallManifest = svcCallsAll;
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
