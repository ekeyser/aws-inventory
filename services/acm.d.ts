import { AwsCredentialIdentity } from '@aws-sdk/types';
interface _catcher {
    handle: Function;
}
export declare function getPerms(): {
    service: string;
    call: string;
    permission: string;
    initiator: boolean;
}[];
export declare function acm_ListCertificates(region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher): Promise<unknown>;
export {};
