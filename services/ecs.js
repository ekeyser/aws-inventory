'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ecs_ListTaskDefinitions = exports.ecs_ListClusters = exports.getPerms = void 0;
const client_ecs_1 = require("@aws-sdk/client-ecs");
let serviceCallManifest;
function getPerms() {
    return [
        {
            "service": "ecs",
            "call": "DescribeServices",
            "permission": "DescribeServices",
            "initiator": false
        },
        {
            "service": "ecs",
            "call": "ListServices",
            "permission": "ListServices",
            "initiator": false
        },
        {
            "service": "ecs",
            "call": "DescribeClusters",
            "permission": "DescribeClusters",
            "initiator": false
        },
        {
            "service": "ecs",
            "call": "ListClusters",
            "permission": "ListClusters",
            "initiator": true
        },
        {
            "service": "ecs",
            "call": "DescribeTaskDefinition",
            "permission": "DescribeTaskDefinition",
            "initiator": false
        },
        {
            "service": "ecs",
            "call": "ListTaskDefinitions",
            "permission": "ListTaskDefinitions",
            "initiator": true
        }
    ];
}
exports.getPerms = getPerms;
let ecs_DescribeServices = (cluster, services, client, region, objAttribs, catcher) => {
    return new Promise((resolve, reject) => {
        let obj = {
            [region]: {
                ECSServices: []
            }
        };
        client.send(new client_ecs_1.DescribeServicesCommand({
            cluster,
            services
        }))
            .then((data) => {
            if (data.services) {
                data.services.forEach((service) => {
                    obj[region].ECSServices.push(service);
                });
            }
            resolve(obj);
        })
            .catch((e) => {
            reject(e);
        });
    });
};
let ecs_ListClusterServices = (cluster, client, region, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {
        const pConfig = {
            client,
            pageSize: 100,
        };
        const cmdParams = {
            cluster: cluster.clusterArn
        };
        const paginator = (0, client_ecs_1.paginateListServices)(pConfig, cmdParams);
        const arr = [];
        try {
            for await (const page of paginator) {
                if (page.serviceArns)
                    arr.push(...page.serviceArns);
            }
        }
        catch (e) {
            reject(e);
        }
        let arr2 = [];
        if (arr.length > 0) {
            if (cluster.clusterArn)
                arr2.push(ecs_DescribeServices(cluster.clusterArn, arr, client, region, objAttribs, catcher));
        }
        Promise.all(arr2)
            .then((aP) => {
            let obj = {
                [region]: {
                    ECSServices: arr
                }
            };
            resolve(obj);
        });
    });
};
let ecs_DescribeClusters = (clusters, client, region, objAttribs, catcher) => {
    return new Promise((resolve, reject) => {
        client.send(new client_ecs_1.DescribeClustersCommand({
            clusters,
            include: [
                'ATTACHMENTS',
            ],
        }))
            .then((data) => {
            if (data.clusters) {
                data.clusters.forEach((cluster) => {
                    ecs_ListClusterServices(cluster, client, region, objAttribs, catcher);
                });
            }
            resolve(data);
        })
            .catch((e) => {
            reject(e);
        });
    });
};
let ecs_ListClusters = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {
        serviceCallManifest = svcCallsAll;
        const client = new client_ecs_1.ECSClient({
            region,
            credentials
        });
        const pConfig = {
            client,
            pageSize: 100,
        };
        const cmdParams = {};
        const paginator = (0, client_ecs_1.paginateListClusters)(pConfig, cmdParams);
        const arr = [];
        const _arrC = [];
        try {
            for await (const page of paginator) {
                if (page.clusterArns)
                    arr.push(...page.clusterArns);
                _arrC.push(catcher.handle(page.clusterArns, objAttribs));
            }
        }
        catch (e) {
            reject(e);
        }
        let arr2 = [];
        arr2.push(ecs_DescribeClusters(arr, client, region, objAttribs, catcher));
        Promise.all(arr2)
            .then((aP) => {
            let obj = {
                [region]: {
                    ECSClusters: arr
                }
            };
            resolve(obj);
        })
            .catch((e) => {
            reject(e);
        });
    });
};
exports.ecs_ListClusters = ecs_ListClusters;
let ecs_DescribeTaskDefinition = (taskDefinitionArn, client, objAttribs, catcher) => {
    return new Promise((resolve, reject) => {
        client.send(new client_ecs_1.DescribeTaskDefinitionCommand({
            taskDefinition: taskDefinitionArn,
        }))
            .then((data) => {
            resolve(data.taskDefinition);
        })
            .catch((err) => {
            reject(err);
        });
    });
};
let ecs_ListTaskDefinitions = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {
        serviceCallManifest = svcCallsAll;
        const client = new client_ecs_1.ECSClient({
            region,
            credentials
        });
        const pConfig = {
            client,
            pageSize: 100,
        };
        const cmdParams = {};
        const paginator = (0, client_ecs_1.paginateListTaskDefinitions)(pConfig, cmdParams);
        const arr = [];
        const _arrC = [];
        try {
            for await (const page of paginator) {
                if (page.taskDefinitionArns)
                    arr.push(...page.taskDefinitionArns);
                _arrC.push(catcher.handle(page.taskDefinitionArns, objAttribs));
            }
        }
        catch (e) {
            reject(e);
        }
        const arrTaskDefinitions = [];
        for (let i = 0; i < arr.length; i++) {
            let taskDefArn = arr[i];
            let taskDefinition = await ecs_DescribeTaskDefinition(taskDefArn, client, objAttribs, catcher);
            arrTaskDefinitions.push(taskDefinition);
        }
        let obj = {
            [region]: {
                TaskDefinitions: arrTaskDefinitions
            }
        };
        resolve(obj);
    });
};
exports.ecs_ListTaskDefinitions = ecs_ListTaskDefinitions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZWNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7O0FBRWIsb0RBUzZCO0FBRzdCLElBQUksbUJBQW1CLENBQUM7QUFNeEIsU0FBZ0IsUUFBUTtJQUNwQixPQUFPO1FBQ0g7WUFDSSxTQUFTLEVBQUUsS0FBSztZQUNoQixNQUFNLEVBQUUsa0JBQWtCO1lBQzFCLFlBQVksRUFBRSxrQkFBa0I7WUFDaEMsV0FBVyxFQUFFLEtBQUs7U0FDckI7UUFDRDtZQUNJLFNBQVMsRUFBRSxLQUFLO1lBQ2hCLE1BQU0sRUFBRSxjQUFjO1lBQ3RCLFlBQVksRUFBRSxjQUFjO1lBQzVCLFdBQVcsRUFBRSxLQUFLO1NBQ3JCO1FBQ0Q7WUFDSSxTQUFTLEVBQUUsS0FBSztZQUNoQixNQUFNLEVBQUUsa0JBQWtCO1lBQzFCLFlBQVksRUFBRSxrQkFBa0I7WUFDaEMsV0FBVyxFQUFFLEtBQUs7U0FDckI7UUFDRDtZQUNJLFNBQVMsRUFBRSxLQUFLO1lBQ2hCLE1BQU0sRUFBRSxjQUFjO1lBQ3RCLFlBQVksRUFBRSxjQUFjO1lBQzVCLFdBQVcsRUFBRSxJQUFJO1NBQ3BCO1FBQ0Q7WUFDSSxTQUFTLEVBQUUsS0FBSztZQUNoQixNQUFNLEVBQUUsd0JBQXdCO1lBQ2hDLFlBQVksRUFBRSx3QkFBd0I7WUFDdEMsV0FBVyxFQUFFLEtBQUs7U0FDckI7UUFDRDtZQUNJLFNBQVMsRUFBRSxLQUFLO1lBQ2hCLE1BQU0sRUFBRSxxQkFBcUI7WUFDN0IsWUFBWSxFQUFFLHFCQUFxQjtZQUNuQyxXQUFXLEVBQUUsSUFBSTtTQUNwQjtLQUNKLENBQUM7QUFDTixDQUFDO0FBdkNELDRCQXVDQztBQUdELElBQUksb0JBQW9CLEdBQUcsQ0FBQyxPQUFlLEVBQUUsUUFBa0IsRUFBRSxNQUFpQixFQUFFLE1BQWMsRUFBRSxVQUFjLEVBQUUsT0FBaUIsRUFBRSxFQUFFO0lBQ3JJLE9BQU8sSUFBSSxPQUFPLENB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QUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7YUFDbkU7U0FDSjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1IsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2I7UUFFRCxNQUFNLGtCQUFrQixHQUFHLEVBQUUsQ0FBQTtRQUM3QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNqQyxJQUFJLFVBQVUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsSUFBSSxjQUFjLEdBQUcsTUFBTSwwQkFBMEIsQ0FBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUMvRixrQkFBa0IsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDM0M7UUFFRCxJQUFJLEdBQUcsR0FBRztZQUNOLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ04sZUFBZSxFQUFFLGtCQUFrQjthQUN0QztTQUNKLENBQUM7UUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDakIsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUM7QUEvQ1MsUUFBQSx1QkFBdUIsMkJBK0NoQyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtcbiAgICBFQ1NDbGllbnQsXG4gICAgRGVzY3JpYmVDbHVzdGVyc0NvbW1hbmQsXG4gICAgRGVzY3JpYmVTZXJ2aWNlc0NvbW1hbmQsXG4gICAgRGVzY3JpYmVUYXNrRGVmaW5pdGlvbkNvbW1hbmQsXG4gICAgcGFnaW5hdGVMaXN0Q2x1c3RlcnMsXG4gICAgcGFnaW5hdGVMaXN0U2VydmljZXMsXG4gICAgcGFnaW5hdGVMaXN0VGFza0RlZmluaXRpb25zLFxuICAgIHBhZ2luYXRlTGlzdFRhc2tzLCBTZXJ2aWNlLCBDbHVzdGVyLFxufSBmcm9tIFwiQGF3cy1zZGsvY2xpZW50LWVjc1wiO1xuaW1wb3J0IHtBd3NDcmVkZW50aWFsSWRlbnRpdHl9IGZyb20gXCJAYXdzLXNkay90eXBlc1wiO1xuXG5sZXQgc2VydmljZUNhbGxNYW5pZmVzdDtcblxuaW50ZXJmYWNlIF9jYXRjaGVyIHtcbiAgICBoYW5kbGU6IEZ1bmN0aW9uLFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGVybXMoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICAge1xuICAgICAgICAgICAgXCJzZXJ2aWNlXCI6IFwiZWNzXCIsXG4gICAgICAgICAgICBcImNhbGxcIjogXCJEZXNjcmliZVNlcnZpY2VzXCIsXG4gICAgICAgICAgICBcInBlcm1pc3Npb25cIjogXCJEZXNjcmliZVNlcnZpY2VzXCIsXG4gICAgICAgICAgICBcImluaXRpYXRvclwiOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInNlcnZpY2VcIjogXCJlY3NcIixcbiAgICAgICAgICAgIFwiY2FsbFwiOiBcIkxpc3RTZXJ2aWNlc1wiLFxuICAgICAgICAgICAgXCJwZXJtaXNzaW9uXCI6IFwiTGlzdFNlcnZpY2VzXCIsXG4gICAgICAgICAgICBcImluaXRpYXRvclwiOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInNlcnZpY2VcIjogXCJlY3NcIixcbiAgICAgICAgICAgIFwiY2FsbFwiOiBcIkRlc2NyaWJlQ2x1c3RlcnNcIixcbiAgICAgICAgICAgIFwicGVybWlzc2lvblwiOiBcIkRlc2NyaWJlQ2x1c3RlcnNcIixcbiAgICAgICAgICAgIFwiaW5pdGlhdG9yXCI6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwic2VydmljZVwiOiBcImVjc1wiLFxuICAgICAgICAgICAgXCJjYWxsXCI6IFwiTGlzdENsdXN0ZXJzXCIsXG4gICAgICAgICAgICBcInBlcm1pc3Npb25cIjogXCJMaXN0Q2x1c3RlcnNcIixcbiAgICAgICAgICAgIFwiaW5pdGlhdG9yXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJzZXJ2aWNlXCI6IFwiZWNzXCIsXG4gICAgICAgICAgICBcImNhbGxcIjogXCJEZXNjcmliZVRhc2tEZWZpbml0aW9uXCIsXG4gICAgICAgICAgICBcInBlcm1pc3Npb25cIjogXCJEZXNjcmliZVRhc2tEZWZpbml0aW9uXCIsXG4gICAgICAgICAgICBcImluaXRpYXRvclwiOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInNlcnZpY2VcIjogXCJlY3NcIixcbiAgICAgICAgICAgIFwiY2FsbFwiOiBcIkxpc3RUYXNrRGVmaW5pdGlvbnNcIixcbiAgICAgICAgICAgIFwicGVybWlzc2lvblwiOiBcIkxpc3RUYXNrRGVmaW5pdGlvbnNcIixcbiAgICAgICAgICAgIFwiaW5pdGlhdG9yXCI6IHRydWVcbiAgICAgICAgfVxuICAgIF07XG59XG5cblxubGV0IGVjc19EZXNjcmliZVNlcnZpY2VzID0gKGNsdXN0ZXI6IHN0cmluZywgc2VydmljZXM6IHN0cmluZ1tdLCBjbGllbnQ6IEVDU0NsaWVudCwgcmVnaW9uOiBzdHJpbmcsIG9iakF0dHJpYnM6IHt9LCBjYXRjaGVyOiBfY2F0Y2hlcikgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgbGV0IG9iajoge1xuICAgICAgICAgICAgW3JlZ2lvbjogc3RyaW5nXToge1xuICAgICAgICAgICAgICAgIEVDU1NlcnZpY2VzOiBTZXJ2aWNlW11cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0gPSB7XG4gICAgICAgICAgICBbcmVnaW9uXToge1xuICAgICAgICAgICAgICAgIEVDU1NlcnZpY2VzOiBbXVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBjbGllbnQuc2VuZChuZXcgRGVzY3JpYmVTZXJ2aWNlc0NvbW1hbmQoe1xuICAgICAgICAgICAgY2x1c3RlcixcbiAgICAgICAgICAgIHNlcnZpY2VzXG4gICAgICAgIH0pKVxuICAgICAgICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5zZXJ2aWNlcykge1xuXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuc2VydmljZXMuZm9yRWFjaCgoc2VydmljZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqW3JlZ2lvbl0uRUNTU2VydmljZXMucHVzaChzZXJ2aWNlKTtcblxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShvYmopO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xufTtcblxuXG5sZXQgZWNzX0xpc3RDbHVzdGVyU2VydmljZXMgPSAoY2x1c3RlcjogQ2x1c3RlciwgY2xpZW50OiBFQ1NDbGllbnQsIHJlZ2lvbjogc3RyaW5nLCBvYmpBdHRyaWJzOiB7fSwgY2F0Y2hlcjogX2NhdGNoZXIpID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgIGNvbnN0IHBDb25maWcgPSB7XG4gICAgICAgICAgICBjbGllbnQsXG4gICAgICAgICAgICBwYWdlU2l6ZTogMTAwLFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGNtZFBhcmFtcyA9IHtcbiAgICAgICAgICAgIGNsdXN0ZXI6IGNsdXN0ZXIuY2x1c3RlckFyblxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHBhZ2luYXRvciA9IHBhZ2luYXRlTGlzdFNlcnZpY2VzKHBDb25maWcsIGNtZFBhcmFtcyk7XG5cbiAgICAgICAgY29uc3QgYXJyOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGZvciBhd2FpdCAoY29uc3QgcGFnZSBvZiBwYWdpbmF0b3IpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFnZS5zZXJ2aWNlQXJucykgYXJyLnB1c2goLi4ucGFnZS5zZXJ2aWNlQXJucyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgbGV0IGFycjIgPSBbXTtcblxuICAgICAgICBpZiAoYXJyLmxlbmd0aCA+IDApIHtcblxuICAgICAgICAgICAgaWYgKGNsdXN0ZXIuY2x1c3RlckFybikgYXJyMi5wdXNoKGVjc19EZXNjcmliZVNlcnZpY2VzKGNsdXN0ZXIuY2x1c3RlckFybiwgYXJyLCBjbGllbnQsIHJlZ2lvbiwgb2JqQXR0cmlicywgY2F0Y2hlcikpO1xuXG4gICAgICAgIH1cblxuXG4gICAgICAgIFByb21pc2UuYWxsKGFycjIpXG4gICAgICAgICAgICAudGhlbigoYVApID0+IHtcblxuICAgICAgICAgICAgICAgIGxldCBvYmogPSB7XG4gICAgICAgICAgICAgICAgICAgIFtyZWdpb25dOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBFQ1NTZXJ2aWNlczogYXJyXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJlc29sdmUob2JqKTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICB9KTtcbn07XG5cblxubGV0IGVjc19EZXNjcmliZUNsdXN0ZXJzID0gKGNsdXN0ZXJzOiBzdHJpbmdbXSwgY2xpZW50OiBFQ1NDbGllbnQsIHJlZ2lvbjogc3RyaW5nLCBvYmpBdHRyaWJzOiB7fSwgY2F0Y2hlcjogX2NhdGNoZXIpID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgIGNsaWVudC5zZW5kKG5ldyBEZXNjcmliZUNsdXN0ZXJzQ29tbWFuZCh7XG4gICAgICAgICAgICBjbHVzdGVycyxcbiAgICAgICAgICAgIGluY2x1ZGU6IFtcbiAgICAgICAgICAgICAgICAnQVRUQUNITUVOVFMnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSkpXG4gICAgICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLmNsdXN0ZXJzKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgZGF0YS5jbHVzdGVycy5mb3JFYWNoKChjbHVzdGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlY3NfTGlzdENsdXN0ZXJTZXJ2aWNlcyhjbHVzdGVyLCBjbGllbnQsIHJlZ2lvbiwgb2JqQXR0cmlicywgY2F0Y2hlcik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuXG5cbmV4cG9ydCBsZXQgZWNzX0xpc3RDbHVzdGVycyA9IChyZWdpb246IHN0cmluZywgY3JlZGVudGlhbHM6IEF3c0NyZWRlbnRpYWxJZGVudGl0eSwgc3ZjQ2FsbHNBbGw6IHN0cmluZ1tdLCBvYmpBdHRyaWJzOiB7fSwgY2F0Y2hlcjogX2NhdGNoZXIpID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgIHNlcnZpY2VDYWxsTWFuaWZlc3QgPSBzdmNDYWxsc0FsbDtcbiAgICAgICAgY29uc3QgY2xpZW50ID0gbmV3IEVDU0NsaWVudChcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZWdpb24sXG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbHNcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCBwQ29uZmlnID0ge1xuICAgICAgICAgICAgY2xpZW50LFxuICAgICAgICAgICAgcGFnZVNpemU6IDEwMCxcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBjbWRQYXJhbXMgPSB7fTtcblxuICAgICAgICBjb25zdCBwYWdpbmF0b3IgPSBwYWdpbmF0ZUxpc3RDbHVzdGVycyhwQ29uZmlnLCBjbWRQYXJhbXMpO1xuXG4gICAgICAgIGNvbnN0IGFycjogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgY29uc3QgX2FyckMgPSBbXTtcblxuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBmb3IgYXdhaXQgKGNvbnN0IHBhZ2Ugb2YgcGFnaW5hdG9yKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhZ2UuY2x1c3RlckFybnMpIGFyci5wdXNoKC4uLnBhZ2UuY2x1c3RlckFybnMpO1xuICAgICAgICAgICAgICAgIF9hcnJDLnB1c2goY2F0Y2hlci5oYW5kbGUocGFnZS5jbHVzdGVyQXJucywgb2JqQXR0cmlicykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGxldCBhcnIyID0gW107XG4gICAgICAgIGFycjIucHVzaChlY3NfRGVzY3JpYmVDbHVzdGVycyhhcnIsIGNsaWVudCwgcmVnaW9uLCBvYmpBdHRyaWJzLCBjYXRjaGVyKSk7XG5cblxuICAgICAgICBQcm9taXNlLmFsbChhcnIyKVxuICAgICAgICAgICAgLnRoZW4oKGFQKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBsZXQgb2JqID0ge1xuICAgICAgICAgICAgICAgICAgICBbcmVnaW9uXToge1xuICAgICAgICAgICAgICAgICAgICAgICAgRUNTQ2x1c3RlcnM6IGFyclxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKG9iaik7XG5cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgIH0pO1xufTtcblxuXG5sZXQgZWNzX0Rlc2NyaWJlVGFza0RlZmluaXRpb24gPSAodGFza0RlZmluaXRpb25Bcm46IHN0cmluZywgY2xpZW50OiBFQ1NDbGllbnQsIG9iakF0dHJpYnM6IHt9LCBjYXRjaGVyOiBfY2F0Y2hlcikgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgY2xpZW50LnNlbmQobmV3IERlc2NyaWJlVGFza0RlZmluaXRpb25Db21tYW5kKFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRhc2tEZWZpbml0aW9uOiB0YXNrRGVmaW5pdGlvbkFybixcbiAgICAgICAgICAgIH1cbiAgICAgICAgKSlcbiAgICAgICAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhLnRhc2tEZWZpbml0aW9uKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuXG5cbmV4cG9ydCBsZXQgZWNzX0xpc3RUYXNrRGVmaW5pdGlvbnMgPSAocmVnaW9uOiBzdHJpbmcsIGNyZWRlbnRpYWxzOiBBd3NDcmVkZW50aWFsSWRlbnRpdHksIHN2Y0NhbGxzQWxsOiBzdHJpbmdbXSwgb2JqQXR0cmliczoge30sIGNhdGNoZXI6IF9jYXRjaGVyKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgICBzZXJ2aWNlQ2FsbE1hbmlmZXN0ID0gc3ZjQ2FsbHNBbGw7XG4gICAgICAgIGNvbnN0IGNsaWVudCA9IG5ldyBFQ1NDbGllbnQoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmVnaW9uLFxuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgcENvbmZpZyA9IHtcbiAgICAgICAgICAgIGNsaWVudCxcbiAgICAgICAgICAgIHBhZ2VTaXplOiAxMDAsXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgY21kUGFyYW1zID0ge307XG5cbiAgICAgICAgY29uc3QgcGFnaW5hdG9yID0gcGFnaW5hdGVMaXN0VGFza0RlZmluaXRpb25zKHBDb25maWcsIGNtZFBhcmFtcyk7XG5cbiAgICAgICAgY29uc3QgYXJyID0gW107XG4gICAgICAgIGNvbnN0IF9hcnJDID0gW107XG5cbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgZm9yIGF3YWl0IChjb25zdCBwYWdlIG9mIHBhZ2luYXRvcikge1xuICAgICAgICAgICAgICAgIGlmIChwYWdlLnRhc2tEZWZpbml0aW9uQXJucykgYXJyLnB1c2goLi4ucGFnZS50YXNrRGVmaW5pdGlvbkFybnMpO1xuICAgICAgICAgICAgICAgIF9hcnJDLnB1c2goY2F0Y2hlci5oYW5kbGUocGFnZS50YXNrRGVmaW5pdGlvbkFybnMsIG9iakF0dHJpYnMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYXJyVGFza0RlZmluaXRpb25zID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCB0YXNrRGVmQXJuID0gYXJyW2ldO1xuICAgICAgICAgICAgbGV0IHRhc2tEZWZpbml0aW9uID0gYXdhaXQgZWNzX0Rlc2NyaWJlVGFza0RlZmluaXRpb24odGFza0RlZkFybiwgY2xpZW50LCBvYmpBdHRyaWJzLCBjYXRjaGVyKTtcbiAgICAgICAgICAgIGFyclRhc2tEZWZpbml0aW9ucy5wdXNoKHRhc2tEZWZpbml0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBvYmogPSB7XG4gICAgICAgICAgICBbcmVnaW9uXToge1xuICAgICAgICAgICAgICAgIFRhc2tEZWZpbml0aW9uczogYXJyVGFza0RlZmluaXRpb25zXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJlc29sdmUob2JqKTtcbiAgICB9KTtcbn07XG4iXX0=