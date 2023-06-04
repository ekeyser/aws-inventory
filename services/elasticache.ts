'use strict';

import {
    ElastiCacheClient,
    paginateDescribeCacheClusters,
    paginateDescribeCacheSubnetGroups, paginateDescribeReplicationGroups
} from "@aws-sdk/client-elasticache";
import {AwsCredentialIdentity} from "@aws-sdk/types";

let serviceCallManifest;

interface _catcher {
    handle: Function,
}

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
}


export let elasticache_DescribeCacheClusters = (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => {
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
        const _arrC = [];

        try {

            for await (const page of paginator) {
                if (page.CacheClusters) arr.push(...page.CacheClusters);
                _arrC.push(catcher.handle(page.CacheClusters, objAttribs));
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


export let elasticache_DescribeCacheSubnetGroups = (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => {
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
        const _arrC = [];

        try {

            for await (const page of paginator) {
                if (page.CacheSubnetGroups) arr.push(...page.CacheSubnetGroups);
                _arrC.push(catcher.handle(page.CacheSubnetGroups, objAttribs));
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


export let elasticache_DescribeReplicationGroups = (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => {
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
        const _arrC = [];

        try {

            for await (const page of paginator) {
                if (page.ReplicationGroups) arr.push(...page.ReplicationGroups);
                _arrC.push(catcher.handle(page.ReplicationGroups, objAttribs));
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
