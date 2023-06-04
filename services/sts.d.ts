import { AwsCredentialIdentity } from "@aws-sdk/types";
export declare function getPerms(): {
    service: string;
    call: string;
    permission: string;
    initiator: boolean;
}[];
export declare let sts_GetCallerIdentity: (region: string, credentials: AwsCredentialIdentity) => Promise<import("@aws-sdk/client-sts").GetCallerIdentityCommandOutput>;
