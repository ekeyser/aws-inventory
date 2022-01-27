'use strict';

import {DescribeTableCommand, DynamoDBClient, paginateListTables} from "@aws-sdk/client-dynamodb";


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
};


let dynamodb_DescribeTable = (TableName, client, oRC) => {
    return new Promise((resolve, reject) => {

        client.send(new DescribeTableCommand(
            {
                TableName
            }
        ))
            .then((data) => {
                // oRC.incr();
                resolve(data.Table);
            })
            .catch((e) => {
                // oRC.incr();
                reject(e);
            });
    });
};


export let dynamodb_ListTables = (region, credentials, oRC) => {
    return new Promise(async (resolve, reject) => {

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

        try {

            for await (const page of paginator) {
                // oRC.incr();
                arr.push(...page.TableNames);
            }
        } catch (e) {
            // oRC.incr();
            reject(e);
        }

        const Tables = [];

        for (let i = 0; i < arr.length; i++) {
            let TableName = arr[i];
            let Table = await dynamodb_DescribeTable(TableName, client, oRC);
            Tables.push(Table);
        }

        // this.objGlobal[region].Tables = Tables;
        // resolve(`${region}/dynamodb_ListTables`);
        let obj = {
            [region]: {
                Tables: Tables
            }
        };
        resolve(obj);
    });
};
