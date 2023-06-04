export declare function getPerms(): {
    service: string;
    call: string;
    permission: string;
    initiator: boolean;
}[];
export declare let s3_ListBuckets: (region: string, credentials: {
    accessKeyId: string;
    secretAccessKey: string;
}, svcCallsAll: {}, objAttribs: {}, catcher: {
    handle: Function;
}) => Promise<unknown>;
