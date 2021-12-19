'use strict';

import {
    paginateDescribeDBClusters, paginateDescribeDBInstances,
    paginateDescribeDBParameterGroups,
    paginateDescribeDBSubnetGroups,
    paginateDescribeOptionGroups,
    RDSClient
} from "@aws-sdk/client-rds";

export let rds_DescribeDBSubnetGroups = (region, credentials) => {
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


export let rds_DescribeDBParameterGroups = (region, credentials) => {
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


export let rds_DescribeOptionGroups = (region, credentials) => {
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


export let rds_DescribeDBClusters = (region, credentials) => {
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


export let rds_DescribeDBInstances = (region, credentials) => {
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

