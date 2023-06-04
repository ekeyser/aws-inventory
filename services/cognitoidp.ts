'use strict';

import {
    CognitoIdentityProviderClient,
    paginateListUserPools,
    paginateListUsers,
    paginateListGroups,
    ListGroupsCommandOutput, GroupType, UserType, UserPoolType, ListUserPoolsCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import {AwsCredentialIdentity} from "@aws-sdk/types";


interface _catcher {
    handle: Function,
}

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


let cognitoidp_ListGroups = (UserPoolId: string, client: CognitoIdentityProviderClient, objAttribs: {}, catcher: _catcher): Promise<{
    Groups: GroupType[]
}> => {
    return new Promise(async (resolve, reject) => {

        const pConfig = {
            client,
            pageSize: 60,
        };

        const cmdParams = {
            UserPoolId,
        };

        const paginator = paginateListGroups(pConfig, cmdParams);

        const arr: GroupType[] = [];

        try {

            for await (const page of paginator) {
                if (page.Groups) arr.push(...page.Groups);
            }
        } catch (e) {

            reject(e);
        }


        let obj: {
            Groups: GroupType[],
        } = {
            Groups: [],
        };

        obj.Groups.push(...arr);

        resolve(obj);

    });
};


let cognitoidp_ListUsers = (UserPoolId: string, client: CognitoIdentityProviderClient, objAttribs: {}, catcher: _catcher): Promise<{
    Users: UserType[]
}> => {
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
                if (page.Users) arr.push(...page.Users);
            }
        } catch (e) {

            reject(e);
        }

        let obj: {
            Users: UserType[],
        } = {
            Users: [],
        };

        obj.Users.push(...arr);

        resolve(obj);


    });
};


export let cognitoidp_ListUserPools = (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => {
    return new Promise(async (resolve, reject) => {

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

        const _input: ListUserPoolsCommandInput = {
            MaxResults: 60,
        };
        const paginator = paginateListUserPools(pConfig, _input);

        const arr: UserPoolType[] = [];
        const _arrC = [];

        try {
            for await (const page of paginator) {
                if (page.UserPools) arr.push(...page.UserPools);
                _arrC.push(catcher.handle(page.UserPools, objAttribs));
            }
        } catch (e) {
            reject(e);
        }


        let arrPromisesG: Promise<{
            Groups: GroupType[]
        }>[] = [];
        let arrPromisesU: Promise<{
            Users: UserType[]
        }>[] = [];


        arr.forEach((objUserPool, i) => {

            if (svcCallsAll.indexOf('ListUsers') > -1) {

                if (objUserPool.Id) arrPromisesU.push(cognitoidp_ListUsers(objUserPool.Id, client, objAttribs, catcher));
            }

            if (svcCallsAll.indexOf('ListGroups') > -1) {

                if (objUserPool.Id) arrPromisesG.push(cognitoidp_ListGroups(objUserPool.Id, client, objAttribs, catcher));
            }

        });


        Promise.all(arrPromisesU)
            .then((arrResourcesUsers) => {

                Promise.all(arrPromisesG)
                    .then((arrResourcesGroups) => {

                        let objReturn = {
                            [region]: {
                                UserPools: arr,
                                Users: <UserType[]>[],
                                Groups: <GroupType[]>[],
                            }
                        };

                        arrResourcesUsers.forEach((objResource) => {

                            if (objResource.Users) objReturn[region].Users.push(...objResource.Users);
                        });
                        arrResourcesGroups.forEach((objResource) => {

                            objReturn[region].Groups.push(...objResource.Groups);
                        });

                        resolve(objReturn);

                    });

            });

    });
};
