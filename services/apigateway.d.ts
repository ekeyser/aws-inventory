import { AwsCredentialIdentity } from "@aws-sdk/types";
interface _catcher {
    handle: Function;
}
export declare function getPerms(): {
    service: string;
    call: string;
    permission: string;
    initiator: boolean;
}[];
export declare let apigateway_Begin: (region: string, credentials: AwsCredentialIdentity, svcCallsAll: [], objAttribs: {}, catcher: _catcher) => Promise<unknown>;
export {};
