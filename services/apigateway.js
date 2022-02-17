'use strict';

import {
  APIGatewayClient,
  GetMethodCommand,
  paginateGetResources,
  paginateGetRestApis,
} from '@aws-sdk/client-api-gateway';
import sha256 from 'sha256';

let MAX_WAIT = 800;
let WAIT = 800;
let queue = {};
let objGlobalReturn = {
  RestApis: [],
  RestApiResources: [],
  RestApiMethods: [],
};


export function getPerms() {
  return [
    {
      "service": "apigateway",
      "call": "GetRestApis",
      "permission": "GET",
      "initiator": true
    },
    {
      "service": "apigateway",
      "call": "GetResources",
      "permission": "GET",
      "initiator": false
    },
    {
      "service": "apigateway",
      "call": "GetMethod",
      "permission": "GET",
      "initiator": false
    }
  ];
}


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
                  if (e.name === 'TooManyRequestsException') {
                    WAIT = MAX_WAIT;
                    queue[hash].inFlight = false;
                  } else {
                    queue[hash].inFlight = false;
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


let apigateway_GetMethod = (httpMethod, resourceId, restApiId, client) => {
  return new Promise((resolve, reject) => {

    client.send(new GetMethodCommand(
      {
        httpMethod,
        resourceId,
        restApiId,
      }
    ))
      .then((data) => {
        data.restApiId = restApiId;
        data.resourceId = resourceId;
        objGlobalReturn.RestApiMethods.push(data);
        resolve();
      })
      .catch((e) => {

        reject(e);

      });

  });
};


let apigateway_GetResources = (restApiId, client) => {
  return new Promise(async (resolve, reject) => {

    const pConfig = {
      client,
      pageSize: 150,
    };

    const cmdParams = {
      restApiId,
    };

    const paginator = paginateGetResources(pConfig, cmdParams);

    const arrItems = [];

    try {
      for await (const page of paginator) {
        arrItems.push(...page.items);
      }
    } catch (e) {
      reject(e);
    }


    Promise.all(arrItems)
      .then((arrResources) => {
        let arrPromisesM = [];

        let obj = {
          RestApiResources: [],
          RestApiMethods: [],
        };


        arrResources.forEach((oResource, i) => {

          oResource.RestApiId = restApiId;
          objGlobalReturn.RestApiResources.push(oResource);

          if (oResource.resourceMethods !== undefined) {
            Object.keys(oResource.resourceMethods).forEach((METHOD) => {
              const objFn = {
                fn: apigateway_GetMethod,
                inFlight: false,
                params: [
                  METHOD,
                  oResource.id,
                  restApiId,
                  client,
                ],
              };
              queue[rStr()] = objFn;
            });
          }

        });

        resolve();

      });

  });
};


let apigateway_GetRestApis = (region, credentials, svcCallsAll) => {
  return new Promise(async (resolve, reject) => {

    const client = new APIGatewayClient(
      {
        region,
        credentials,
      }
    );

    const pConfig = {
      client,
      pageSize: 200,
    };

    const cmdParams = {};

    const paginator = paginateGetRestApis(pConfig, cmdParams);

    const arrItems = [];

    try {
      for await (const page of paginator) {
        arrItems.push(...page.items)
      }
    } catch (e) {
      reject(e);
    }


    objGlobalReturn.RestApis = arrItems;
    let arrPromisesR = [];


    arrItems.forEach((objRestApi, i) => {
      let objFn = {
        fn: apigateway_GetResources,
        inFlight: false,
        params: [
          objRestApi.id,
          client,
        ],
      };

      queue[rStr()] = objFn;

    });

    resolve();

  });

};

export let apigateway_Begin = (region, credentials, svcCallsAll) => {
  return new Promise((resolve) => {

    let objFn = {
      fn: apigateway_GetRestApis,
      inFlight: false,
      params: [
        region,
        credentials,
        svcCallsAll,
      ],
    };

    queue[rStr()] = objFn;

    qR()
      .then(() => {
        let objReturn = {
          [region]: objGlobalReturn
        };
        resolve(objReturn);
      });

  });
};

