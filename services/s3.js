'use strict';

import axios from 'axios';
import sha256 from 'sha256';
import crypto from 'crypto-js';

let serviceCallManifest;

export function getPerms() {
    return [
        {
            "service": "s3",
            "call": "ListBuckets",
            "permission": "ListAllMyBuckets",
            "initiator": true
        }
    ];
}


export let s3_ListBuckets = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {

        serviceCallManifest = svcCallsAll;
        const AWS_SIG_VER = 'aws4_request';
        const AWS_ACCESS_KEY_ID = credentials.accessKeyId;
        const AWS_SECRET_ACCESS_KEY = credentials.secretAccessKey;

        const AWSS3HOSTNAME = 's3.amazonaws.com';


        let getSignatureKey = (key, dateStamp, regionName, serviceName, signatureVer) => {
            const kDate = crypto.HmacSHA256(dateStamp, "AWS4" + key);
            const kRegion = crypto.HmacSHA256(regionName, kDate);
            const kService = crypto.HmacSHA256(`${serviceName}`, kRegion);
            return crypto.HmacSHA256(signatureVer, kService);
        };


        let getS3HashedCanonicalRequest = (httpMethod, canonicalUri, signedHeaders, queryString, canonicalHeaders, hashed_payload) => {

            // let timestamp = `${TS}\n`;
            let method = `${httpMethod}\n`;
            let uri = `${canonicalUri}\n`;
            let query_string = `${queryString}\n`;


            let canonical_headers = '';
            canonicalHeaders.forEach((header, i) => {
                canonical_headers += `${header}\n`;
            });
            canonical_headers += `\n`;


            let signed_headers = '';
            signedHeaders.forEach((header_name, i) => {
                if (i === 0) {
                    signed_headers = header_name;
                } else {

                    signed_headers += `;${header_name}`;
                }
            });
            // signed_headers += `\n`;

            // let str = `${method}${uri}${query_string}${canonical_headers}${host}${date_header}${signed_headers}${hashed_payload}`;
            let str = `${method}${uri}${query_string}${canonical_headers}${signed_headers}\n${hashed_payload}`;

            let hash = sha256(str);
            return [hash, signed_headers];

        };


        const bucket = ``;
        let strUri = '';
        let canonicalUri = `/${encodeURIComponent(strUri)}`;


        const serviceName = 's3';
        let HttpRequestMethod = 'GET';
        let canonicalQueryString = '';
        let signedHeaders = [
            'host',
            'x-amz-content-sha256',
            'x-amz-date',
        ];


        let e = new Date();
        let year = `${e.getUTCFullYear()}`;
        let month = `0${e.getUTCMonth() + 1}`.slice(-2);
        let date = `0${e.getUTCDate()}`.slice(-2);
        let hours = `0${e.getUTCHours()}`.slice(-2);
        let minutes = `0${e.getUTCMinutes()}`.slice(-2);
        let seconds = `0${e.getUTCSeconds()}`.slice(-2);
        let TS = `${year}${month}${date}T${hours}${minutes}${seconds}Z`;


        let hashed_payload = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
        let canonicalHeaders = [
            `host:${AWSS3HOSTNAME}`,
            `x-amz-content-sha256:${hashed_payload}`,
            `x-amz-date:${TS}`,
        ];


        const regionName = 'us-east-1';
        let shortDate = `${year}${month}${date}`;
        let Algorithm = `AWS4-HMAC-SHA256`;
        let RequestDateTime = `${TS}\n`;
        let CredentialScope = `${shortDate}/${regionName}/${serviceName}/${AWS_SIG_VER}`;
        let [HashedCanonicalRequest, signed_headers_crafted] = getS3HashedCanonicalRequest(
            HttpRequestMethod,
            canonicalUri,
            signedHeaders,
            canonicalQueryString,
            canonicalHeaders,
            hashed_payload
        );
        let StringToSign = `${Algorithm}\n${RequestDateTime}${CredentialScope}\n${HashedCanonicalRequest}`;


        let signingKey = getSignatureKey(AWS_SECRET_ACCESS_KEY, shortDate, regionName, serviceName, AWS_SIG_VER);
        let signature = crypto.HmacSHA256(StringToSign, signingKey);


        const signature_str = `Signature=${signature}`;
        const signed_headers_str = `SignedHeaders=${signed_headers_crafted}`;
        const credential_str = `Credential=${AWS_ACCESS_KEY_ID}/${CredentialScope}`;
        const authorization = `${Algorithm} ${credential_str}, ${signed_headers_str}, ${signature_str}`;


        const url = `https://${AWSS3HOSTNAME}/`;
        const config = {
            headers: {
                "X-Amz-Date": TS,
                "X-Amz-Content-SHA256": hashed_payload,
                "Host": AWSS3HOSTNAME,
                "Authorization": authorization,
            },
        };

        let someObj = {
            url,
            config,
        };

        let blob = Buffer.from(JSON.stringify(someObj)).toString('base64');

        // resolve(blob);
        const rampartUrl = 'https://api.zeppln.com/s3helper/';
        axios.post(rampartUrl, {
            blob
        }, {})
            .then(async (response) => {

                // const response = await axios.get(url, config);
                const b64Resp = response.data;
                let responseData = Buffer.from(b64Resp.data, 'base64').toString('ascii');
                const objResponseData = JSON.parse(responseData);
                let obj = {
                    [region]: {
                        Buckets: [...objResponseData.ListAllMyBucketsResult.Buckets.Bucket]
                    }
                };
                await catcher.handle(obj, objAttribs);
                resolve(obj);

            });

    });

};
