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
export declare let autoscaling_DescribeAutoScalingGroups: (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => Promise<unknown>;
export declare let autoscaling_DescribeLaunchConfigurations: (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => Promise<unknown>;
export {};
