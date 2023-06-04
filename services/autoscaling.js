'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoscaling_DescribeLaunchConfigurations = exports.autoscaling_DescribeAutoScalingGroups = exports.getPerms = void 0;
const client_auto_scaling_1 = require("@aws-sdk/client-auto-scaling");
let serviceCallManifest;
function getPerms() {
    return [
        {
            "service": "autoscaling",
            "call": "DescribeLaunchConfigurations",
            "permission": "DescribeLaunchConfigurations",
            "initiator": true
        },
        {
            "service": "autoscaling",
            "call": "DescribeAutoScalingGroups",
            "permission": "DescribeAutoScalingGroups",
            "initiator": true
        }
    ];
}
exports.getPerms = getPerms;
let autoscaling_DescribeAutoScalingGroups = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {
        serviceCallManifest = svcCallsAll;
        const client = new client_auto_scaling_1.AutoScalingClient({
            region,
            credentials
        });
        const pConfig = {
            client,
            pageSize: 100,
        };
        const cmdParams = {};
        const paginator = (0, client_auto_scaling_1.paginateDescribeAutoScalingGroups)(pConfig, cmdParams);
        const arr = [];
        const _arrC = [];
        try {
            for await (const page of paginator) {
                if (page.AutoScalingGroups)
                    arr.push(...page.AutoScalingGroups);
                _arrC.push(catcher.handle(page.AutoScalingGroups, objAttribs));
            }
        }
        catch (e) {
            reject(e);
        }
        // this.objGlobal[region].AutoScalingGroups = arr;
        // resolve(`${region}/autoscaling_DescribeAutoScalingGroups`);
        let obj = {
            [region]: {
                AutoScalingGroups: arr
            }
        };
        resolve(obj);
    });
};
exports.autoscaling_DescribeAutoScalingGroups = autoscaling_DescribeAutoScalingGroups;
let autoscaling_DescribeLaunchConfigurations = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {
        serviceCallManifest = svcCallsAll;
        const client = new client_auto_scaling_1.AutoScalingClient({
            region,
            credentials
        });
        const pConfig = {
            client,
            pageSize: 100,
        };
        const cmdParams = {};
        const paginator = (0, client_auto_scaling_1.paginateDescribeLaunchConfigurations)(pConfig, cmdParams);
        const arr = [];
        const _arrC = [];
        try {
            for await (const page of paginator) {
                if (page.LaunchConfigurations)
                    arr.push(...page.LaunchConfigurations);
                _arrC.push(catcher.handle(page.LaunchConfigurations, objAttribs));
            }
        }
        catch (e) {
            reject(e);
        }
        // this.objGlobal[region].LaunchConfigurations = arr;
        // resolve(`${region}/autoscaling_DescribeLaunchConfigurations`);
        let obj = {
            [region]: {
                LaunchConfigurations: arr
            }
        };
        resolve(obj);
    });
};
exports.autoscaling_DescribeLaunchConfigurations = autoscaling_DescribeLaunchConfigurations;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b3NjYWxpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhdXRvc2NhbGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7OztBQUdiLHNFQUlzQztBQUd0QyxJQUFJLG1CQUFtQixDQUFDO0FBTXhCLFNBQWdCLFFBQVE7SUFDcEIsT0FBTztRQUNIO1lBQ0ksU0FBUyxFQUFFLGFBQWE7WUFDeEIsTUFBTSxFQUFFLDhCQUE4QjtZQUN0QyxZQUFZLEVBQUUsOEJBQThCO1lBQzVDLFdBQVcsRUFBRSxJQUFJO1NBQ3BCO1FBQ0Q7WUFDSSxTQUFTLEVBQUUsYUFBYTtZQUN4QixNQUFNLEVBQUUsMkJBQTJCO1lBQ25DLFlBQVksRUFBRSwyQkFBMkI7WUFDekMsV0FBVyxFQUFFLElBQUk7U0FDcEI7S0FDSixDQUFDO0FBQ04sQ0FBQztBQWZELDRCQWVDO0FBR00sSUFBSSxxQ0FBcUMsR0FBRyxDQUFDLE1BQWMsRUFBRSxXQUFrQyxFQUFFLFdBQXFCLEVBQUUsVUFBYyxFQUFFLE9BQWlCLEVBQUUsRUFBRTtJQUNoSyxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFFekMsbUJBQW1CLEdBQUcsV0FBVyxDQUFDO1FBQ2xDLE1BQU0sTUFBTSxHQUFHLElBQUksdUNBQWlCLENBQ2hDO1lBQ0ksTUFBTTtZQUNOLFdBQVc7U0FDZCxDQUNKLENBQUM7UUFFRixNQUFNLE9BQU8sR0FBRztZQUNaLE1BQU07WUFDTixRQUFRLEVBQUUsR0FBRztTQUNoQixDQUFDO1FBRUYsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBRXJCLE1BQU0sU0FBUyxHQUFHLElBQUEsdURBQWlDLEVBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRXhFLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNmLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUVqQixJQUFJO1lBRUEsSUFBSSxLQUFLLEVBQUUsTUFBTSxJQUFJLElBQUksU0FBUyxFQUFFO2dCQUNoQyxJQUFJLElBQUksQ0FBQyxpQkFBaUI7b0JBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2dCQUNoRSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7YUFDbEU7U0FDSjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1IsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2I7UUFFRCxrREFBa0Q7UUFDbEQsOERBQThEO1FBQzlELElBQUksR0FBRyxHQUFHO1lBQ04sQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDTixpQkFBaUIsRUFBRSxHQUFHO2FBQ3pCO1NBQ0osQ0FBQztRQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqQixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQztBQTFDUyxRQUFBLHFDQUFxQyx5Q0EwQzlDO0FBR0ssSUFBSSx3Q0FBd0MsR0FBRyxDQUFDLE1BQWMsRUFBRSxXQUFrQyxFQUFFLFdBQXFCLEVBQUUsVUFBYyxFQUFFLE9BQWlCLEVBQUUsRUFBRTtJQUNuSyxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFFekMsbUJBQW1CLEdBQUcsV0FBVyxDQUFDO1FBQ2xDLE1BQU0sTUFBTSxHQUFHLElBQUksdUNBQWlCLENBQ2hDO1lBQ0ksTUFBTTtZQUNOLFdBQVc7U0FDZCxDQUNKLENBQUM7UUFFRixNQUFNLE9BQU8sR0FBRztZQUNaLE1BQU07WUFDTixRQUFRLEVBQUUsR0FBRztTQUNoQixDQUFDO1FBRUYsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBRXJCLE1BQU0sU0FBUyxHQUFHLElBQUEsMERBQW9DLEVBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRTNFLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNmLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUVqQixJQUFJO1lBRUEsSUFBSSxLQUFLLEVBQUUsTUFBTSxJQUFJLElBQUksU0FBUyxFQUFFO2dCQUNoQyxJQUFJLElBQUksQ0FBQyxvQkFBb0I7b0JBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO2dCQUN0RSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7YUFDckU7U0FFSjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1IsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2I7UUFFRCxxREFBcUQ7UUFDckQsaUVBQWlFO1FBQ2pFLElBQUksR0FBRyxHQUFHO1lBQ04sQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDTixvQkFBb0IsRUFBRSxHQUFHO2FBQzVCO1NBQ0osQ0FBQztRQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqQixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQztBQTNDUyxRQUFBLHdDQUF3Qyw0Q0EyQ2pEIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5cbmltcG9ydCB7XG4gICAgQXV0b1NjYWxpbmdDbGllbnQsXG4gICAgcGFnaW5hdGVEZXNjcmliZUF1dG9TY2FsaW5nR3JvdXBzLFxuICAgIHBhZ2luYXRlRGVzY3JpYmVMYXVuY2hDb25maWd1cmF0aW9uc1xufSBmcm9tIFwiQGF3cy1zZGsvY2xpZW50LWF1dG8tc2NhbGluZ1wiO1xuaW1wb3J0IHtBd3NDcmVkZW50aWFsSWRlbnRpdHl9IGZyb20gXCJAYXdzLXNkay90eXBlc1wiO1xuXG5sZXQgc2VydmljZUNhbGxNYW5pZmVzdDtcblxuaW50ZXJmYWNlIF9jYXRjaGVyIHtcbiAgICBoYW5kbGU6IEZ1bmN0aW9uLFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGVybXMoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICAge1xuICAgICAgICAgICAgXCJzZXJ2aWNlXCI6IFwiYXV0b3NjYWxpbmdcIixcbiAgICAgICAgICAgIFwiY2FsbFwiOiBcIkRlc2NyaWJlTGF1bmNoQ29uZmlndXJhdGlvbnNcIixcbiAgICAgICAgICAgIFwicGVybWlzc2lvblwiOiBcIkRlc2NyaWJlTGF1bmNoQ29uZmlndXJhdGlvbnNcIixcbiAgICAgICAgICAgIFwiaW5pdGlhdG9yXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJzZXJ2aWNlXCI6IFwiYXV0b3NjYWxpbmdcIixcbiAgICAgICAgICAgIFwiY2FsbFwiOiBcIkRlc2NyaWJlQXV0b1NjYWxpbmdHcm91cHNcIixcbiAgICAgICAgICAgIFwicGVybWlzc2lvblwiOiBcIkRlc2NyaWJlQXV0b1NjYWxpbmdHcm91cHNcIixcbiAgICAgICAgICAgIFwiaW5pdGlhdG9yXCI6IHRydWVcbiAgICAgICAgfVxuICAgIF07XG59XG5cblxuZXhwb3J0IGxldCBhdXRvc2NhbGluZ19EZXNjcmliZUF1dG9TY2FsaW5nR3JvdXBzID0gKHJlZ2lvbjogc3RyaW5nLCBjcmVkZW50aWFsczogQXdzQ3JlZGVudGlhbElkZW50aXR5LCBzdmNDYWxsc0FsbDogc3RyaW5nW10sIG9iakF0dHJpYnM6IHt9LCBjYXRjaGVyOiBfY2F0Y2hlcikgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgc2VydmljZUNhbGxNYW5pZmVzdCA9IHN2Y0NhbGxzQWxsO1xuICAgICAgICBjb25zdCBjbGllbnQgPSBuZXcgQXV0b1NjYWxpbmdDbGllbnQoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmVnaW9uLFxuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgcENvbmZpZyA9IHtcbiAgICAgICAgICAgIGNsaWVudCxcbiAgICAgICAgICAgIHBhZ2VTaXplOiAxMDAsXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgY21kUGFyYW1zID0ge307XG5cbiAgICAgICAgY29uc3QgcGFnaW5hdG9yID0gcGFnaW5hdGVEZXNjcmliZUF1dG9TY2FsaW5nR3JvdXBzKHBDb25maWcsIGNtZFBhcmFtcyk7XG5cbiAgICAgICAgY29uc3QgYXJyID0gW107XG4gICAgICAgIGNvbnN0IF9hcnJDID0gW107XG5cbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgZm9yIGF3YWl0IChjb25zdCBwYWdlIG9mIHBhZ2luYXRvcikge1xuICAgICAgICAgICAgICAgIGlmIChwYWdlLkF1dG9TY2FsaW5nR3JvdXBzKSBhcnIucHVzaCguLi5wYWdlLkF1dG9TY2FsaW5nR3JvdXBzKTtcbiAgICAgICAgICAgICAgICBfYXJyQy5wdXNoKGNhdGNoZXIuaGFuZGxlKHBhZ2UuQXV0b1NjYWxpbmdHcm91cHMsIG9iakF0dHJpYnMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdGhpcy5vYmpHbG9iYWxbcmVnaW9uXS5BdXRvU2NhbGluZ0dyb3VwcyA9IGFycjtcbiAgICAgICAgLy8gcmVzb2x2ZShgJHtyZWdpb259L2F1dG9zY2FsaW5nX0Rlc2NyaWJlQXV0b1NjYWxpbmdHcm91cHNgKTtcbiAgICAgICAgbGV0IG9iaiA9IHtcbiAgICAgICAgICAgIFtyZWdpb25dOiB7XG4gICAgICAgICAgICAgICAgQXV0b1NjYWxpbmdHcm91cHM6IGFyclxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXNvbHZlKG9iaik7XG4gICAgfSk7XG59O1xuXG5cbmV4cG9ydCBsZXQgYXV0b3NjYWxpbmdfRGVzY3JpYmVMYXVuY2hDb25maWd1cmF0aW9ucyA9IChyZWdpb246IHN0cmluZywgY3JlZGVudGlhbHM6IEF3c0NyZWRlbnRpYWxJZGVudGl0eSwgc3ZjQ2FsbHNBbGw6IHN0cmluZ1tdLCBvYmpBdHRyaWJzOiB7fSwgY2F0Y2hlcjogX2NhdGNoZXIpID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgIHNlcnZpY2VDYWxsTWFuaWZlc3QgPSBzdmNDYWxsc0FsbDtcbiAgICAgICAgY29uc3QgY2xpZW50ID0gbmV3IEF1dG9TY2FsaW5nQ2xpZW50KFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJlZ2lvbixcbiAgICAgICAgICAgICAgICBjcmVkZW50aWFsc1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IHBDb25maWcgPSB7XG4gICAgICAgICAgICBjbGllbnQsXG4gICAgICAgICAgICBwYWdlU2l6ZTogMTAwLFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGNtZFBhcmFtcyA9IHt9O1xuXG4gICAgICAgIGNvbnN0IHBhZ2luYXRvciA9IHBhZ2luYXRlRGVzY3JpYmVMYXVuY2hDb25maWd1cmF0aW9ucyhwQ29uZmlnLCBjbWRQYXJhbXMpO1xuXG4gICAgICAgIGNvbnN0IGFyciA9IFtdO1xuICAgICAgICBjb25zdCBfYXJyQyA9IFtdO1xuXG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGZvciBhd2FpdCAoY29uc3QgcGFnZSBvZiBwYWdpbmF0b3IpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFnZS5MYXVuY2hDb25maWd1cmF0aW9ucykgYXJyLnB1c2goLi4ucGFnZS5MYXVuY2hDb25maWd1cmF0aW9ucyk7XG4gICAgICAgICAgICAgICAgX2FyckMucHVzaChjYXRjaGVyLmhhbmRsZShwYWdlLkxhdW5jaENvbmZpZ3VyYXRpb25zLCBvYmpBdHRyaWJzKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdGhpcy5vYmpHbG9iYWxbcmVnaW9uXS5MYXVuY2hDb25maWd1cmF0aW9ucyA9IGFycjtcbiAgICAgICAgLy8gcmVzb2x2ZShgJHtyZWdpb259L2F1dG9zY2FsaW5nX0Rlc2NyaWJlTGF1bmNoQ29uZmlndXJhdGlvbnNgKTtcbiAgICAgICAgbGV0IG9iaiA9IHtcbiAgICAgICAgICAgIFtyZWdpb25dOiB7XG4gICAgICAgICAgICAgICAgTGF1bmNoQ29uZmlndXJhdGlvbnM6IGFyclxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXNvbHZlKG9iaik7XG4gICAgfSk7XG59O1xuIl19