'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudwatch_DescribeAlarms = exports.getPerms = void 0;
const client_cloudwatch_1 = require("@aws-sdk/client-cloudwatch");
let serviceCallManifest;
function getPerms() {
    return [
        {
            "service": "cloudwatch",
            "call": "DescribeAlarms",
            "permission": "DescribeAlarms",
            "initiator": true
        }
    ];
}
exports.getPerms = getPerms;
let cloudwatch_DescribeAlarms = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {
        serviceCallManifest = svcCallsAll;
        const client = new client_cloudwatch_1.CloudWatchClient({
            region,
            credentials
        });
        const pConfig = {
            client,
            pageSize: 100,
        };
        const cmdParams = {};
        const paginator = (0, client_cloudwatch_1.paginateDescribeAlarms)(pConfig, cmdParams);
        const arr = [];
        const _arrC = [];
        try {
            for await (const page of paginator) {
                if (page.MetricAlarms)
                    arr.push(...page.MetricAlarms);
                _arrC.push(catcher.handle(page.MetricAlarms, objAttribs));
            }
        }
        catch (e) {
            reject(e);
        }
        // this.objGlobal[region].MetricAlarms = arr;
        // resolve(`${region}/cloudwatch_DescribeAlarms`);
        let obj = {
            [region]: {
                MetricAlarms: arr
            }
        };
        resolve(obj);
    });
};
exports.cloudwatch_DescribeAlarms = cloudwatch_DescribeAlarms;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xvdWR3YXRjaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsb3Vkd2F0Y2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7QUFFYixrRUFBb0Y7QUFHcEYsSUFBSSxtQkFBbUIsQ0FBQztBQU14QixTQUFnQixRQUFRO0lBQ3BCLE9BQU87UUFDSDtZQUNJLFNBQVMsRUFBRSxZQUFZO1lBQ3ZCLE1BQU0sRUFBRSxnQkFBZ0I7WUFDeEIsWUFBWSxFQUFFLGdCQUFnQjtZQUM5QixXQUFXLEVBQUUsSUFBSTtTQUNwQjtLQUNKLENBQUM7QUFDTixDQUFDO0FBVEQsNEJBU0M7QUFHTSxJQUFJLHlCQUF5QixHQUFHLENBQUMsTUFBYyxFQUFFLFdBQWtDLEVBQUUsV0FBcUIsRUFBRSxVQUFjLEVBQUUsT0FBaUIsRUFBRSxFQUFFO0lBQ3BKLE9BQU8sSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUV6QyxtQkFBbUIsR0FBRyxXQUFXLENBQUM7UUFDbEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxvQ0FBZ0IsQ0FDL0I7WUFDSSxNQUFNO1lBQ04sV0FBVztTQUNkLENBQ0osQ0FBQztRQUVGLE1BQU0sT0FBTyxHQUFHO1lBQ1osTUFBTTtZQUNOLFFBQVEsRUFBRSxHQUFHO1NBQ2hCLENBQUM7UUFFRixNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFFckIsTUFBTSxTQUFTLEdBQUcsSUFBQSwwQ0FBc0IsRUFBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFN0QsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2YsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBRWpCLElBQUk7WUFFQSxJQUFJLEtBQUssRUFBRSxNQUFNLElBQUksSUFBSSxTQUFTLEVBQUU7Z0JBQ2hDLElBQUksSUFBSSxDQUFDLFlBQVk7b0JBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDdEQsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQzthQUM3RDtTQUVKO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDUixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDYjtRQUVELDZDQUE2QztRQUM3QyxrREFBa0Q7UUFDbEQsSUFBSSxHQUFHLEdBQUc7WUFDTixDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUNOLFlBQVksRUFBRSxHQUFHO2FBQ3BCO1NBQ0osQ0FBQztRQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqQixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQztBQTNDUyxRQUFBLHlCQUF5Qiw2QkEyQ2xDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge0Nsb3VkV2F0Y2hDbGllbnQsIHBhZ2luYXRlRGVzY3JpYmVBbGFybXN9IGZyb20gXCJAYXdzLXNkay9jbGllbnQtY2xvdWR3YXRjaFwiO1xuaW1wb3J0IHtBd3NDcmVkZW50aWFsSWRlbnRpdHl9IGZyb20gXCJAYXdzLXNkay90eXBlc1wiO1xuXG5sZXQgc2VydmljZUNhbGxNYW5pZmVzdDtcblxuaW50ZXJmYWNlIF9jYXRjaGVyIHtcbiAgICBoYW5kbGU6IEZ1bmN0aW9uLFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGVybXMoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICAge1xuICAgICAgICAgICAgXCJzZXJ2aWNlXCI6IFwiY2xvdWR3YXRjaFwiLFxuICAgICAgICAgICAgXCJjYWxsXCI6IFwiRGVzY3JpYmVBbGFybXNcIixcbiAgICAgICAgICAgIFwicGVybWlzc2lvblwiOiBcIkRlc2NyaWJlQWxhcm1zXCIsXG4gICAgICAgICAgICBcImluaXRpYXRvclwiOiB0cnVlXG4gICAgICAgIH1cbiAgICBdO1xufVxuXG5cbmV4cG9ydCBsZXQgY2xvdWR3YXRjaF9EZXNjcmliZUFsYXJtcyA9IChyZWdpb246IHN0cmluZywgY3JlZGVudGlhbHM6IEF3c0NyZWRlbnRpYWxJZGVudGl0eSwgc3ZjQ2FsbHNBbGw6IHN0cmluZ1tdLCBvYmpBdHRyaWJzOiB7fSwgY2F0Y2hlcjogX2NhdGNoZXIpID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgIHNlcnZpY2VDYWxsTWFuaWZlc3QgPSBzdmNDYWxsc0FsbDtcbiAgICAgICAgY29uc3QgY2xpZW50ID0gbmV3IENsb3VkV2F0Y2hDbGllbnQoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmVnaW9uLFxuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgcENvbmZpZyA9IHtcbiAgICAgICAgICAgIGNsaWVudCxcbiAgICAgICAgICAgIHBhZ2VTaXplOiAxMDAsXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgY21kUGFyYW1zID0ge307XG5cbiAgICAgICAgY29uc3QgcGFnaW5hdG9yID0gcGFnaW5hdGVEZXNjcmliZUFsYXJtcyhwQ29uZmlnLCBjbWRQYXJhbXMpO1xuXG4gICAgICAgIGNvbnN0IGFyciA9IFtdO1xuICAgICAgICBjb25zdCBfYXJyQyA9IFtdO1xuXG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGZvciBhd2FpdCAoY29uc3QgcGFnZSBvZiBwYWdpbmF0b3IpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFnZS5NZXRyaWNBbGFybXMpIGFyci5wdXNoKC4uLnBhZ2UuTWV0cmljQWxhcm1zKTtcbiAgICAgICAgICAgICAgICBfYXJyQy5wdXNoKGNhdGNoZXIuaGFuZGxlKHBhZ2UuTWV0cmljQWxhcm1zLCBvYmpBdHRyaWJzKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdGhpcy5vYmpHbG9iYWxbcmVnaW9uXS5NZXRyaWNBbGFybXMgPSBhcnI7XG4gICAgICAgIC8vIHJlc29sdmUoYCR7cmVnaW9ufS9jbG91ZHdhdGNoX0Rlc2NyaWJlQWxhcm1zYCk7XG4gICAgICAgIGxldCBvYmogPSB7XG4gICAgICAgICAgICBbcmVnaW9uXToge1xuICAgICAgICAgICAgICAgIE1ldHJpY0FsYXJtczogYXJyXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJlc29sdmUob2JqKTtcbiAgICB9KTtcbn07XG4iXX0=