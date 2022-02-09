'use strict';

import {
    ACMClient,
    DescribeCertificateCommand,
    paginateListCertificates,
} from '@aws-sdk/client-acm';

const SVC = 'acm';

export function getPerms() {
    return [
        {
            "service": "acm",
            "call": "ListCertificates",
            "permission": "ListCertificates",
            "initiator": true
        },
        {
            "service": "acm",
            "call": "DescribeCertificate",
            "permission": "DescribeCertificate",
            "initiator": false
        }
    ];
}


export function acm_DescribeCertificate(cert, client) {
    return new Promise((resolve, reject) => {

        client.send(new DescribeCertificateCommand(
            {
                CertificateArn: cert.CertificateArn,
            }
        ))
            .then((data) => {
                resolve(data.Certificate);
            })
            .catch((err) => {
                reject(err);
            });
    });
}


export function acm_ListCertificates(region, credentials) {
    return new Promise(async (resolve, reject) => {

        let client = new ACMClient({
            region,
            credentials,
        });

        const pConfig = {
            client,
            pageSize: 100,
        };

        const cmdParams = {};

        const paginator = paginateListCertificates(pConfig, cmdParams);

        const arr = [];

        try {

            for await (const page of paginator) {
                arr.push(...page.CertificateSummaryList);
            }
        } catch (e) {
            reject(e);
        }

        const arrCertificates = [];
        for (let i = 0; i < arr.length; i++) {
            let cert = arr[i];
            let Certificate = await acm_DescribeCertificate(cert, client);
            arrCertificates.push(Certificate);
        }


        let objGlobal = {
            [region]: {
                Certificates: arrCertificates
            }
        };
        resolve(objGlobal);
    });
}
