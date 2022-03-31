'use strict';

import {
  CognitoIdentityProviderClient,
  paginateListUserPools,
  paginateListUsers,
  paginateListGroups,
} from '@aws-sdk/client-cognito-identity-provider';

let serviceCallManifest;

export function getPerms() {
  return [
    {
      "service": "cognito-idp",
      "call": "ListUserPools",
      "permission": "ListUserPools",
      "initiator": true
    },
    {
      "service": "cognito-idp",
      "call": "ListUsers",
      "permission": "ListUsers",
      "initiator": false
    },
    {
      "service": "cognito-idp",
      "call": "ListGroups",
      "permission": "ListGroups",
      "initiator": false
    },
  ];
}


let cognitoidp_ListGroups = (UserPoolId, client) => {
  return new Promise(async (resolve, reject) => {

    const pConfig = {
      client,
      pageSize: 60,
    };

    const cmdParams = {
      UserPoolId,
    };

    const paginator = paginateListGroups(pConfig, cmdParams);

    const arr = [];

    try {

      for await (const page of paginator) {
        arr.push(...page.Groups);
      }
    } catch (e) {

      reject(e);
    }


    let obj = {
      Groups: [],
    };

    obj.Groups.push(...arr);

    resolve(obj);

  });
};


let cognitoidp_ListUsers = (UserPoolId, client) => {
  return new Promise(async (resolve, reject) => {

    const pConfig = {
      client,
      pageSize: 60,
    };

    const cmdParams = {
      UserPoolId,
    };

    const paginator = paginateListUsers(pConfig, cmdParams);

    const arr = [];

    try {

      for await (const page of paginator) {
        arr.push(...page.Users);
      }
    } catch (e) {

      reject(e);
    }

    let obj = {
      Users: [],
    };

    obj.Users.push(...arr);

    resolve(obj);


  });
};


export let cognitoidp_ListUserPools = (region, credentials, svcCallsAll) => {
  return new Promise(async (resolve, reject) => {

    serviceCallManifest = svcCallsAll;
    const client = new CognitoIdentityProviderClient(
      {
        region,
        credentials,
      }
    );

    const pConfig = {
      client,
      pageSize: 60,
    };

    const paginator = paginateListUserPools(pConfig, {});

    const arr = [];

    try {
      for await (const page of paginator) {
        arr.push(...page.UserPools)
      }
    } catch (e) {
      reject(e);
    }


    let arrPromisesG = [];
    let arrPromisesU = [];


    arr.forEach((objUserPool, i) => {

      if (serviceCallManifest.indexOf('ListUsers') > -1) {

        arrPromisesU.push(cognitoidp_ListUsers(objUserPool.Id, client));
      }

      if (serviceCallManifest.indexOf('ListGroups') > -1) {

        arrPromisesG.push(cognitoidp_ListGroups(objUserPool.Id, client));
      }

    });


    Promise.all(arrPromisesU)
      .then((arrResourcesUsers) => {

        Promise.all(arrPromisesG)
          .then((arrResourcesGroups) => {

            let objReturn = {
              [region]: {
                UserPools: arr,
                Users: [],
                Groups: [],
              }
            };

            arrResourcesUsers.forEach((objResource) => {

              objReturn[region].Users.push(...objResource.Users);
            });
            arrResourcesGroups.forEach((objResource) => {

              objReturn[region].Groups.push(...objResource.Groups);
            });

            resolve(objReturn);

          });

      });

  });
};
