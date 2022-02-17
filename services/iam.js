'use strict';

import {
    IAMClient,
    paginateListPolicies,
    paginateListUsers,
    paginateListRoles,
    paginateListUserPolicies,
    GetUserPolicyCommand,
    GetPolicyCommand,
    GetPolicyVersionCommand,
} from '@aws-sdk/client-iam';


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
};


let iam_GetUserPolicy = (user, policies, client) => {
    return new Promise((resolve, reject) => {

        let arrPromises = [];
        let UserName = user.UserName;

        policies.forEach((PolicyName) => {

            const oParams = {
                PolicyName,
                UserName,
            };

            arrPromises.push(client.send(new GetUserPolicyCommand(oParams))
                .then((data) => {
                    resolve({
                        UserId: user.UserId,
                        Document: data.PolicyDocument,
                    });

                })
                .catch((e) => {
                    reject(e);
                }));

        });

        Promise.all(arrPromises)
            .then((aP) => {
                resolve(aP);
            });
    });
};

let iam_ListUserPolicies = (users, client) => {
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
                    arr.push(...page.PolicyNames);
                }
            } catch (e) {
                reject(e);
            }
            // this.arrUserPolicies = arr;

            let arrPromises = [];
            if (arr.length > 0) {
                arrPromises.push(iam_GetUserPolicy(user, arr, client));
            }

            Promise.all(arrPromises)
                .then((p) => {
                    // resolve(`${region}/iam_ListUserPolicies`);
                    resolve();
                });

        });

    });
};

export let iam_ListUsers = (region, credentials, svcCallsAll) => {
    return new Promise(async (resolve, reject) => {

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

        try {

            for await (const page of paginator) {
                arr.push(...page.Users);
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

        iam_ListUserPolicies(arr, client)
            .then((obj) => {
                // resolve(`${region}/iam_ListUsers`);
                resolve(objGlobal);
            });
    });
};


let iam_GetPolicyVersion = (policy, client) => {
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


let iam_GetPolicy = (policy, client) => {
    return new Promise((resolve, reject) => {

        const PolicyArn = policy.Arn;
        const oParams = {
            PolicyArn,
        };

        client.send(new GetPolicyCommand(oParams))
            .then((data) => {

                iam_GetPolicyVersion(data.Policy, client)
                    .then((p) => {
                        resolve(p);
                    });

            })
            .catch((e) => {
                reject(e);
            });

    });

};


export let iam_ListPolicies = (region, credentials, svcCallsAll) => {
    return new Promise(async (resolve, reject) => {

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

        try {

            for await (const page of paginator) {
                arr.push(...page.Policies);
            }
        } catch (e) {
            reject(e);
        }


        const arrPromises = [];


        arr.forEach((policy) => {
            arrPromises.push(iam_GetPolicy(policy, client));
        });

        Promise.all(arrPromises)
            .then((p) => {
                let obj = {
                    [region]: {
                        Policies: []
                    }
                };
                for (let i = 0; i < p.length; i++) {
                    obj[region].Policies.push(p[i]);
                }
                resolve(obj);
            });
    });
};


export let iam_ListRoles = (region, credentials, svcCallsAll) => {
    return new Promise(async (resolve, reject) => {

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

        try {
            for await (const page of paginator) {
                arr.push(...page.Roles);
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
