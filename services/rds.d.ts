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
export declare let rds_DescribeDBProxyEndpoints: (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => Promise<unknown>;
export declare let rds_DescribeDBProxies: (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => Promise<unknown>;
export declare let rds_DescribeDBSubnetGroups: (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => Promise<unknown>;
export declare let rds_DescribeDBParameterGroups: (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => Promise<unknown>;
export declare let rds_DescribeOptionGroups: (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => Promise<unknown>;
export declare let rds_DescribeDBClusters: (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => Promise<unknown>;
export declare let rds_DescribeDBInstances: (region: string, credentials: AwsCredentialIdentity, svcCallsAll: string[], objAttribs: {}, catcher: _catcher) => Promise<unknown>;
export {};
