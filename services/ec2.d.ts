import { AwsCredentialIdentity } from "@aws-sdk/types";
interface _catcher {
    handle: Function;
}
export declare let getPerms: () => {
    service: string;
    call: string;
    permission: string;
    initiator: boolean;
}[];
export declare function ec2_DescribeAvailabilityZones(region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher): Promise<unknown>;
export declare function ec2_DescribeRouteTables(region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher): Promise<unknown>;
export declare function ec2_DescribeVolumes(region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher): Promise<unknown>;
export declare function ec2_DescribeVpcs(region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher): Promise<unknown>;
export declare function ec2_DescribeSubnets(region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher): Promise<unknown>;
export declare function ec2_DescribeInstances(region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher): Promise<unknown>;
export declare function ec2_DescribeSecurityGroups(region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher): Promise<unknown>;
export {};
