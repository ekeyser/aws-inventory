'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.rds_DescribeDBInstances = exports.rds_DescribeDBClusters = exports.rds_DescribeOptionGroups = exports.rds_DescribeDBParameterGroups = exports.rds_DescribeDBSubnetGroups = exports.rds_DescribeDBProxies = exports.rds_DescribeDBProxyEndpoints = exports.getPerms = void 0;
const client_rds_1 = require("@aws-sdk/client-rds");
let serviceCallManifest;
function getPerms() {
    return [
        {
            "service": "rds",
            "call": "DescribeDBSubnetGroups",
            "permission": "DescribeDBSubnetGroups",
            "initiator": true
        },
        {
            "service": "rds",
            "call": "DescribeDBParameterGroups",
            "permission": "DescribeDBParameterGroups",
            "initiator": true
        },
        {
            "service": "rds",
            "call": "DescribeOptionGroups",
            "permission": "DescribeOptionGroups",
            "initiator": true
        },
        {
            "service": "rds",
            "call": "DescribeDBClusters",
            "permission": "DescribeDBClusters",
            "initiator": true
        },
        {
            "service": "rds",
            "call": "DescribeDBInstances",
            "permission": "DescribeDBInstances",
            "initiator": true
        },
        {
            "service": "rds",
            "call": "DescribeDBProxies",
            "permission": "DescribeDBProxies",
            "initiator": true
        },
        {
            "service": "rds",
            "call": "DescribeDBProxyEndpoints",
            "permission": "DescribeDBProxyEndpoints",
            "initiator": true
        },
        {
            "service": "rds",
            "call": "DescribeDBProxyTargets",
            "permission": "DescribeDBProxyTargets",
            "initiator": false
        },
        {
            "service": "rds",
            "call": "DescribeDBProxyTargetGroups",
            "permission": "DescribeDBProxyTargetGroups",
            "initiator": false
        }
    ];
}
exports.getPerms = getPerms;
let rds_DescribeDBProxyTargetGroups = (DBProxyName, region, credentials, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {
        const client = new client_rds_1.RDSClient({
            region,
            credentials,
        });
        const pConfig = {
            client,
            pageSize: 100,
        };
        const cmdParams = {
            DBProxyName
        };
        const paginator = (0, client_rds_1.paginateDescribeDBProxyTargetGroups)(pConfig, cmdParams);
        const arr = [];
        const arr2 = [];
        try {
            for await (const page of paginator) {
                if (page.TargetGroups)
                    arr.push(...page.TargetGroups);
                arr2.push(catcher.handle(page.TargetGroups, objAttribs));
            }
        }
        catch (e) {
            reject(e);
        }
        let objGlobal = {
            [region]: {
                DBTargetGroups: arr
            }
        };
        resolve(objGlobal);
    });
};
let rds_DescribeDBProxyTargets = (DBProxyName, region, credentials, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {
        const client = new client_rds_1.RDSClient({
            region,
            credentials,
        });
        const pConfig = {
            client,
            pageSize: 100,
        };
        const cmdParams = {
            DBProxyName
        };
        const paginator = (0, client_rds_1.paginateDescribeDBProxyTargets)(pConfig, cmdParams);
        const arr = [];
        const arr2 = [];
        try {
            for await (const page of paginator) {
                if (page.Targets)
                    arr.push(...page.Targets);
                arr2.push(catcher.handle(page.Targets, objAttribs));
            }
        }
        catch (e) {
            reject(e);
        }
        let objGlobal = {
            [region]: {
                DBTargets: arr
            }
        };
        resolve(objGlobal);
    });
};
let rds_DescribeDBProxyEndpoints = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {
        serviceCallManifest = svcCallsAll;
        const client = new client_rds_1.RDSClient({
            region,
            credentials,
        });
        const pConfig = {
            client,
            pageSize: 100,
        };
        const cmdParams = {};
        const paginator = (0, client_rds_1.paginateDescribeDBProxyEndpoints)(pConfig, cmdParams);
        const arr = [];
        const arr2 = [];
        try {
            for await (const page of paginator) {
                if (page.DBProxyEndpoints)
                    arr.push(...page.DBProxyEndpoints);
                arr2.push(catcher.handle(page.DBProxyEndpoints, objAttribs));
            }
        }
        catch (e) {
            reject(e);
        }
        let objGlobal = {
            [region]: {
                DBProxyEndpoints: arr
            }
        };
        resolve(objGlobal);
    });
};
exports.rds_DescribeDBProxyEndpoints = rds_DescribeDBProxyEndpoints;
let rds_DescribeDBProxies = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {
        serviceCallManifest = svcCallsAll;
        const client = new client_rds_1.RDSClient({
            region,
            credentials,
        });
        const pConfig = {
            client,
            pageSize: 100,
        };
        const cmdParams = {};
        const paginator = (0, client_rds_1.paginateDescribeDBProxies)(pConfig, cmdParams);
        const arr = [];
        const arr2 = [];
        try {
            for await (const page of paginator) {
                if (page.DBProxies)
                    arr.push(...page.DBProxies);
                arr2.push(catcher.handle(page.DBProxies, objAttribs));
            }
        }
        catch (e) {
            reject(e);
        }
        let objGlobal = {
            [region]: {
                DBProxies: arr,
                DBProxyTargets: [],
                DBProxyTargetGroups: [],
            }
        };
        let arr3 = [];
        arr.forEach((objProxy) => {
            if (objProxy.DBProxyName) {
                arr3.push(rds_DescribeDBProxyTargets(objProxy.DBProxyName, region, credentials, objAttribs, catcher));
                arr3.push(rds_DescribeDBProxyTargetGroups(objProxy.DBProxyName, region, credentials, objAttribs, catcher));
            }
        });
        Promise.all(arr3)
            .then((arrP) => {
            arrP.forEach((obj) => {
                const _regions = Object.keys(obj);
                _regions.forEach((region) => {
                    let regionObjects = obj[region];
                    let regionObjectNames = Object.keys(regionObjects);
                    regionObjectNames.forEach((objectName) => {
                        // @ts-ignore
                        let resources = regionObjects[objectName];
                        // @ts-ignore
                        if (objGlobal[region][objectName] !== undefined) {
                            // @ts-ignore
                            objGlobal[region][objectName].push(...resources);
                        }
                        else {
                            // @ts-ignore
                            objGlobal[region][objectName] = resources;
                        }
                    });
                });
            });
            resolve(objGlobal);
        });
    });
};
exports.rds_DescribeDBProxies = rds_DescribeDBProxies;
let rds_DescribeDBSubnetGroups = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {
        serviceCallManifest = svcCallsAll;
        const client = new client_rds_1.RDSClient({
            region,
            credentials,
        });
        const pConfig = {
            client,
            pageSize: 100,
        };
        const cmdParams = {};
        const paginator = (0, client_rds_1.paginateDescribeDBSubnetGroups)(pConfig, cmdParams);
        const arr = [];
        const arr2 = [];
        try {
            for await (const page of paginator) {
                if (page.DBSubnetGroups)
                    arr.push(...page.DBSubnetGroups);
                arr2.push(catcher.handle(page.DBSubnetGroups, objAttribs));
            }
        }
        catch (e) {
            reject(e);
        }
        // this.objGlobal[region].DBSubnetGroups = arr;
        // resolve(`${region}/rds_DescribeDBSubnetGroups`);
        let objGlobal = {
            [region]: {
                DBSubnetGroups: arr
            }
        };
        resolve(objGlobal);
    });
};
exports.rds_DescribeDBSubnetGroups = rds_DescribeDBSubnetGroups;
let rds_DescribeDBParameterGroups = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {
        serviceCallManifest = svcCallsAll;
        const client = new client_rds_1.RDSClient({
            region,
            credentials,
        });
        const pConfig = {
            client,
            pageSize: 100,
        };
        const cmdParams = {};
        const paginator = (0, client_rds_1.paginateDescribeDBParameterGroups)(pConfig, cmdParams);
        const arr = [];
        const arr2 = [];
        try {
            for await (const page of paginator) {
                if (page.DBParameterGroups)
                    arr.push(...page.DBParameterGroups);
                arr2.push(catcher.handle(page.DBParameterGroups, objAttribs));
            }
        }
        catch (e) {
            reject(e);
        }
        // this.objGlobal[region].ParameterGroups = arr;
        // resolve(`${region}/rds_DescribeDBParameterGroups`);
        let objGlobal = {
            [region]: {
                ParameterGroups: arr
            }
        };
        resolve(objGlobal);
    });
};
exports.rds_DescribeDBParameterGroups = rds_DescribeDBParameterGroups;
let rds_DescribeOptionGroups = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {
        serviceCallManifest = svcCallsAll;
        const client = new client_rds_1.RDSClient({
            region,
            credentials,
        });
        const pConfig = {
            client,
            pageSize: 100,
        };
        const cmdParams = {};
        const paginator = (0, client_rds_1.paginateDescribeOptionGroups)(pConfig, cmdParams);
        const arr = [];
        const arr2 = [];
        try {
            for await (const page of paginator) {
                if (page.OptionGroupsList)
                    arr.push(...page.OptionGroupsList);
                arr2.push(catcher.handle(page.OptionGroupsList, objAttribs));
            }
        }
        catch (e) {
            reject(e);
        }
        // this.objGlobal[region].OptionGroups = arr;
        // resolve(`${region}/rds_DescribeOptionGroups`);
        let obj = {
            [region]: {
                OptionGroups: arr
            }
        };
        resolve(obj);
    });
};
exports.rds_DescribeOptionGroups = rds_DescribeOptionGroups;
let rds_DescribeDBClusters = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {
        serviceCallManifest = svcCallsAll;
        const client = new client_rds_1.RDSClient({
            region,
            credentials,
        });
        const pConfig = {
            client,
            pageSize: 100,
        };
        const cmdParams = {};
        const paginator = (0, client_rds_1.paginateDescribeDBClusters)(pConfig, cmdParams);
        const arr = [];
        const arr2 = [];
        try {
            for await (const page of paginator) {
                if (page.DBClusters)
                    arr.push(...page.DBClusters);
                arr2.push(catcher.handle(page.DBClusters, objAttribs));
            }
        }
        catch (e) {
            reject(e);
        }
        // this.objGlobal[region].DBClusters = arr;
        // resolve(`${region}/rds_DescribeDBClusters`);
        let obj = {
            [region]: {
                DBClusters: arr
            }
        };
        resolve(obj);
    });
};
exports.rds_DescribeDBClusters = rds_DescribeDBClusters;
let rds_DescribeDBInstances = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {
        serviceCallManifest = svcCallsAll;
        const client = new client_rds_1.RDSClient({
            region,
            credentials,
        });
        const pConfig = {
            client,
            pageSize: 100,
        };
        const cmdParams = {};
        const paginator = (0, client_rds_1.paginateDescribeDBInstances)(pConfig, cmdParams);
        const arr = [];
        const arr2 = [];
        try {
            for await (const page of paginator) {
                if (page.DBInstances)
                    arr.push(...page.DBInstances);
                arr2.push(catcher.handle(page.DBInstances, objAttribs));
            }
        }
        catch (e) {
            reject(e);
        }
        // this.objGlobal[region].DBInstances = arr;
        // resolve(`${region}/rds_DescribeDBInstances`);
        let obj = {
            [region]: {
                DBInstances: arr
            }
        };
        resolve(obj);
    });
};
exports.rds_DescribeDBInstances = rds_DescribeDBInstances;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7O0FBRWIsb0RBVTZCO0FBRzdCLElBQUksbUJBQW1CLENBQUM7QUFNeEIsU0FBZ0IsUUFBUTtJQUNwQixPQUFPO1FBQ0g7WUFDSSxTQUFTLEVBQUUsS0FBSztZQUNoQixNQUFNLEVBQUUsd0JBQXdCO1lBQ2hDLFlBQVksRUFBRSx3QkFBd0I7WUFDdEMsV0FBVyxFQUFFLElBQUk7U0FDcEI7UUFDRDtZQUNJLFNBQVMsRUFBRSxLQUFLO1lBQ2hCLE1BQU0sRUFBRSwyQkFBMkI7WUFDbkMsWUFBWSxFQUFFLDJCQUEyQjtZQUN6QyxXQUFXLEVBQUUsSUFBSTtTQUNwQjtRQUNEO1lBQ0ksU0FBUyxFQUFFLEtBQUs7WUFDaEIsTUFBTSxFQUFFLHNCQUFzQjtZQUM5QixZQUFZLEVBQUUsc0JBQXNCO1lBQ3BDLFdBQVcsRUFBRSxJQUFJO1NBQ3BCO1FBQ0Q7WUFDSSxTQUFTLEVBQUUsS0FBSztZQUNoQixNQUFNLEVBQUUsb0JBQW9CO1lBQzVCLFlBQVksRUFBRSxvQkFBb0I7WUFDbEMsV0FBVyxFQUFFLElBQUk7U0FDcEI7UUFDRDtZQUNJLFNBQVMsRUFBRSxLQUFLO1lBQ2hCLE1BQU0sRUFBRSxxQkFBcUI7WUFDN0IsWUFBWSxFQUFFLHFCQUFxQjtZQUNuQyxXQUFXLEVBQUUsSUFBSTtTQUNwQjtRQUNEO1lBQ0ksU0FBUyxFQUFFLEtBQUs7WUFDaEIsTUFBTSxFQUFFLG1CQUFtQjtZQUMzQixZQUFZLEVBQUUsbUJBQW1CO1lBQ2pDLFdBQVcsRUFBRSxJQUFJO1NBQ3BCO1FBQ0Q7WUFDSSxTQUFTLEVBQUUsS0FBSztZQUNoQixNQUFNLEVBQUUsMEJBQTBCO1lBQ2xDLFlBQVksRUFBRSwwQkFBMEI7WUFDeEMsV0FBVyxFQUFFLElBQUk7U0FDcEI7UUFDRDtZQUNJLFNBQVMsRUFBRSxLQUFLO1lBQ2hCLE1BQU0sRUFBRSx3QkFB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SSxzQkFBUyxDQUN4QjtZQUNJLE1BQU07WUFDTixXQUFXO1NBQ2QsQ0FDSixDQUFDO1FBRUYsTUFBTSxPQUFPLEdBQUc7WUFDWixNQUFNO1lBQ04sUUFBUSxFQUFFLEdBQUc7U0FDaEIsQ0FBQztRQUVGLE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUVyQixNQUFNLFNBQVMsR0FBRyxJQUFBLHdDQUEyQixFQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUVsRSxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDZixNQUFNLElBQUksR0FBRyxFQUFFLENBQUM7UUFFaEIsSUFBSTtZQUVBLElBQUksS0FBSyxFQUFFLE1BQU0sSUFBSSxJQUFJLFNBQVMsRUFBRTtnQkFDaEMsSUFBSSxJQUFJLENBQUMsV0FBVztvQkFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUNwRCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFBO2FBQzFEO1NBQ0o7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNSLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNiO1FBRUQsNENBQTRDO1FBQzVDLGdEQUFnRDtRQUNoRCxJQUFJLEdBQUcsR0FBRztZQUNOLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ04sV0FBVyxFQUFFLEdBQUc7YUFDbkI7U0FDSixDQUFDO1FBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pCLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDO0FBMUNTLFFBQUEsdUJBQXVCLDJCQTBDaEMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7XG4gICAgcGFnaW5hdGVEZXNjcmliZURCQ2x1c3RlcnMsIHBhZ2luYXRlRGVzY3JpYmVEQkluc3RhbmNlcyxcbiAgICBwYWdpbmF0ZURlc2NyaWJlREJQYXJhbWV0ZXJHcm91cHMsXG4gICAgcGFnaW5hdGVEZXNjcmliZURCU3VibmV0R3JvdXBzLFxuICAgIHBhZ2luYXRlRGVzY3JpYmVPcHRpb25Hcm91cHMsXG4gICAgcGFnaW5hdGVEZXNjcmliZURCUHJveGllcyxcbiAgICBwYWdpbmF0ZURlc2NyaWJlREJQcm94eUVuZHBvaW50cyxcbiAgICBwYWdpbmF0ZURlc2NyaWJlREJQcm94eVRhcmdldEdyb3VwcyxcbiAgICBwYWdpbmF0ZURlc2NyaWJlREJQcm94eVRhcmdldHMsXG4gICAgUkRTQ2xpZW50LCBEQlByb3h5VGFyZ2V0LCBEQlByb3h5VGFyZ2V0R3JvdXAsIERCUHJveHlcbn0gZnJvbSBcIkBhd3Mtc2RrL2NsaWVudC1yZHNcIjtcbmltcG9ydCB7QXdzQ3JlZGVudGlhbElkZW50aXR5fSBmcm9tIFwiQGF3cy1zZGsvdHlwZXNcIjtcblxubGV0IHNlcnZpY2VDYWxsTWFuaWZlc3Q7XG5cbmludGVyZmFjZSBfY2F0Y2hlciB7XG4gICAgaGFuZGxlOiBGdW5jdGlvbixcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBlcm1zKCkge1xuICAgIHJldHVybiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwic2VydmljZVwiOiBcInJkc1wiLFxuICAgICAgICAgICAgXCJjYWxsXCI6IFwiRGVzY3JpYmVEQlN1Ym5ldEdyb3Vwc1wiLFxuICAgICAgICAgICAgXCJwZXJtaXNzaW9uXCI6IFwiRGVzY3JpYmVEQlN1Ym5ldEdyb3Vwc1wiLFxuICAgICAgICAgICAgXCJpbml0aWF0b3JcIjogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInNlcnZpY2VcIjogXCJyZHNcIixcbiAgICAgICAgICAgIFwiY2FsbFwiOiBcIkRlc2NyaWJlREJQYXJhbWV0ZXJHcm91cHNcIixcbiAgICAgICAgICAgIFwicGVybWlzc2lvblwiOiBcIkRlc2NyaWJlREJQYXJhbWV0ZXJHcm91cHNcIixcbiAgICAgICAgICAgIFwiaW5pdGlhdG9yXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJzZXJ2aWNlXCI6IFwicmRzXCIsXG4gICAgICAgICAgICBcImNhbGxcIjogXCJEZXNjcmliZU9wdGlvbkdyb3Vwc1wiLFxuICAgICAgICAgICAgXCJwZXJtaXNzaW9uXCI6IFwiRGVzY3JpYmVPcHRpb25Hcm91cHNcIixcbiAgICAgICAgICAgIFwiaW5pdGlhdG9yXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJzZXJ2aWNlXCI6IFwicmRzXCIsXG4gICAgICAgICAgICBcImNhbGxcIjogXCJEZXNjcmliZURCQ2x1c3RlcnNcIixcbiAgICAgICAgICAgIFwicGVybWlzc2lvblwiOiBcIkRlc2NyaWJlREJDbHVzdGVyc1wiLFxuICAgICAgICAgICAgXCJpbml0aWF0b3JcIjogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInNlcnZpY2VcIjogXCJyZHNcIixcbiAgICAgICAgICAgIFwiY2FsbFwiOiBcIkRlc2NyaWJlREJJbnN0YW5jZXNcIixcbiAgICAgICAgICAgIFwicGVybWlzc2lvblwiOiBcIkRlc2NyaWJlREJJbnN0YW5jZXNcIixcbiAgICAgICAgICAgIFwiaW5pdGlhdG9yXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJzZXJ2aWNlXCI6IFwicmRzXCIsXG4gICAgICAgICAgICBcImNhbGxcIjogXCJEZXNjcmliZURCUHJveGllc1wiLFxuICAgICAgICAgICAgXCJwZXJtaXNzaW9uXCI6IFwiRGVzY3JpYmVEQlByb3hpZXNcIixcbiAgICAgICAgICAgIFwiaW5pdGlhdG9yXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJzZXJ2aWNlXCI6IFwicmRzXCIsXG4gICAgICAgICAgICBcImNhbGxcIjogXCJEZXNjcmliZURCUHJveHlFbmRwb2ludHNcIixcbiAgICAgICAgICAgIFwicGVybWlzc2lvblwiOiBcIkRlc2NyaWJlREJQcm94eUVuZHBvaW50c1wiLFxuICAgICAgICAgICAgXCJpbml0aWF0b3JcIjogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInNlcnZpY2VcIjogXCJyZHNcIixcbiAgICAgICAgICAgIFwiY2FsbFwiOiBcIkRlc2NyaWJlREJQcm94eVRhcmdldHNcIixcbiAgICAgICAgICAgIFwicGVybWlzc2lvblwiOiBcIkRlc2NyaWJlREJQcm94eVRhcmdldHNcIixcbiAgICAgICAgICAgIFwiaW5pdGlhdG9yXCI6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwic2VydmljZVwiOiBcInJkc1wiLFxuICAgICAgICAgICAgXCJjYWxsXCI6IFwiRGVzY3JpYmVEQlByb3h5VGFyZ2V0R3JvdXBzXCIsXG4gICAgICAgICAgICBcInBlcm1pc3Npb25cIjogXCJEZXNjcmliZURCUHJveHlUYXJnZXRHcm91cHNcIixcbiAgICAgICAgICAgIFwiaW5pdGlhdG9yXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICBdO1xufVxuXG5cbmxldCByZHNfRGVzY3JpYmVEQlByb3h5VGFyZ2V0R3JvdXBzID0gKERCUHJveHlOYW1lOiBzdHJpbmcsIHJlZ2lvbjogc3RyaW5nLCBjcmVkZW50aWFsczogQXdzQ3JlZGVudGlhbElkZW50aXR5LCBvYmpBdHRyaWJzOiB7fSwgY2F0Y2hlcjogX2NhdGNoZXIpOiBQcm9taXNlPHtcbiAgICBba2V5OiBzdHJpbmddOiB7XG4gICAgICAgIERCVGFyZ2V0R3JvdXBzOiBEQlByb3h5VGFyZ2V0R3JvdXBbXSxcbiAgICB9XG59PiA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgICBjb25zdCBjbGllbnQgPSBuZXcgUkRTQ2xpZW50KFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJlZ2lvbixcbiAgICAgICAgICAgICAgICBjcmVkZW50aWFscyxcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCBwQ29uZmlnID0ge1xuICAgICAgICAgICAgY2xpZW50LFxuICAgICAgICAgICAgcGFnZVNpemU6IDEwMCxcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBjbWRQYXJhbXMgPSB7XG4gICAgICAgICAgICBEQlByb3h5TmFtZVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHBhZ2luYXRvciA9IHBhZ2luYXRlRGVzY3JpYmVEQlByb3h5VGFyZ2V0R3JvdXBzKHBDb25maWcsIGNtZFBhcmFtcyk7XG5cbiAgICAgICAgY29uc3QgYXJyID0gW107XG4gICAgICAgIGNvbnN0IGFycjIgPSBbXTtcblxuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBmb3IgYXdhaXQgKGNvbnN0IHBhZ2Ugb2YgcGFnaW5hdG9yKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhZ2UuVGFyZ2V0R3JvdXBzKSBhcnIucHVzaCguLi5wYWdlLlRhcmdldEdyb3Vwcyk7XG4gICAgICAgICAgICAgICAgYXJyMi5wdXNoKGNhdGNoZXIuaGFuZGxlKHBhZ2UuVGFyZ2V0R3JvdXBzLCBvYmpBdHRyaWJzKSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgb2JqR2xvYmFsID0ge1xuICAgICAgICAgICAgW3JlZ2lvbl06IHtcbiAgICAgICAgICAgICAgICBEQlRhcmdldEdyb3VwczogYXJyXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJlc29sdmUob2JqR2xvYmFsKTtcbiAgICB9KTtcbn07XG5cblxubGV0IHJkc19EZXNjcmliZURCUHJveHlUYXJnZXRzID0gKERCUHJveHlOYW1lOiBzdHJpbmcsIHJlZ2lvbjogc3RyaW5nLCBjcmVkZW50aWFsczogQXdzQ3JlZGVudGlhbElkZW50aXR5LCBvYmpBdHRyaWJzOiB7fSwgY2F0Y2hlcjogX2NhdGNoZXIpOiBQcm9taXNlPHtcbiAgICBba2V5OiBzdHJpbmddOiB7XG4gICAgICAgIERCVGFyZ2V0czogREJQcm94eVRhcmdldFtdLFxuICAgIH1cbn0+ID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgIGNvbnN0IGNsaWVudCA9IG5ldyBSRFNDbGllbnQoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmVnaW9uLFxuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzLFxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IHBDb25maWcgPSB7XG4gICAgICAgICAgICBjbGllbnQsXG4gICAgICAgICAgICBwYWdlU2l6ZTogMTAwLFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGNtZFBhcmFtcyA9IHtcbiAgICAgICAgICAgIERCUHJveHlOYW1lXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgcGFnaW5hdG9yID0gcGFnaW5hdGVEZXNjcmliZURCUHJveHlUYXJnZXRzKHBDb25maWcsIGNtZFBhcmFtcyk7XG5cbiAgICAgICAgY29uc3QgYXJyID0gW107XG4gICAgICAgIGNvbnN0IGFycjIgPSBbXTtcblxuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBmb3IgYXdhaXQgKGNvbnN0IHBhZ2Ugb2YgcGFnaW5hdG9yKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhZ2UuVGFyZ2V0cykgYXJyLnB1c2goLi4ucGFnZS5UYXJnZXRzKTtcbiAgICAgICAgICAgICAgICBhcnIyLnB1c2goY2F0Y2hlci5oYW5kbGUocGFnZS5UYXJnZXRzLCBvYmpBdHRyaWJzKSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgb2JqR2xvYmFsID0ge1xuICAgICAgICAgICAgW3JlZ2lvbl06IHtcbiAgICAgICAgICAgICAgICBEQlRhcmdldHM6IGFyclxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXNvbHZlKG9iakdsb2JhbCk7XG4gICAgfSk7XG59O1xuXG5cbmV4cG9ydCBsZXQgcmRzX0Rlc2NyaWJlREJQcm94eUVuZHBvaW50cyA9IChyZWdpb246IHN0cmluZywgY3JlZGVudGlhbHM6IEF3c0NyZWRlbnRpYWxJZGVudGl0eSwgc3ZjQ2FsbHNBbGw6IHN0cmluZ1tdLCBvYmpBdHRyaWJzOiB7fSwgY2F0Y2hlcjogX2NhdGNoZXIpID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgIHNlcnZpY2VDYWxsTWFuaWZlc3QgPSBzdmNDYWxsc0FsbDtcbiAgICAgICAgY29uc3QgY2xpZW50ID0gbmV3IFJEU0NsaWVudChcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZWdpb24sXG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbHMsXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgcENvbmZpZyA9IHtcbiAgICAgICAgICAgIGNsaWVudCxcbiAgICAgICAgICAgIHBhZ2VTaXplOiAxMDAsXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgY21kUGFyYW1zID0ge307XG5cbiAgICAgICAgY29uc3QgcGFnaW5hdG9yID0gcGFnaW5hdGVEZXNjcmliZURCUHJveHlFbmRwb2ludHMocENvbmZpZywgY21kUGFyYW1zKTtcblxuICAgICAgICBjb25zdCBhcnIgPSBbXTtcbiAgICAgICAgY29uc3QgYXJyMiA9IFtdO1xuXG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGZvciBhd2FpdCAoY29uc3QgcGFnZSBvZiBwYWdpbmF0b3IpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFnZS5EQlByb3h5RW5kcG9pbnRzKSBhcnIucHVzaCguLi5wYWdlLkRCUHJveHlFbmRwb2ludHMpO1xuICAgICAgICAgICAgICAgIGFycjIucHVzaChjYXRjaGVyLmhhbmRsZShwYWdlLkRCUHJveHlFbmRwb2ludHMsIG9iakF0dHJpYnMpKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBvYmpHbG9iYWwgPSB7XG4gICAgICAgICAgICBbcmVnaW9uXToge1xuICAgICAgICAgICAgICAgIERCUHJveHlFbmRwb2ludHM6IGFyclxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXNvbHZlKG9iakdsb2JhbCk7XG4gICAgfSk7XG59O1xuXG5cbmV4cG9ydCBsZXQgcmRzX0Rlc2NyaWJlREJQcm94aWVzID0gKHJlZ2lvbjogc3RyaW5nLCBjcmVkZW50aWFsczogQXdzQ3JlZGVudGlhbElkZW50aXR5LCBzdmNDYWxsc0FsbDogc3RyaW5nW10sIG9iakF0dHJpYnM6IHt9LCBjYXRjaGVyOiBfY2F0Y2hlcikgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgc2VydmljZUNhbGxNYW5pZmVzdCA9IHN2Y0NhbGxzQWxsO1xuICAgICAgICBjb25zdCBjbGllbnQgPSBuZXcgUkRTQ2xpZW50KFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJlZ2lvbixcbiAgICAgICAgICAgICAgICBjcmVkZW50aWFscyxcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCBwQ29uZmlnID0ge1xuICAgICAgICAgICAgY2xpZW50LFxuICAgICAgICAgICAgcGFnZVNpemU6IDEwMCxcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBjbWRQYXJhbXMgPSB7fTtcblxuICAgICAgICBjb25zdCBwYWdpbmF0b3IgPSBwYWdpbmF0ZURlc2NyaWJlREJQcm94aWVzKHBDb25maWcsIGNtZFBhcmFtcyk7XG5cbiAgICAgICAgY29uc3QgYXJyID0gW107XG4gICAgICAgIGNvbnN0IGFycjIgPSBbXTtcblxuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBmb3IgYXdhaXQgKGNvbnN0IHBhZ2Ugb2YgcGFnaW5hdG9yKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhZ2UuREJQcm94aWVzKSBhcnIucHVzaCguLi5wYWdlLkRCUHJveGllcyk7XG4gICAgICAgICAgICAgICAgYXJyMi5wdXNoKGNhdGNoZXIuaGFuZGxlKHBhZ2UuREJQcm94aWVzLCBvYmpBdHRyaWJzKSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGxldCBvYmpHbG9iYWw6IHtcbiAgICAgICAgICAgIFtyZWdpb246IHN0cmluZ106IHtcbiAgICAgICAgICAgICAgICBEQlByb3hpZXM6IERCUHJveHlbXSxcbiAgICAgICAgICAgICAgICBEQlByb3h5VGFyZ2V0czogREJQcm94eVRhcmdldFtdLFxuICAgICAgICAgICAgICAgIERCUHJveHlUYXJnZXRHcm91cHM6IERCUHJveHlUYXJnZXRHcm91cFtdLFxuICAgICAgICAgICAgfVxuICAgICAgICB9ID0ge1xuICAgICAgICAgICAgW3JlZ2lvbl06IHtcbiAgICAgICAgICAgICAgICBEQlByb3hpZXM6IGFycixcbiAgICAgICAgICAgICAgICBEQlByb3h5VGFyZ2V0czogW10sXG4gICAgICAgICAgICAgICAgREJQcm94eVRhcmdldEdyb3VwczogW10sXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaW50ZXJmYWNlIF9yZWdpb250YXJnZXRzIHtcbiAgICAgICAgICAgIFtyZWdpb246IHN0cmluZ106IHtcbiAgICAgICAgICAgICAgICBEQlRhcmdldHM6IERCUHJveHlUYXJnZXRbXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH1cblxuICAgICAgICBpbnRlcmZhY2UgX3JlZ2lvbnRhcmdldGdyb3VwcyB7XG4gICAgICAgICAgICBbcmVnaW9uOiBzdHJpbmddOiB7XG4gICAgICAgICAgICAgICAgREJUYXJnZXRHcm91cHM6IERCUHJveHlUYXJnZXRHcm91cFtdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBhcnIzOiBQcm9taXNlPF9yZWdpb250YXJnZXRzIHwgX3JlZ2lvbnRhcmdldGdyb3Vwcz5bXSA9IFtdO1xuICAgICAgICBhcnIuZm9yRWFjaCgob2JqUHJveHkpID0+IHtcbiAgICAgICAgICAgIGlmIChvYmpQcm94eS5EQlByb3h5TmFtZSkge1xuXG4gICAgICAgICAgICAgICAgYXJyMy5wdXNoKHJkc19EZXNjcmliZURCUHJveHlUYXJnZXRzKG9ialByb3h5LkRCUHJveHlOYW1lLCByZWdpb24sIGNyZWRlbnRpYWxzLCBvYmpBdHRyaWJzLCBjYXRjaGVyKSk7XG4gICAgICAgICAgICAgICAgYXJyMy5wdXNoKHJkc19EZXNjcmliZURCUHJveHlUYXJnZXRHcm91cHMob2JqUHJveHkuREJQcm94eU5hbWUsIHJlZ2lvbiwgY3JlZGVudGlhbHMsIG9iakF0dHJpYnMsIGNhdGNoZXIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cblxuICAgICAgICBQcm9taXNlLmFsbChhcnIzKVxuICAgICAgICAgICAgLnRoZW4oKGFyclApID0+IHtcblxuICAgICAgICAgICAgICAgIGFyclAuZm9yRWFjaCgob2JqKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IF9yZWdpb25zID0gT2JqZWN0LmtleXMob2JqKTtcblxuICAgICAgICAgICAgICAgICAgICBfcmVnaW9ucy5mb3JFYWNoKChyZWdpb24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZWdpb25PYmplY3RzID0gb2JqW3JlZ2lvbl07XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVnaW9uT2JqZWN0TmFtZXMgPSBPYmplY3Qua2V5cyhyZWdpb25PYmplY3RzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmVnaW9uT2JqZWN0TmFtZXMuZm9yRWFjaCgob2JqZWN0TmFtZSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNvdXJjZXM6IERCUHJveHlUYXJnZXRbXSB8IERCUHJveHlUYXJnZXRHcm91cFtdID0gcmVnaW9uT2JqZWN0c1tvYmplY3ROYW1lXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqR2xvYmFsW3JlZ2lvbl1bb2JqZWN0TmFtZV0gIT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqR2xvYmFsW3JlZ2lvbl1bb2JqZWN0TmFtZV0ucHVzaCguLi5yZXNvdXJjZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqR2xvYmFsW3JlZ2lvbl1bb2JqZWN0TmFtZV0gPSByZXNvdXJjZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXNvbHZlKG9iakdsb2JhbCk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgfSk7XG59O1xuXG5cbmV4cG9ydCBsZXQgcmRzX0Rlc2NyaWJlREJTdWJuZXRHcm91cHMgPSAocmVnaW9uOiBzdHJpbmcsIGNyZWRlbnRpYWxzOiBBd3NDcmVkZW50aWFsSWRlbnRpdHksIHN2Y0NhbGxzQWxsOiBzdHJpbmdbXSwgb2JqQXR0cmliczoge30sIGNhdGNoZXI6IF9jYXRjaGVyKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgICBzZXJ2aWNlQ2FsbE1hbmlmZXN0ID0gc3ZjQ2FsbHNBbGw7XG4gICAgICAgIGNvbnN0IGNsaWVudCA9IG5ldyBSRFNDbGllbnQoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmVnaW9uLFxuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzLFxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IHBDb25maWcgPSB7XG4gICAgICAgICAgICBjbGllbnQsXG4gICAgICAgICAgICBwYWdlU2l6ZTogMTAwLFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGNtZFBhcmFtcyA9IHt9O1xuXG4gICAgICAgIGNvbnN0IHBhZ2luYXRvciA9IHBhZ2luYXRlRGVzY3JpYmVEQlN1Ym5ldEdyb3VwcyhwQ29uZmlnLCBjbWRQYXJhbXMpO1xuXG4gICAgICAgIGNvbnN0IGFyciA9IFtdO1xuICAgICAgICBjb25zdCBhcnIyID0gW107XG5cbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgZm9yIGF3YWl0IChjb25zdCBwYWdlIG9mIHBhZ2luYXRvcikge1xuICAgICAgICAgICAgICAgIGlmIChwYWdlLkRCU3VibmV0R3JvdXBzKSBhcnIucHVzaCguLi5wYWdlLkRCU3VibmV0R3JvdXBzKTtcbiAgICAgICAgICAgICAgICBhcnIyLnB1c2goY2F0Y2hlci5oYW5kbGUocGFnZS5EQlN1Ym5ldEdyb3Vwcywgb2JqQXR0cmlicykpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdGhpcy5vYmpHbG9iYWxbcmVnaW9uXS5EQlN1Ym5ldEdyb3VwcyA9IGFycjtcbiAgICAgICAgLy8gcmVzb2x2ZShgJHtyZWdpb259L3Jkc19EZXNjcmliZURCU3VibmV0R3JvdXBzYCk7XG4gICAgICAgIGxldCBvYmpHbG9iYWwgPSB7XG4gICAgICAgICAgICBbcmVnaW9uXToge1xuICAgICAgICAgICAgICAgIERCU3VibmV0R3JvdXBzOiBhcnJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmVzb2x2ZShvYmpHbG9iYWwpO1xuICAgIH0pO1xufTtcblxuXG5leHBvcnQgbGV0IHJkc19EZXNjcmliZURCUGFyYW1ldGVyR3JvdXBzID0gKHJlZ2lvbjogc3RyaW5nLCBjcmVkZW50aWFsczogQXdzQ3JlZGVudGlhbElkZW50aXR5LCBzdmNDYWxsc0FsbDogc3RyaW5nW10sIG9iakF0dHJpYnM6IHt9LCBjYXRjaGVyOiBfY2F0Y2hlcikgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgc2VydmljZUNhbGxNYW5pZmVzdCA9IHN2Y0NhbGxzQWxsO1xuICAgICAgICBjb25zdCBjbGllbnQgPSBuZXcgUkRTQ2xpZW50KFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJlZ2lvbixcbiAgICAgICAgICAgICAgICBjcmVkZW50aWFscyxcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCBwQ29uZmlnID0ge1xuICAgICAgICAgICAgY2xpZW50LFxuICAgICAgICAgICAgcGFnZVNpemU6IDEwMCxcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBjbWRQYXJhbXMgPSB7fTtcblxuICAgICAgICBjb25zdCBwYWdpbmF0b3IgPSBwYWdpbmF0ZURlc2NyaWJlREJQYXJhbWV0ZXJHcm91cHMocENvbmZpZywgY21kUGFyYW1zKTtcblxuICAgICAgICBjb25zdCBhcnIgPSBbXTtcbiAgICAgICAgY29uc3QgYXJyMiA9IFtdO1xuXG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGZvciBhd2FpdCAoY29uc3QgcGFnZSBvZiBwYWdpbmF0b3IpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFnZS5EQlBhcmFtZXRlckdyb3VwcykgYXJyLnB1c2goLi4ucGFnZS5EQlBhcmFtZXRlckdyb3Vwcyk7XG4gICAgICAgICAgICAgICAgYXJyMi5wdXNoKGNhdGNoZXIuaGFuZGxlKHBhZ2UuREJQYXJhbWV0ZXJHcm91cHMsIG9iakF0dHJpYnMpKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRoaXMub2JqR2xvYmFsW3JlZ2lvbl0uUGFyYW1ldGVyR3JvdXBzID0gYXJyO1xuICAgICAgICAvLyByZXNvbHZlKGAke3JlZ2lvbn0vcmRzX0Rlc2NyaWJlREJQYXJhbWV0ZXJHcm91cHNgKTtcbiAgICAgICAgbGV0IG9iakdsb2JhbCA9IHtcbiAgICAgICAgICAgIFtyZWdpb25dOiB7XG4gICAgICAgICAgICAgICAgUGFyYW1ldGVyR3JvdXBzOiBhcnJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmVzb2x2ZShvYmpHbG9iYWwpO1xuICAgIH0pO1xufTtcblxuXG5leHBvcnQgbGV0IHJkc19EZXNjcmliZU9wdGlvbkdyb3VwcyA9IChyZWdpb246IHN0cmluZywgY3JlZGVudGlhbHM6IEF3c0NyZWRlbnRpYWxJZGVudGl0eSwgc3ZjQ2FsbHNBbGw6IHN0cmluZ1tdLCBvYmpBdHRyaWJzOiB7fSwgY2F0Y2hlcjogX2NhdGNoZXIpID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgIHNlcnZpY2VDYWxsTWFuaWZlc3QgPSBzdmNDYWxsc0FsbDtcbiAgICAgICAgY29uc3QgY2xpZW50ID0gbmV3IFJEU0NsaWVudChcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZWdpb24sXG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbHMsXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgcENvbmZpZyA9IHtcbiAgICAgICAgICAgIGNsaWVudCxcbiAgICAgICAgICAgIHBhZ2VTaXplOiAxMDAsXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgY21kUGFyYW1zID0ge307XG5cbiAgICAgICAgY29uc3QgcGFnaW5hdG9yID0gcGFnaW5hdGVEZXNjcmliZU9wdGlvbkdyb3VwcyhwQ29uZmlnLCBjbWRQYXJhbXMpO1xuXG4gICAgICAgIGNvbnN0IGFyciA9IFtdO1xuICAgICAgICBjb25zdCBhcnIyID0gW107XG5cbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgZm9yIGF3YWl0IChjb25zdCBwYWdlIG9mIHBhZ2luYXRvcikge1xuICAgICAgICAgICAgICAgIGlmIChwYWdlLk9wdGlvbkdyb3Vwc0xpc3QpIGFyci5wdXNoKC4uLnBhZ2UuT3B0aW9uR3JvdXBzTGlzdCk7XG4gICAgICAgICAgICAgICAgYXJyMi5wdXNoKGNhdGNoZXIuaGFuZGxlKHBhZ2UuT3B0aW9uR3JvdXBzTGlzdCwgb2JqQXR0cmlicykpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdGhpcy5vYmpHbG9iYWxbcmVnaW9uXS5PcHRpb25Hcm91cHMgPSBhcnI7XG4gICAgICAgIC8vIHJlc29sdmUoYCR7cmVnaW9ufS9yZHNfRGVzY3JpYmVPcHRpb25Hcm91cHNgKTtcbiAgICAgICAgbGV0IG9iaiA9IHtcbiAgICAgICAgICAgIFtyZWdpb25dOiB7XG4gICAgICAgICAgICAgICAgT3B0aW9uR3JvdXBzOiBhcnJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmVzb2x2ZShvYmopO1xuICAgIH0pO1xufTtcblxuXG5leHBvcnQgbGV0IHJkc19EZXNjcmliZURCQ2x1c3RlcnMgPSAocmVnaW9uOiBzdHJpbmcsIGNyZWRlbnRpYWxzOiBBd3NDcmVkZW50aWFsSWRlbnRpdHksIHN2Y0NhbGxzQWxsOiBzdHJpbmdbXSwgb2JqQXR0cmliczoge30sIGNhdGNoZXI6IF9jYXRjaGVyKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgICBzZXJ2aWNlQ2FsbE1hbmlmZXN0ID0gc3ZjQ2FsbHNBbGw7XG4gICAgICAgIGNvbnN0IGNsaWVudCA9IG5ldyBSRFNDbGllbnQoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmVnaW9uLFxuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzLFxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IHBDb25maWcgPSB7XG4gICAgICAgICAgICBjbGllbnQsXG4gICAgICAgICAgICBwYWdlU2l6ZTogMTAwLFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGNtZFBhcmFtcyA9IHt9O1xuXG4gICAgICAgIGNvbnN0IHBhZ2luYXRvciA9IHBhZ2luYXRlRGVzY3JpYmVEQkNsdXN0ZXJzKHBDb25maWcsIGNtZFBhcmFtcyk7XG5cbiAgICAgICAgY29uc3QgYXJyID0gW107XG4gICAgICAgIGNvbnN0IGFycjIgPSBbXTtcblxuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBmb3IgYXdhaXQgKGNvbnN0IHBhZ2Ugb2YgcGFnaW5hdG9yKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhZ2UuREJDbHVzdGVycykgYXJyLnB1c2goLi4ucGFnZS5EQkNsdXN0ZXJzKTtcbiAgICAgICAgICAgICAgICBhcnIyLnB1c2goY2F0Y2hlci5oYW5kbGUocGFnZS5EQkNsdXN0ZXJzLCBvYmpBdHRyaWJzKSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0aGlzLm9iakdsb2JhbFtyZWdpb25dLkRCQ2x1c3RlcnMgPSBhcnI7XG4gICAgICAgIC8vIHJlc29sdmUoYCR7cmVnaW9ufS9yZHNfRGVzY3JpYmVEQkNsdXN0ZXJzYCk7XG4gICAgICAgIGxldCBvYmogPSB7XG4gICAgICAgICAgICBbcmVnaW9uXToge1xuICAgICAgICAgICAgICAgIERCQ2x1c3RlcnM6IGFyclxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXNvbHZlKG9iaik7XG4gICAgfSk7XG59O1xuXG5cbmV4cG9ydCBsZXQgcmRzX0Rlc2NyaWJlREJJbnN0YW5jZXMgPSAocmVnaW9uOiBzdHJpbmcsIGNyZWRlbnRpYWxzOiBBd3NDcmVkZW50aWFsSWRlbnRpdHksIHN2Y0NhbGxzQWxsOiBzdHJpbmdbXSwgb2JqQXR0cmliczoge30sIGNhdGNoZXI6IF9jYXRjaGVyKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgICBzZXJ2aWNlQ2FsbE1hbmlmZXN0ID0gc3ZjQ2FsbHNBbGw7XG4gICAgICAgIGNvbnN0IGNsaWVudCA9IG5ldyBSRFNDbGllbnQoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmVnaW9uLFxuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzLFxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IHBDb25maWcgPSB7XG4gICAgICAgICAgICBjbGllbnQsXG4gICAgICAgICAgICBwYWdlU2l6ZTogMTAwLFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGNtZFBhcmFtcyA9IHt9O1xuXG4gICAgICAgIGNvbnN0IHBhZ2luYXRvciA9IHBhZ2luYXRlRGVzY3JpYmVEQkluc3RhbmNlcyhwQ29uZmlnLCBjbWRQYXJhbXMpO1xuXG4gICAgICAgIGNvbnN0IGFyciA9IFtdO1xuICAgICAgICBjb25zdCBhcnIyID0gW107XG5cbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgZm9yIGF3YWl0IChjb25zdCBwYWdlIG9mIHBhZ2luYXRvcikge1xuICAgICAgICAgICAgICAgIGlmIChwYWdlLkRCSW5zdGFuY2VzKSBhcnIucHVzaCguLi5wYWdlLkRCSW5zdGFuY2VzKTtcbiAgICAgICAgICAgICAgICBhcnIyLnB1c2goY2F0Y2hlci5oYW5kbGUocGFnZS5EQkluc3RhbmNlcywgb2JqQXR0cmlicykpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRoaXMub2JqR2xvYmFsW3JlZ2lvbl0uREJJbnN0YW5jZXMgPSBhcnI7XG4gICAgICAgIC8vIHJlc29sdmUoYCR7cmVnaW9ufS9yZHNfRGVzY3JpYmVEQkluc3RhbmNlc2ApO1xuICAgICAgICBsZXQgb2JqID0ge1xuICAgICAgICAgICAgW3JlZ2lvbl06IHtcbiAgICAgICAgICAgICAgICBEQkluc3RhbmNlczogYXJyXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJlc29sdmUob2JqKTtcbiAgICB9KTtcbn07XG5cbiJdfQ==