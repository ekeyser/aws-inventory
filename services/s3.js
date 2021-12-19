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

        client.send(new ListBucketsCommand({}))
            .then((data) => {
                data.Buckets.forEach((bucket) => {
                    if (this.objGlobal[region].Buckets === undefined) {
                        this.objGlobal[region].Buckets = [];
                    }

                    this.objGlobal[region].Buckets.push(bucket);
                });
                resolve(`${region}/s3_ListAllMyBuckets`);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
