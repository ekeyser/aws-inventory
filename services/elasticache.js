'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.elasticache_DescribeReplicationGroups = exports.elasticache_DescribeCacheSubnetGroups = exports.elasticache_DescribeCacheClusters = exports.getPerms = void 0;
const client_elasticache_1 = require("@aws-sdk/client-elasticache");
let serviceCallManifest;
function getPerms() {
    return [
        {
            "service": "elasticache",
            "call": "DescribeCacheClusters",
            "permission": "DescribeCacheClusters",
            "initiator": true
        },
        {
            "service": "elasticache",
            "call": "DescribeReplicationGroups",
            "permission": "DescribeReplicationGroups",
            "initiator": true
        },
        {
            "service": "elasticache",
            "call": "DescribeCacheSubnetGroups",
            "permission": "DescribeCacheSubnetGroups",
            "initiator": true
        }
    ];
}
exports.getPerms = getPerms;
let elasticache_DescribeCacheClusters = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {
        serviceCallManifest = svcCallsAll;
        const client = new client_elasticache_1.ElastiCacheClient({
            region,
            credentials
        });
        const pConfig = {
            client,
            pageSize: 100,
        };
        const cmdParams = {
            ShowCacheNodeInfo: true,
            ShowCacheClustersNotInReplicationGroups: true,
        };
        const paginator = (0, client_elasticache_1.paginateDescribeCacheClusters)(pConfig, cmdParams);
        const arr = [];
        const _arrC = [];
        try {
            for await (const page of paginator) {
                if (page.CacheClusters)
                    arr.push(...page.CacheClusters);
                _arrC.push(catcher.handle(page.CacheClusters, objAttribs));
            }
        }
        catch (e) {
            reject(e);
        }
        // this.objGlobal[region].CacheClusters = arr;
        // resolve(`${region}/elasticache_DescribeCacheClusters`);
        let objGlobal = {
            [region]: {
                CacheClusters: arr
            }
        };
        resolve(objGlobal);
    });
};
exports.elasticache_DescribeCacheClusters = elasticache_DescribeCacheClusters;
let elasticache_DescribeCacheSubnetGroups = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {
        serviceCallManifest = svcCallsAll;
        const client = new client_elasticache_1.ElastiCacheClient({
            region,
            credentials
        });
        const pConfig = {
            client,
            pageSize: 100,
        };
        const cmdParams = {};
        const paginator = (0, client_elasticache_1.paginateDescribeCacheSubnetGroups)(pConfig, cmdParams);
        const arr = [];
        const _arrC = [];
        try {
            for await (const page of paginator) {
                if (page.CacheSubnetGroups)
                    arr.push(...page.CacheSubnetGroups);
                _arrC.push(catcher.handle(page.CacheSubnetGroups, objAttribs));
            }
        }
        catch (e) {
            reject(e);
        }
        // this.objGlobal[region].CacheSubnetGroups = arr;
        // resolve(`${region}/elasticache_DescribeCacheSubnetGroups`);
        let objGlobal = {
            [region]: {
                CacheSubnetGroups: arr
            }
        };
        resolve(objGlobal);
    });
};
exports.elasticache_DescribeCacheSubnetGroups = elasticache_DescribeCacheSubnetGroups;
let elasticache_DescribeReplicationGroups = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {
        serviceCallManifest = svcCallsAll;
        const client = new client_elasticache_1.ElastiCacheClient({
            region,
            credentials
        });
        const pConfig = {
            client,
            pageSize: 100,
        };
        const cmdParams = {};
        const paginator = (0, client_elasticache_1.paginateDescribeReplicationGroups)(pConfig, cmdParams);
        const arr = [];
        const _arrC = [];
        try {
            for await (const page of paginator) {
                if (page.ReplicationGroups)
                    arr.push(...page.ReplicationGroups);
                _arrC.push(catcher.handle(page.ReplicationGroups, objAttribs));
            }
        }
        catch (e) {
            reject(e);
        }
        // this.objGlobal[region].ReplicationGroups = arr;
        // resolve(`${region}/elasticache_DescribeReplicationGroups`);
        let objGlobal = {
            [region]: {
                ReplicationGroups: arr
            }
        };
        resolve(objGlobal);
    });
};
exports.elasticache_DescribeReplicationGroups = elasticache_DescribeReplicationGroups;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxhc3RpY2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlbGFzdGljYWNoZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7OztBQUViLG9FQUlxQztBQUdyQyxJQUFJLG1CQUFtQixDQUFDO0FBTXhCLFNBQWdCLFFBQVE7SUFDcEIsT0FBTztRQUNIO1lBQ0ksU0FBUyxFQUFFLGFBQWE7WUFDeEIsTUFBTSxFQUFFLHVCQUF1QjtZQUMvQixZQUFZLEVBQUUsdUJBQXVCO1lBQ3JDLFdBQVcsRUFBRSxJQUFJO1NBQ3BCO1FBQ0Q7WUFDSSxTQUFTLEVBQUUsYUFBYTtZQUN4QixNQUFNLEVBQUUsMkJBQTJCO1lBQ25DLFlBQVksRUFBRSwyQkFBMkI7WUFDekMsV0FBVyxFQUFFLElBQUk7U0FDcEI7UUFDRDtZQUNJLFNBQVMsRUFBRSxhQUFhO1lBQ3hCLE1BQU0sRUFBRSwyQkFBMkI7WUFDbkMsWUFBWSxFQUFFLDJCQUEyQjtZQUN6QyxXQUFXLEVBQUUsSUFBSTtTQUNwQjtLQUNKLENBQUM7QUFDTixDQUFDO0FBckJELDRCQXFCQztBQUdNLElBQUksaUNBQWlDLEdBQUcsQ0FBQyxNQUFjLEVBQUUsV0FBa0MsRUFBRSxXQUFxQixFQUFFLFVBQWMsRUFBRSxPQUFpQixFQUFFLEVBQUU7SUFDNUosT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBRXpDLG1CQUFtQixHQUFHLFdBQVcsQ0FBQztRQUNsQyxNQUFNLE1BQU0sR0FBRyxJQUFJLHNDQUFpQixDQUNoQztZQUNJLE1BQU07WUFDTixXQUFXO1NBQ2QsQ0FDSixDQUFDO1FBRUYsTUFBTSxPQUFPLEdBQUc7WUFDWixNQUFNO1lBQ04sUUFBUSxFQUFFLEdBQUc7U0FDaEIsQ0FBQztRQUVGLE1BQU0sU0FBUyxHQUFHO1lBQ2QsaUJBQWlCLEVBQUUsSUFBSTtZQUN2Qix1Q0FBdUMsRUFBRSxJQUFJO1NBQ2hELENBQUM7UUFFRixNQUFNLFNBQVMsR0FBRyxJQUFBLGtEQUE2QixFQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUVwRSxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDZixNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7UUFFakIsSUFBSTtZQUVBLElBQUksS0FBSyxFQUFFLE1BQU0sSUFBSSxJQUFJLFNBQVMsRUFBRTtnQkFDaEMsSUFBSSxJQUFJLENBQUMsYUFBYTtvQkFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUN4RCxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO2FBQzlEO1NBQ0o7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNSLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNiO1FBRUQsOENBQThDO1FBQzlDLDBEQUEwRDtRQUMxRCxJQUFJLFNBQVMsR0FBRztZQUNaLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ04sYUFBYSxFQUFFLEdBQUc7YUFDckI7U0FDSixDQUFDO1FBQ0YsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3ZCLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDO0FBN0NTLFFBQUEsaUNBQWlDLHFDQTZDMUM7QUFHSyxJQUFJLHFDQUFxQyxHQUFHLENBQUMsTUFBYyxFQUFFLFdBQWtDLEVBQUUsV0FBcUIsRUFBRSxVQUFjLEVBQUUsT0FBaUIsRUFBRSxFQUFFO0lBQ2hLLE9BQU8sSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUV6QyxtQkFBbUIsR0FBRyxXQUFXLENBQUM7UUFDbEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxzQ0FBaUIsQ0FDaEM7WUFDSSxNQUFNO1lBQ04sV0FBVztTQUNkLENBQ0osQ0FBQztRQUVGLE1BQU0sT0FBTyxHQUFHO1lBQ1osTUFBTTtZQUNOLFFBQVEsRUFBRSxHQUFHO1NBQ2hCLENBQUM7UUFFRixNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFFckIsTUFBTSxTQUFTLEdBQUcsSUFBQSxzREFBaUMsRUFBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFeEUsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2YsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBRWpCLElBQUk7WUFFQSxJQUFJLEtBQUssRUFBRSxNQUFNLElBQUksSUFBSSxTQUFTLEVBQUU7Z0JBQ2hDLElBQUksSUFBSSxDQUFDLGlCQUFpQjtvQkFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQ2hFLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQzthQUNsRTtTQUVKO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDUixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDYjtRQUVELGtEQUFrRDtRQUNsRCw4REFBOEQ7UUFDOUQsSUFBSSxTQUFTLEdBQUc7WUFDWixDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUNOLGlCQUFpQixFQUFFLEdBQUc7YUFDekI7U0FDSixDQUFDO1FBQ0YsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3ZCLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDO0FBM0NTLFFBQUEscUNBQXFDLHlDQTJDOUM7QUFHSyxJQUFJLHFDQUFxQyxHQUFHLENBQUMsTUFBYyxFQUFFLFdBQWtDLEVBQUUsV0FBcUIsRUFBRSxVQUFjLEVBQUUsT0FBaUIsRUFBRSxFQUFFO0lBQ2hLLE9BQU8sSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUV6QyxtQkFBbUIsR0FBRyxXQUFXLENBQUM7UUFDbEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxzQ0FBaUIsQ0FDaEM7WUFDSSxNQUFNO1lBQ04sV0FBVztTQUNkLENBQ0osQ0FBQztRQUVGLE1BQU0sT0FBTyxHQUFHO1lBQ1osTUFBTTtZQUNOLFFBQVEsRUFBRSxHQUFHO1NBQ2hCLENBQUM7UUFFRixNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFFckIsTUFBTSxTQUFTLEdBQUcsSUFBQSxzREFBaUMsRUFBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFeEUsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2YsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBRWpCLElBQUk7WUFFQSxJQUFJLEtBQUssRUFBRSxNQUFNLElBQUksSUFBSSxTQUFTLEVBQUU7Z0JBQ2hDLElBQUksSUFBSSxDQUFDLGlCQUFpQjtvQkFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQ2hFLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQzthQUNsRTtTQUVKO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDUixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDYjtRQUVELGtEQUFrRDtRQUNsRCw4REFBOEQ7UUFDOUQsSUFBSSxTQUFTLEdBQUc7WUFDWixDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUNOLGlCQUFpQixFQUFFLEdBQUc7YUFDekI7U0FDSixDQUFDO1FBQ0YsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3ZCLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDO0FBM0NTLFFBQUEscUNBQXFDLHlDQTJDOUMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7XG4gICAgRWxhc3RpQ2FjaGVDbGllbnQsXG4gICAgcGFnaW5hdGVEZXNjcmliZUNhY2hlQ2x1c3RlcnMsXG4gICAgcGFnaW5hdGVEZXNjcmliZUNhY2hlU3VibmV0R3JvdXBzLCBwYWdpbmF0ZURlc2NyaWJlUmVwbGljYXRpb25Hcm91cHNcbn0gZnJvbSBcIkBhd3Mtc2RrL2NsaWVudC1lbGFzdGljYWNoZVwiO1xuaW1wb3J0IHtBd3NDcmVkZW50aWFsSWRlbnRpdHl9IGZyb20gXCJAYXdzLXNkay90eXBlc1wiO1xuXG5sZXQgc2VydmljZUNhbGxNYW5pZmVzdDtcblxuaW50ZXJmYWNlIF9jYXRjaGVyIHtcbiAgICBoYW5kbGU6IEZ1bmN0aW9uLFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGVybXMoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICAge1xuICAgICAgICAgICAgXCJzZXJ2aWNlXCI6IFwiZWxhc3RpY2FjaGVcIixcbiAgICAgICAgICAgIFwiY2FsbFwiOiBcIkRlc2NyaWJlQ2FjaGVDbHVzdGVyc1wiLFxuICAgICAgICAgICAgXCJwZXJtaXNzaW9uXCI6IFwiRGVzY3JpYmVDYWNoZUNsdXN0ZXJzXCIsXG4gICAgICAgICAgICBcImluaXRpYXRvclwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwic2VydmljZVwiOiBcImVsYXN0aWNhY2hlXCIsXG4gICAgICAgICAgICBcImNhbGxcIjogXCJEZXNjcmliZVJlcGxpY2F0aW9uR3JvdXBzXCIsXG4gICAgICAgICAgICBcInBlcm1pc3Npb25cIjogXCJEZXNjcmliZVJlcGxpY2F0aW9uR3JvdXBzXCIsXG4gICAgICAgICAgICBcImluaXRpYXRvclwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwic2VydmljZVwiOiBcImVsYXN0aWNhY2hlXCIsXG4gICAgICAgICAgICBcImNhbGxcIjogXCJEZXNjcmliZUNhY2hlU3VibmV0R3JvdXBzXCIsXG4gICAgICAgICAgICBcInBlcm1pc3Npb25cIjogXCJEZXNjcmliZUNhY2hlU3VibmV0R3JvdXBzXCIsXG4gICAgICAgICAgICBcImluaXRpYXRvclwiOiB0cnVlXG4gICAgICAgIH1cbiAgICBdO1xufVxuXG5cbmV4cG9ydCBsZXQgZWxhc3RpY2FjaGVfRGVzY3JpYmVDYWNoZUNsdXN0ZXJzID0gKHJlZ2lvbjogc3RyaW5nLCBjcmVkZW50aWFsczogQXdzQ3JlZGVudGlhbElkZW50aXR5LCBzdmNDYWxsc0FsbDogc3RyaW5nW10sIG9iakF0dHJpYnM6IHt9LCBjYXRjaGVyOiBfY2F0Y2hlcikgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgc2VydmljZUNhbGxNYW5pZmVzdCA9IHN2Y0NhbGxzQWxsO1xuICAgICAgICBjb25zdCBjbGllbnQgPSBuZXcgRWxhc3RpQ2FjaGVDbGllbnQoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmVnaW9uLFxuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgcENvbmZpZyA9IHtcbiAgICAgICAgICAgIGNsaWVudCxcbiAgICAgICAgICAgIHBhZ2VTaXplOiAxMDAsXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgY21kUGFyYW1zID0ge1xuICAgICAgICAgICAgU2hvd0NhY2hlTm9kZUluZm86IHRydWUsXG4gICAgICAgICAgICBTaG93Q2FjaGVDbHVzdGVyc05vdEluUmVwbGljYXRpb25Hcm91cHM6IHRydWUsXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgcGFnaW5hdG9yID0gcGFnaW5hdGVEZXNjcmliZUNhY2hlQ2x1c3RlcnMocENvbmZpZywgY21kUGFyYW1zKTtcblxuICAgICAgICBjb25zdCBhcnIgPSBbXTtcbiAgICAgICAgY29uc3QgX2FyckMgPSBbXTtcblxuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBmb3IgYXdhaXQgKGNvbnN0IHBhZ2Ugb2YgcGFnaW5hdG9yKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhZ2UuQ2FjaGVDbHVzdGVycykgYXJyLnB1c2goLi4ucGFnZS5DYWNoZUNsdXN0ZXJzKTtcbiAgICAgICAgICAgICAgICBfYXJyQy5wdXNoKGNhdGNoZXIuaGFuZGxlKHBhZ2UuQ2FjaGVDbHVzdGVycywgb2JqQXR0cmlicykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0aGlzLm9iakdsb2JhbFtyZWdpb25dLkNhY2hlQ2x1c3RlcnMgPSBhcnI7XG4gICAgICAgIC8vIHJlc29sdmUoYCR7cmVnaW9ufS9lbGFzdGljYWNoZV9EZXNjcmliZUNhY2hlQ2x1c3RlcnNgKTtcbiAgICAgICAgbGV0IG9iakdsb2JhbCA9IHtcbiAgICAgICAgICAgIFtyZWdpb25dOiB7XG4gICAgICAgICAgICAgICAgQ2FjaGVDbHVzdGVyczogYXJyXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJlc29sdmUob2JqR2xvYmFsKTtcbiAgICB9KTtcbn07XG5cblxuZXhwb3J0IGxldCBlbGFzdGljYWNoZV9EZXNjcmliZUNhY2hlU3VibmV0R3JvdXBzID0gKHJlZ2lvbjogc3RyaW5nLCBjcmVkZW50aWFsczogQXdzQ3JlZGVudGlhbElkZW50aXR5LCBzdmNDYWxsc0FsbDogc3RyaW5nW10sIG9iakF0dHJpYnM6IHt9LCBjYXRjaGVyOiBfY2F0Y2hlcikgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgc2VydmljZUNhbGxNYW5pZmVzdCA9IHN2Y0NhbGxzQWxsO1xuICAgICAgICBjb25zdCBjbGllbnQgPSBuZXcgRWxhc3RpQ2FjaGVDbGllbnQoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmVnaW9uLFxuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgcENvbmZpZyA9IHtcbiAgICAgICAgICAgIGNsaWVudCxcbiAgICAgICAgICAgIHBhZ2VTaXplOiAxMDAsXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgY21kUGFyYW1zID0ge307XG5cbiAgICAgICAgY29uc3QgcGFnaW5hdG9yID0gcGFnaW5hdGVEZXNjcmliZUNhY2hlU3VibmV0R3JvdXBzKHBDb25maWcsIGNtZFBhcmFtcyk7XG5cbiAgICAgICAgY29uc3QgYXJyID0gW107XG4gICAgICAgIGNvbnN0IF9hcnJDID0gW107XG5cbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgZm9yIGF3YWl0IChjb25zdCBwYWdlIG9mIHBhZ2luYXRvcikge1xuICAgICAgICAgICAgICAgIGlmIChwYWdlLkNhY2hlU3VibmV0R3JvdXBzKSBhcnIucHVzaCguLi5wYWdlLkNhY2hlU3VibmV0R3JvdXBzKTtcbiAgICAgICAgICAgICAgICBfYXJyQy5wdXNoKGNhdGNoZXIuaGFuZGxlKHBhZ2UuQ2FjaGVTdWJuZXRHcm91cHMsIG9iakF0dHJpYnMpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0aGlzLm9iakdsb2JhbFtyZWdpb25dLkNhY2hlU3VibmV0R3JvdXBzID0gYXJyO1xuICAgICAgICAvLyByZXNvbHZlKGAke3JlZ2lvbn0vZWxhc3RpY2FjaGVfRGVzY3JpYmVDYWNoZVN1Ym5ldEdyb3Vwc2ApO1xuICAgICAgICBsZXQgb2JqR2xvYmFsID0ge1xuICAgICAgICAgICAgW3JlZ2lvbl06IHtcbiAgICAgICAgICAgICAgICBDYWNoZVN1Ym5ldEdyb3VwczogYXJyXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJlc29sdmUob2JqR2xvYmFsKTtcbiAgICB9KTtcbn07XG5cblxuZXhwb3J0IGxldCBlbGFzdGljYWNoZV9EZXNjcmliZVJlcGxpY2F0aW9uR3JvdXBzID0gKHJlZ2lvbjogc3RyaW5nLCBjcmVkZW50aWFsczogQXdzQ3JlZGVudGlhbElkZW50aXR5LCBzdmNDYWxsc0FsbDogc3RyaW5nW10sIG9iakF0dHJpYnM6IHt9LCBjYXRjaGVyOiBfY2F0Y2hlcikgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgc2VydmljZUNhbGxNYW5pZmVzdCA9IHN2Y0NhbGxzQWxsO1xuICAgICAgICBjb25zdCBjbGllbnQgPSBuZXcgRWxhc3RpQ2FjaGVDbGllbnQoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmVnaW9uLFxuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgcENvbmZpZyA9IHtcbiAgICAgICAgICAgIGNsaWVudCxcbiAgICAgICAgICAgIHBhZ2VTaXplOiAxMDAsXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgY21kUGFyYW1zID0ge307XG5cbiAgICAgICAgY29uc3QgcGFnaW5hdG9yID0gcGFnaW5hdGVEZXNjcmliZVJlcGxpY2F0aW9uR3JvdXBzKHBDb25maWcsIGNtZFBhcmFtcyk7XG5cbiAgICAgICAgY29uc3QgYXJyID0gW107XG4gICAgICAgIGNvbnN0IF9hcnJDID0gW107XG5cbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgZm9yIGF3YWl0IChjb25zdCBwYWdlIG9mIHBhZ2luYXRvcikge1xuICAgICAgICAgICAgICAgIGlmIChwYWdlLlJlcGxpY2F0aW9uR3JvdXBzKSBhcnIucHVzaCguLi5wYWdlLlJlcGxpY2F0aW9uR3JvdXBzKTtcbiAgICAgICAgICAgICAgICBfYXJyQy5wdXNoKGNhdGNoZXIuaGFuZGxlKHBhZ2UuUmVwbGljYXRpb25Hcm91cHMsIG9iakF0dHJpYnMpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0aGlzLm9iakdsb2JhbFtyZWdpb25dLlJlcGxpY2F0aW9uR3JvdXBzID0gYXJyO1xuICAgICAgICAvLyByZXNvbHZlKGAke3JlZ2lvbn0vZWxhc3RpY2FjaGVfRGVzY3JpYmVSZXBsaWNhdGlvbkdyb3Vwc2ApO1xuICAgICAgICBsZXQgb2JqR2xvYmFsID0ge1xuICAgICAgICAgICAgW3JlZ2lvbl06IHtcbiAgICAgICAgICAgICAgICBSZXBsaWNhdGlvbkdyb3VwczogYXJyXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJlc29sdmUob2JqR2xvYmFsKTtcbiAgICB9KTtcbn07XG4iXX0=