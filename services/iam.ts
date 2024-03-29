'use strict';

import {
    IAMClient,
    paginateListPolicies,
    paginateListUsers,
    paginateListRoles,
    paginateListUserPolicies,
    GetUserPolicyCommand,
    GetPolicyCommand,
    GetPolicyVersionCommand, User, Policy,
    PolicyVersion, GetUserPolicyCommandOutput,
} from '@aws-sdk/client-iam';
import {AwsCredentialIdentity} from "@aws-sdk/types";

let serviceCallManifest;

interface _catcher {
    handle: Function,
}

export function getPerms() {
    return [
        {
            "service": "iam",
            "call": "GetUserPolicy",
            "permission": "GetUserPolicy",
            "initiator": false
        },
        {
            "service": "iam",
            "call": "ListUserPolicies",
            "permission": "ListUserPolicies",
            "initiator": false
        },
        {
            "service": "iam",
            "call": "ListUsers",
            "permission": "ListUsers",
            "initiator": true
        },
        {
            "service": "iam",
            "call": "GetPolicyVersion",
            "permission": "GetPolicyVersion",
            "initiator": false
        },
        {
            "service": "iam",
            "call": "GetPolicy",
            "permission": "GetPolicy",
            "initiator": false
        },
        {
            "service": "iam",
            "call": "ListPolicies",
            "permission": "ListPolicies",
            "initiator": true
        },
        {
            "service": "iam",
            "call": "ListRoles",
            "permission": "ListRoles",
            "initiator": true
        }
    ];
}


let iam_GetUserPolicy = (user: User, policies: string[], client: IAMClient, objAttribs: {}, catcher: _catcher) => {
    return new Promise((resolve, reject) => {

        let arrPromises: Promise<GetUserPolicyCommandOutput>[] = [];
        // let arrPromises: Promise<{
        //     UserId: string,
        //     Document: string,
        // }> | Promise<void>[] = [];
        let UserName = user.UserName;

        policies.forEach((PolicyName) => {

            const oParams = {
                PolicyName,
                UserName,
            };

            arrPromises.push(client.send(new GetUserPolicyCommand(oParams)))
            // .then((data) => {
            //     resolve({
            //         UserId: user.UserId,
            //         Document: data.PolicyDocument,
            //     });
            //
            // })
            // .catch((e) => {
            //     reject(e);
            // }));

        });

        Promise.all(arrPromises)
            .then((aPs) => {
                resolve(aPs);
            });
    });
};

let iam_ListUserPolicies = (users: User[], client: IAMClient, objAttribs: {}, catcher: _catcher) => {
    return new Promise((resolve, reject) => {

        const pConfig = {
            client: client,
            pageSize: 100,
        };

        users.forEach(async (user) => {

            const UserName = user.UserName;
            const cmdParams = {
                UserName,
            };

            const paginator = paginateListUserPolicies(pConfig, cmdParams);

            const arr = [];

            try {

                for await (const page of paginator) {
                    if (page.PolicyNames) arr.push(...page.PolicyNames);
                }
            } catch (e) {
                reject(e);
            }
            // this.arrUserPolicies = arr;

            let arrPromises = [];
            if (arr.length > 0) {
                arrPromises.push(iam_GetUserPolicy(user, arr, client, objAttribs, catcher));
            }

            Promise.all(arrPromises)
                .then((p) => {
                    // resolve(`${region}/iam_ListUserPolicies`);
                    resolve(null);
                });

        });

    });
};

export let iam_ListUsers = (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => {
    return new Promise(async (resolve, reject) => {

        serviceCallManifest = svcCallsAll;
        let client = new IAMClient({
            region,
            credentials,
        });

        const pConfig = {
            client: client,
            pageSize: 100,
        };

        const cmdParams = {};

        const paginator = paginateListUsers(pConfig, cmdParams);

        const arr = [];
        const _arrC = [];

        try {

            for await (const page of paginator) {
                if (page.Users) arr.push(...page.Users);
                _arrC.push(catcher.handle(page.Users, objAttribs));
            }
        } catch (e) {
            reject(e);
        }
        // this.objGlobal[region].Users = arr;
        let objGlobal = {
            [region]: {
                Users: arr
            }
        };

        iam_ListUserPolicies(arr, client, objAttribs, catcher)
            .then((obj) => {
                // resolve(`${region}/iam_ListUsers`);
                resolve(objGlobal);
            });
    });
};


let iam_GetPolicyVersion = (policy: Policy, client: IAMClient, objAttribs: {}, catcher: _catcher): Promise<{
    PolicyId: string,
    PolicyVersion: PolicyVersion,
}> => {
    return new Promise((resolve, reject) => {

        const PolicyArn = policy.Arn;
        const VersionId = policy.DefaultVersionId;
        const oParams = {
            PolicyArn,
            VersionId,
        };

        // let arr = [];
        client.send(new GetPolicyVersionCommand(oParams))
            .then((data) => {
                // if (this.objGlobal[region].PolicyDocuments === undefined) {
                //     this.objGlobal[region].PolicyDocuments = [];
                // }


                // this.objGlobal[region].PolicyDocuments.push(
                //     {
                //         PolicyId: policy.PolicyId,
                //         PolicyVersion: data.PolicyVersion,
                //     }
                // );
                // arr.push({
                //     PolicyId: policy.PolicyId,
                //     PolicyVersion: data.PolicyVersion,
                // });

                // let objGlobal = {
                //     [region]: {
                //         PolicyDocuments:
                //     }
                // }
                if (policy.PolicyId && data.PolicyVersion)
                    resolve({
                        PolicyId: policy.PolicyId,
                        PolicyVersion: data.PolicyVersion,
                    });


            })
            .catch((e) => {
                reject(e);
            });

    });
};


let iam_GetPolicy = (policy: Policy, client: IAMClient, objAttribs: {}, catcher: _catcher): Promise<{
    PolicyId: string,
    PolicyVersion: PolicyVersion,
}> => {
    return new Promise((resolve, reject) => {

        const PolicyArn = policy.Arn;
        const oParams = {
            PolicyArn,
        };

        client.send(new GetPolicyCommand(oParams))
            .then((data) => {

                if (data.Policy) {

                    iam_GetPolicyVersion(data.Policy, client, objAttribs, catcher)
                        .then((p) => {
                            resolve(p);
                        });
                }

            })
            .catch((e) => {
                reject(e);
            });

    });

};


export let iam_ListPolicies = (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => {
    return new Promise(async (resolve, reject) => {

        serviceCallManifest = svcCallsAll;
        let client = new IAMClient({
            region,
            credentials,
        });

        const pConfig = {
            client: client,
            pageSize: 200,
        };

        const cmdParams = {
            Scope: 'Local',
        };

        const paginator = paginateListPolicies(pConfig, cmdParams);

        const arr = [];
        const _arrC = [];

        try {

            for await (const page of paginator) {
                if (page.Policies) arr.push(...page.Policies);
                _arrC.push(catcher.handle(page.Policies, objAttribs));
            }
        } catch (e) {
            reject(e);
        }


        const arrPromises: Promise<{
            PolicyId: string,
            PolicyVersion: PolicyVersion,
        }>[] = [];


        arr.forEach((policy) => {
            arrPromises.push(iam_GetPolicy(policy, client, objAttribs, catcher));
        });

        Promise.all(arrPromises)
            .then((p) => {
                let obj: {
                    [region: string]: {
                        Policies: {
                            PolicyId: string,
                            PolicyVersion: PolicyVersion,
                        }[],
                    },
                } = {
                    [region]: {
                        Policies: []
                    }
                };
                // obj[region].Policies.push(p);
                obj[region].Policies = p;
                // for (let i = 0; i < p.length; i++) {
                //     obj[region].Policies.push(p[i]);
                // obj[region].Policies.push(p);
                // }
                resolve(obj);
            });
    });
};


export let iam_ListRoles = (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => {
    return new Promise(async (resolve, reject) => {

        serviceCallManifest = svcCallsAll;
        let client = new IAMClient({
            region,
            credentials,
        });

        const pConfig = {
            client: client,
            pageSize: 100,
        };

        const cmdParams = {};

        const paginator = paginateListRoles(pConfig, cmdParams);

        const arr = [];
        const _arrC = [];

        try {
            for await (const page of paginator) {
                if (page.Roles) arr.push(...page.Roles);
                _arrC.push(catcher.handle(page.Roles, objAttribs));
            }
        } catch (e) {
            reject(e);
        }

        let obj = {
            [region]: {
                Roles: arr
            }
        };
        resolve(obj);
    });
};
