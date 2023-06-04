'use strict';

import {DescribeTableCommand, DynamoDBClient, paginateListTables} from "@aws-sdk/client-dynamodb";
import {AwsCredentialIdentity} from "@aws-sdk/types";

let serviceCallManifest;

interface _catcher {
    handle: Function,
}

export function getPerms() {
    return [
        {
            "service": "dynamodb",
            "call": "DescribeTable",
            "permission": "DescribeTable",
            "initiator": false
        },
        {
            "service": "dynamodb",
            "call": "ListTables",
            "permission": "ListTables",
            "initiator": true
        }
    ];
}


let dynamodb_DescribeTable = (TableName: string, client: DynamoDBClient, objAttribs: {}, catcher: _catcher) => {
    return new Promise((resolve, reject) => {

        client.send(new DescribeTableCommand(
            {
                TableName
            }
        ))
            .then((data) => {
                resolve(data.Table);
            })
            .catch((e) => {
                reject(e);
            });
    });
};


export let dynamodb_ListTables = (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => {
    return new Promise(async (resolve, reject) => {

        serviceCallManifest = svcCallsAll;
        const client = new DynamoDBClient(
            {
                region,
                credentials
            }
        );

        const pConfig = {
            client,
            pageSize: 100,
        };

        const cmdParams = {};

        const paginator = paginateListTables(pConfig, cmdParams);

        const arr = [];
        const _arrC = [];

        try {

            for await (const page of paginator) {
                if (page.TableNames) arr.push(...page.TableNames);
                _arrC.push(catcher.handle(page.TableNames, objAttribs));
            }
        } catch (e) {
            reject(e);
        }

        const Tables = [];

        for (let i = 0; i < arr.length; i++) {
            let TableName = arr[i];

            if (serviceCallManifest.indexOf('DescribeTable') > -1) {

                let Table = await dynamodb_DescribeTable(TableName, client, objAttribs, catcher);
                Tables.push(Table);
            } else {
                Tables.push(
                    {
                        TableName
                    }
                );
            }
        }

        let obj = {
            [region]: {
                Tables,
            }
        };

        resolve(obj);

    });

};
