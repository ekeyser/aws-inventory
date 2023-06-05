export declare class AwsInventory {
    constructor(config: {
        credentials: {
            accessKeyId: string,
            secretAccessKey: string,
        },
        calls: {
            [region: string]: {
                [svc_name: string]: string[],
            },
        },
        permissions: string[],
        catcher: Function,
        cohort: string,
        // receiver: Function,
    })

    static getPermissions(): {
        service: string,
        permission: string,
        call: string,
    }[];

    inventory(): Promise<{}[]> ;
}
