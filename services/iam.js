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


let iam_GetUserPolicy = (user, policies, client, oRC, MAX_WAIT) => {
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
                    // oRC.incr();
                    // if (this.objGlobal[region].PolicyDocuments === undefined) {
                    //     this.objGlobal[region].PolicyDocuments = [];
                    // }

                    // this.objGlobal[region].PolicyDocuments.push(
                    //     {
                    //         UserId: user.UserId,
                    //         Document: data.PolicyDocument,
                    //     }
                    // );
                    // this.policyDocuments.push(data.PolicyDocument);
                    // resolve(`${region}/iam_GetUserPolicy`);
                    resolve({
                        UserId: user.UserId,
                        Document: data.PolicyDocument,
                    });

                })
                .catch((e) => {
                    // oRC.incr();
                    reject(e);
                }));

        });

        Promise.all(arrPromises)
            .then((aP) => {
                resolve(aP);
            });
    });
};

let iam_ListUserPolicies = (users, client, oRC, MAX_WAIT) => {
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
                    // oRC.incr();
                    arr.push(...page.PolicyNames);
                }
            } catch (e) {
                // oRC.incr();
                reject(e);
            }
            // this.arrUserPolicies = arr;

            let arrPromises = [];
            if (arr.length > 0) {
                arrPromises.push(iam_GetUserPolicy(user, arr, client, oRC));
            }

            Promise.all(arrPromises)
                .then((p) => {
                    // resolve(`${region}/iam_ListUserPolicies`);
                    resolve();
                });

        });

    });
};

export let iam_ListUsers = (region, credentials, oRC, MAX_WAIT) => {
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
                // oRC.incr();
                arr.push(...page.Users);
            }
        } catch (e) {
            // oRC.incr();
            reject(e);
        }
        // this.objGlobal[region].Users = arr;
        let objGlobal = {
            [region]: {
                Users: arr
            }
        };

        iam_ListUserPolicies(arr, client, oRC)
            .then((obj) => {
                // resolve(`${region}/iam_ListUsers`);
                resolve(objGlobal);
            });
    });
};


let iam_GetPolicyVersion = (policy, client, oRC, MAX_WAIT) => {
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
                // oRC.incr();
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
                // oRC.incr();
                reject(e);
            });

    });
};


let iam_GetPolicy = (policy, client, oRC, MAX_WAIT) => {
    return new Promise((resolve, reject) => {

        const PolicyArn = policy.Arn;
        const oParams = {
            PolicyArn,
        };

        client.send(new GetPolicyCommand(oParams))
            .then((data) => {

                // oRC.incr();
                iam_GetPolicyVersion(data.Policy, client, oRC)
                    .then((p) => {
                        resolve(p);
                    });

            })
            .catch((e) => {
                // oRC.incr();
                reject(e);
            });

    });

};


export let iam_ListPolicies = (region, credentials, oRC, MAX_WAIT) => {
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
                // oRC.incr();
                arr.push(...page.Policies);
            }
        } catch (e) {
            // oRC.incr();
            reject(e);
        }


        const arrPromises = [];


        arr.forEach((policy) => {
            arrPromises.push(iam_GetPolicy(policy, client, oRC));
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


export let iam_ListRoles = (region, credentials, oRC, MAX_WAIT) => {
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
                // oRC.incr();
                arr.push(...page.Roles);
            }
        } catch (e) {
            // oRC.incr();
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
