'use strict';

import {
    EC2Client,
    DescribeAvailabilityZonesCommand,
    paginateDescribeSecurityGroups,
    paginateDescribeVolumes,
    paginateDescribeRouteTables,
    paginateDescribeSubnets,
    paginateDescribeVpcs,
    paginateDescribeInstances, AvailabilityZone, Instance,
} from '@aws-sdk/client-ec2';
import sha256 from "sha256";
import {AwsCredentialIdentity} from "@aws-sdk/types";

let MAX_WAIT = 800;
let WAIT = 800;
let queue: {
    [hash: string]: {
        inFlight: boolean,
        fn: Function,
        params: [],
    },
} = {};
let serviceCallManifest;

interface _catcher {
    handle: Function,
}

export let getPerms = () => {
    return [
        {
            "service": "ec2",
            "call": "DescribeVpcs",
            "permission": "DescribeVpcs",
            "initiator": true
        },
        {
            "service": "ec2",
            "call": "DescribeAvailabilityZones",
            "permission": "DescribeAvailabilityZones",
            "initiator": true
        },
        {
            "service": "ec2",
            "call": "DescribeSecurityGroups",
            "permission": "DescribeSecurityGroups",
            "initiator": true
        },
        {
            "service": "ec2",
            "call": "DescribeVolumes",
            "permission": "DescribeVolumes",
            "initiator": true
        },
        {
            "service": "ec2",
            "call": "DescribeRouteTables",
            "permission": "DescribeRouteTables",
            "initiator": true
        },
        {
            "service": "ec2",
            "call": "DescribeSubnets",
            "permission": "DescribeSubnets",
            "initiator": true
        },
        {
            "service": "ec2",
            "call": "DescribeInstances",
            "permission": "DescribeInstances",
            "initiator": true
        }
    ];
};


let randString = (length: number) => {
    let strRandom = '';
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < length; i++) {
        let rPos = Math.floor(Math.random() * chars.length);
        let char = chars.charAt(rPos);
        strRandom += char;
    }
    return strRandom;
};


let rStr = () => {
    return sha256(randString(64));
};


let qR = () => {
    return new Promise(async (resolve) => {

        let promises = [];

        while (Object.keys(queue).length > 0) {

            let aHashes = Object.keys(queue);
            for (let i = 0; i < aHashes.length; i++) {

                let hash = aHashes[i];
                if (queue[hash] !== undefined) {

                    if (queue[hash].inFlight === false) {

                        queue[hash].inFlight = true;
                        await new Promise(resolve => setTimeout(resolve, WAIT));
                        promises.push(
                            queue[hash].fn(...queue[hash].params)
                                .then(() => {
                                    WAIT = Math.ceil(WAIT * 0.95);
                                    delete queue[hash];
                                })
                                .catch((e: Error) => {
                                    queue[hash].inFlight = false;
                                    if (e.name === 'TooManyRequestsException') {
                                        WAIT = MAX_WAIT;
                                    } else {
                                        //   delete queue[hash];
                                    }
                                })
                        );

                    }

                }

            }
            await new Promise(resolve => setTimeout(resolve, 100));

        }

        Promise.all(promises)
            .then(() => {
                resolve(null);
            });

    });
};


export function ec2_DescribeAvailabilityZones(region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) {
    return new Promise((resolve, reject) => {

        serviceCallManifest = svcCallsAll;
        let client = new EC2Client({
            region,
            credentials,
        });

        let arr: AvailabilityZone[] = [];
        const arr2 = [];
        client.send(new DescribeAvailabilityZonesCommand({}))
            .then((data) => {
                if (data.AvailabilityZones) {

                    for (let i = 0; i < data.AvailabilityZones.length; i++) {
                        let AvailabilityZone = data.AvailabilityZones[i];
                        arr.push(AvailabilityZone);
                        arr2.push(catcher.handle([AvailabilityZone], objAttribs))
                    }
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


export function ec2_DescribeRouteTables(region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) {
    return new Promise(async (resolve, reject) => {

        serviceCallManifest = svcCallsAll;
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
        const arr2 = [];

        try {

            for await (const page of paginator) {
                if (page.RouteTables) arr.push(...page.RouteTables);
                arr2.push(catcher.handle(page.RouteTables, objAttribs))
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


export function ec2_DescribeVolumes(region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) {
    return new Promise(async (resolve, reject) => {

        serviceCallManifest = svcCallsAll;
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
        const arr2 = [];

        try {

            for await (const page of paginator) {
                if (page.Volumes) arr.push(...page.Volumes);
                arr2.push(catcher.handle(page.Volumes, objAttribs))
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


export function ec2_DescribeVpcs(region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) {
    return new Promise(async (resolve, reject) => {

        serviceCallManifest = svcCallsAll;
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
        const arr2 = [];

        try {

            for await (const page of paginator) {
                if (page.Vpcs) arr.push(...page.Vpcs);
                arr2.push(catcher.handle(page.Vpcs, objAttribs))
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


export function ec2_DescribeSubnets(region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) {
    return new Promise(async (resolve, reject) => {

        serviceCallManifest = svcCallsAll;
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
        const arr2 = [];

        try {

            for await (const page of paginator) {
                if (page.Subnets) arr.push(...page.Subnets);
                arr2.push(catcher.handle(page.Subnets, objAttribs))
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


export function ec2_DescribeInstances(region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) {
    return new Promise(async (resolve, reject) => {

        serviceCallManifest = svcCallsAll;
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

        const arr: Instance[] = [];
        const arr2 = [];

        try {

            for await (const page of paginator) {
                if (page.Reservations) {

                    page.Reservations.forEach((reservation) => {
                        if (reservation.Instances) arr.push(...reservation.Instances)
                        arr2.push(catcher.handle(reservation.Instances, objAttribs))
                    });
                }
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


export function ec2_DescribeSecurityGroups(region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) {
    return new Promise(async (resolve, reject) => {

        serviceCallManifest = svcCallsAll;
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
        const arr2 = [];

        try {

            for await (const page of paginator) {
                if (page.SecurityGroups) arr.push(...page.SecurityGroups)
                arr2.push(catcher.handle(page.SecurityGroups, objAttribs))
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
