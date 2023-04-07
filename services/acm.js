'use strict';

import {
    ACMClient,
    DescribeCertificateCommand,
    paginateListCertificates,
} from '@aws-sdk/client-acm';

const SVC = 'acm';
let serviceCallManifest;

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


function acm_DescribeCertificate(cert, client, objAttribs, catcher) {
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


export function acm_ListCertificates(region, credentials, svcCallsAll, objAttribs, catcher) {
    return new Promise(async (resolve, reject) => {

        serviceCallManifest = svcCallsAll;

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
        const _arrC = [];

        try {

            for await (const page of paginator) {
                arr.push(...page.CertificateSummaryList);
                _arrC.push(catcher.handle(page.CertificateSummaryList, objAttribs));
            }
        } catch (e) {
            reject(e);
        }

        const arrCertificates = [];
        for (let i = 0; i < arr.length; i++) {
            let cert = arr[i];

            if (serviceCallManifest.indexOf('DescribeCertificate') > -1) {

                let Certificate = await acm_DescribeCertificate(cert, client);
                arrCertificates.push(Certificate);
            }

        }


        let objGlobal = {
            [region]: {
                Certificates: arrCertificates
            }
        };
        resolve(objGlobal);
    });
}
