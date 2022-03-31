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
import sha256 from "sha256";

let MAX_WAIT = 800;
let WAIT = 800;
let queue = {};
let objGlobalReturn = {
  RestApis: [],
  RestApiResources: [],
  RestApiMethods: [],
};
let serviceCallManifest;

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


let randString = (length) => {
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
  let hash = sha256(randString(64));
  return hash;
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
                .catch((e) => {
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
        resolve();
      });

  });
};


export function ec2_DescribeAvailabilityZones(region, credentials, svcCallsAll) {
  return new Promise((resolve, reject) => {

    serviceCallManifest = svcCallsAll;
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


export function ec2_DescribeRouteTables(region, credentials, svcCallsAll) {
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


export function ec2_DescribeVolumes(region, credentials, svcCallsAll) {
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


export function ec2_DescribeVpcs(region, credentials, svcCallsAll) {
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


export function ec2_DescribeSubnets(region, credentials, svcCallsAll) {
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


export function ec2_DescribeInstances(region, credentials, svcCallsAll) {
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


export function ec2_DescribeSecurityGroups(region, credentials, svcCallsAll) {
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
