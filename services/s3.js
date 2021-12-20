'use strict';

import {ListBucketsCommand, S3Client} from "@aws-sdk/client-s3";

export let s3_ListBuckets = (region, credentials) => {
    return new Promise((resolve, reject) => {

        const client = new S3Client(
            {
                region,
                credentials
            }
        );

        let obj = {
            [region]: {
                Buckets: []
            }
        };
        client.send(new ListBucketsCommand({}))
            .then((data) => {
                data.Buckets.forEach((bucket) => {
                    obj[region].Buckets.push(bucket);
                });
                resolve(obj);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
