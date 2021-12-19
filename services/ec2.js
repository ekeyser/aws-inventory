'use strict';

import {
    EC2Client,
    DescribeAvailabilityZonesCommand,
    paginateDescribeSecurityGroups,
    paginateDescribeVolumes,
    paginateDescribeRouteTables,
    paginateDescribeSubnets,
    paginateDescribeVpcs,
    paginateDescribeInstances,
} from '@aws-sdk/client-ec2';

export function ec2_DescribeAvailabilityZones(region, credentials) {
    return new Promise((resolve, reject) => {

        let client = new EC2Client({
            region,
            credentials,
        });

        let arr = [];
        client.send(new DescribeAvailabilityZonesCommand({}))
            .then((data) => {
                for (let i = 0; i < data.AvailabilityZones.length; i++) {
                    let AvailabilityZone = data.AvailabilityZones[i];
                    arr.push(AvailabilityZone);
                }
                // data.AvailabilityZones.forEach((AvailabilityZone) => {
                //     if (this.objGlobal[region].AvailabilityZones === undefined) {
                //         this.objGlobal[region].AvailabilityZones = [];
                //     }
                //
                //     this.objGlobal[region].AvailabilityZones.push(AvailabilityZone);
                // });
                // resolve(`${region}/ec2_DescribeAvailabilityZones`);
                let objGlobal = {
                    [region]: {
                        AvailabilityZones: arr
                    }
                };
                resolve(objGlobal);
            })
            .catch((e) => {
                reject(e);
            });
    });
}


export function ec2_DescribeRouteTables(region, credentials) {
    return new Promise(async (resolve, reject) => {

        let client = new EC2Client({
            region,
            credentials,
        });

        const pConfig = {
            client: client,
            pageSize: 100,
        };

        const cmdParams = {};

        const paginator = paginateDescribeRouteTables(pConfig, cmdParams);

        const arr = [];

        try {

            for await (const page of paginator) {
                arr.push(...page.RouteTables);
            }

        } catch (e) {
            reject(e);
        }


        // this.objGlobal[region].RouteTables = arr;
        // resolve(`${region}/ec2_DescribeRouteTables`);
        let objGlobal = {
            [region]: {
                RouteTables: arr
            }
        };
        resolve(objGlobal);
    });
}


export function ec2_DescribeVolumes(region, credentials) {
    return new Promise(async (resolve, reject) => {

        let client = new EC2Client({
            region,
            credentials,
        });

        const pConfig = {
            client: client,
            pageSize: 100,
        };

        const cmdParams = {};

        const paginator = paginateDescribeVolumes(pConfig, cmdParams);

        const arr = [];

        try {

            for await (const page of paginator) {
                arr.push(...page.Volumes);
            }
        } catch (e) {
            reject(e);
        }
        // this.objGlobal[region].Volumes = arr;
        // resolve(`${region}/ec2_DescribeVolumes`);
        let objGlobal = {
            [region]: {
                Volumes: arr
            }
        };
        resolve(objGlobal);
    });
}


export function ec2_DescribeVpcs(region, credentials) {
    return new Promise(async (resolve, reject) => {

        let client = new EC2Client({
            region,
            credentials,
        });

        const pConfig = {
            client: client,
            pageSize: 100,
        };

        const cmdParams = {};

        const paginator = paginateDescribeVpcs(pConfig, cmdParams);

        const arr = [];

        try {

            for await (const page of paginator) {
                arr.push(...page.Vpcs);
            }
        } catch (e) {
            reject(e);
        }
        // this.objGlobal[region].Vpcs = arr;
        // resolve(`${region}/ec2_DescribeVpcs`);
        let objGlobal = {
            [region]: {
                Vpcs: arr
            }
        };
        resolve(objGlobal);
    });
}


export function ec2_DescribeSubnets(region, credentials) {
    return new Promise(async (resolve, reject) => {

        let client = new EC2Client({
            region,
            credentials,
        });

        const pConfig = {
            client: client,
            pageSize: 100,
        };

        const cmdParams = {};

        const paginator = paginateDescribeSubnets(pConfig, cmdParams);

        const arr = [];

        try {

            for await (const page of paginator) {
                arr.push(...page.Subnets);
            }

        } catch (e) {
            reject(e);
        }


        // this.objGlobal[region].Subnets = arr;
        // resolve(`${region}/ec2_DescribeSubnets`);
        let objGlobal = {
            [region]: {
                Subnets: arr
            }
        };
        resolve(objGlobal);
    });
}


export function ec2_DescribeInstances(region, credentials) {
    return new Promise(async (resolve, reject) => {

        let client = new EC2Client({
            region,
            credentials,
        });

        const pConfig = {
            client: client,
            pageSize: 100,
        };

        const cmdParams = {};

        const paginator = paginateDescribeInstances(pConfig, cmdParams);

        const arr = [];

        try {

            for await (const page of paginator) {
                page.Reservations.forEach((reservation) => {
                    arr.push(...reservation.Instances)
                });
            }

        } catch (e) {
            reject(e);
        }


        // this.objGlobal[region].Instances = arr;
        // resolve(`${region}/ec2_DescribeInstances`);
        let objGlobal = {
            [region]: {
                Instances: arr
            }
        };
        resolve(objGlobal);
    });
}


export function ec2_DescribeSecurityGroups(region, credentials) {
    return new Promise(async (resolve, reject) => {

        let client = new EC2Client({
            region,
            credentials,
        });

        const pConfig = {
            client: client,
            pageSize: 100,
        };

        const cmdParams = {};

        const paginator = paginateDescribeSecurityGroups(pConfig, cmdParams);

        const arr = [];

        try {

            for await (const page of paginator) {
                arr.push(...page.SecurityGroups)
            }
        } catch (e) {
            reject(e);
        }
        // this.objGlobal[region].SecurityGroups = arr;
        // resolve(`${region}/ec2_DescribeSecurityGroups`);
        let objGlobal = {
            [region]: {
                SecurityGroups: arr
            }
        };
        resolve(objGlobal);
    });
}
