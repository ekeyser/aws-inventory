'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudfront_ListDistributions = exports.cloudfront_ListCachePolicies = exports.getPerms = void 0;
const client_cloudfront_1 = require("@aws-sdk/client-cloudfront");
let serviceCallManifest;
function getPerms() {
    return [
        {
            "service": "cloudfront",
            "call": "ListCachePolicies",
            "permission": "ListCachePolicies",
            "initiator": true
        },
        {
            "service": "cloudfront",
            "call": "ListDistributions",
            "permission": "ListDistributions",
            "initiator": true
        }
    ];
}
exports.getPerms = getPerms;
let cloudfront_ListCachePolicies = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise((resolve, reject) => {
        serviceCallManifest = svcCallsAll;
        const client = new client_cloudfront_1.CloudFrontClient({
            region,
            credentials
        });
        let obj = {
            [region]: {
                CachePolicies: [],
            }
        };
        const _arrC = [];
        client.send(new client_cloudfront_1.ListCachePoliciesCommand({}))
            .then((data) => {
            if (data.CachePolicyList && data.CachePolicyList.Items) {
                data.CachePolicyList.Items.forEach((cachePolicySummary) => {
                    // if (this.objGlobal[region].CachePolicies === undefined) {
                    //     this.objGlobal[region].CachePolicies = [];
                    // }
                    obj[region].CachePolicies.push(cachePolicySummary);
                    _arrC.push(catcher.handle(cachePolicySummary, objAttribs));
                    // this.objGlobal[region].CachePolicies.push(cachePolicy);
                });
                // resolve(`${region}/cloudfront_ListCachePolicies`);
            }
            resolve(obj);
        })
            .catch((e) => {
            reject(e);
        });
    });
};
exports.cloudfront_ListCachePolicies = cloudfront_ListCachePolicies;
let cloudfront_ListDistributions = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {
        serviceCallManifest = svcCallsAll;
        const client = new client_cloudfront_1.CloudFrontClient({
            region,
            credentials
        });
        const pConfig = {
            client,
            pageSize: 100,
        };
        const cmdParams = {};
        const paginator = (0, client_cloudfront_1.paginateListDistributions)(pConfig, cmdParams);
        const arr = [];
        const _arrC = [];
        try {
            for await (const page of paginator) {
                if (page.DistributionList) {
                    if (page.DistributionList.Items)
                        arr.push(...page.DistributionList.Items);
                    _arrC.push(catcher.handle(page.DistributionList.Items, objAttribs));
                }
            }
        }
        catch (e) {
            reject(e);
        }
        let objGlobal = {
            [region]: {
                Distributions: arr
            }
        };
        resolve(objGlobal);
    });
};
exports.cloudfront_ListDistributions = cloudfront_ListDistributions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xvdWRmcm9udC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsb3VkZnJvbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7QUFFYixrRUFLb0M7QUFHcEMsSUFBSSxtQkFBbUIsQ0FBQztBQU14QixTQUFnQixRQUFRO0lBQ3BCLE9BQU87UUFDSDtZQUNJLFNBQVMsRUFBRSxZQUFZO1lBQ3ZCLE1BQU0sRUFBRSxtQkFBbUI7WUFDM0IsWUFBWSxFQUFFLG1CQUFtQjtZQUNqQyxXQUFXLEVBQUUsSUFBSTtTQUNwQjtRQUNEO1lBQ0ksU0FBUyxFQUFFLFlBQVk7WUFDdkIsTUFBTSxFQUFFLG1CQUFtQjtZQUMzQixZQUFZLEVBQUUsbUJBQW1CO1lBQ2pDLFdBQVcsRUFBRSxJQUFJO1NBQ3BCO0tBQ0osQ0FBQztBQUNOLENBQUM7QUFmRCw0QkFlQztBQUdNLElBQUksNEJBQTRCLEdBQUcsQ0FBQyxNQUFjLEVBQUUsV0FBa0MsRUFBRSxXQUFxQixFQUFFLFVBQWMsRUFBRSxPQUFpQixFQUFFLEVBQUU7SUFDdkosT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUVuQyxtQkFBbUIsR0FBRyxXQUFXLENBQUM7UUFDbEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxvQ0FBZ0IsQ0FDL0I7WUFDSSxNQUFNO1lBQ04sV0FBVztTQUNkLENBQ0osQ0FBQztRQUVGLElBQUksR0FBRyxHQUlIO1lBQ0EsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDTixhQUFhLEVBQUUsRUFBRTthQUNwQjtTQUNKLENBQUM7UUFDRixNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7UUFFakIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLDRDQUF3QixDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQ3hDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ1gsSUFBSSxJQUFJLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFO2dCQUVwRCxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFO29CQUN0RCw0REFBNEQ7b0JBQzVELGlEQUFpRDtvQkFDakQsSUFBSTtvQkFDSixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO29CQUNuRCxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFFM0QsMERBQTBEO2dCQUM5RCxDQUFDLENBQUMsQ0FBQztnQkFDSCxxREFBcUQ7YUFDeEQ7WUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakIsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDVCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZCxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDO0FBNUNTLFFBQUEsNEJBQTRCLGdDQTRDckM7QUFHSyxJQUFJLDRCQUE0QixHQUFHLENBQUMsTUFBYyxFQUFFLFdBQWtDLEVBQUUsV0FBcUIsRUFBRSxVQUFjLEVBQUUsT0FBaUIsRUFBRSxFQUFFO0lBQ3ZKLE9BQU8sSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUV6QyxtQkFBbUIsR0FBRyxXQUFXLENBQUM7UUFDbEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxvQ0FBZ0IsQ0FDL0I7WUFDSSxNQUFNO1lBQ04sV0FBVztTQUNkLENBQ0osQ0FBQztRQUVGLE1BQU0sT0FBTyxHQUFHO1lBQ1osTUFBTTtZQUNOLFFBQVEsRUFBRSxHQUFHO1NBQ2hCLENBQUM7UUFFRixNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFFckIsTUFBTSxTQUFTLEdBQUcsSUFBQSw2Q0FBeUIsRUFBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFaEUsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2YsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBRWpCLElBQUk7WUFFQSxJQUFJLEtBQUssRUFBRSxNQUFNLElBQUksSUFBSSxTQUFTLEVBQUU7Z0JBQ2hDLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO29CQUV2QixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLO3dCQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzFFLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7aUJBQ3ZFO2FBQ0o7U0FDSjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1IsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2I7UUFFRCxJQUFJLFNBQVMsR0FBRztZQUNaLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ04sYUFBYSxFQUFFLEdBQUc7YUFDckI7U0FDSixDQUFDO1FBQ0YsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3ZCLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDO0FBM0NTLFFBQUEsNEJBQTRCLGdDQTJDckMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7XG4gICAgQ2FjaGVQb2xpY3lTdW1tYXJ5LFxuICAgIENsb3VkRnJvbnRDbGllbnQsXG4gICAgTGlzdENhY2hlUG9saWNpZXNDb21tYW5kLFxuICAgIHBhZ2luYXRlTGlzdERpc3RyaWJ1dGlvbnNcbn0gZnJvbSBcIkBhd3Mtc2RrL2NsaWVudC1jbG91ZGZyb250XCI7XG5pbXBvcnQge0F3c0NyZWRlbnRpYWxJZGVudGl0eX0gZnJvbSBcIkBhd3Mtc2RrL3R5cGVzXCI7XG5cbmxldCBzZXJ2aWNlQ2FsbE1hbmlmZXN0O1xuXG5pbnRlcmZhY2UgX2NhdGNoZXIge1xuICAgIGhhbmRsZTogRnVuY3Rpb24sXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQZXJtcygpIHtcbiAgICByZXR1cm4gW1xuICAgICAgICB7XG4gICAgICAgICAgICBcInNlcnZpY2VcIjogXCJjbG91ZGZyb250XCIsXG4gICAgICAgICAgICBcImNhbGxcIjogXCJMaXN0Q2FjaGVQb2xpY2llc1wiLFxuICAgICAgICAgICAgXCJwZXJtaXNzaW9uXCI6IFwiTGlzdENhY2hlUG9saWNpZXNcIixcbiAgICAgICAgICAgIFwiaW5pdGlhdG9yXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJzZXJ2aWNlXCI6IFwiY2xvdWRmcm9udFwiLFxuICAgICAgICAgICAgXCJjYWxsXCI6IFwiTGlzdERpc3RyaWJ1dGlvbnNcIixcbiAgICAgICAgICAgIFwicGVybWlzc2lvblwiOiBcIkxpc3REaXN0cmlidXRpb25zXCIsXG4gICAgICAgICAgICBcImluaXRpYXRvclwiOiB0cnVlXG4gICAgICAgIH1cbiAgICBdO1xufVxuXG5cbmV4cG9ydCBsZXQgY2xvdWRmcm9udF9MaXN0Q2FjaGVQb2xpY2llcyA9IChyZWdpb246IHN0cmluZywgY3JlZGVudGlhbHM6IEF3c0NyZWRlbnRpYWxJZGVudGl0eSwgc3ZjQ2FsbHNBbGw6IHN0cmluZ1tdLCBvYmpBdHRyaWJzOiB7fSwgY2F0Y2hlcjogX2NhdGNoZXIpID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgIHNlcnZpY2VDYWxsTWFuaWZlc3QgPSBzdmNDYWxsc0FsbDtcbiAgICAgICAgY29uc3QgY2xpZW50ID0gbmV3IENsb3VkRnJvbnRDbGllbnQoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmVnaW9uLFxuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgbGV0IG9iajoge1xuICAgICAgICAgICAgW2tleTogc3RyaW5nXToge1xuICAgICAgICAgICAgICAgIENhY2hlUG9saWNpZXM6IENhY2hlUG9saWN5U3VtbWFyeVtdLFxuICAgICAgICAgICAgfVxuICAgICAgICB9ID0ge1xuICAgICAgICAgICAgW3JlZ2lvbl06IHtcbiAgICAgICAgICAgICAgICBDYWNoZVBvbGljaWVzOiBbXSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgX2FyckMgPSBbXTtcblxuICAgICAgICBjbGllbnQuc2VuZChuZXcgTGlzdENhY2hlUG9saWNpZXNDb21tYW5kKHt9KSlcbiAgICAgICAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuQ2FjaGVQb2xpY3lMaXN0ICYmIGRhdGEuQ2FjaGVQb2xpY3lMaXN0Lkl0ZW1zKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgZGF0YS5DYWNoZVBvbGljeUxpc3QuSXRlbXMuZm9yRWFjaCgoY2FjaGVQb2xpY3lTdW1tYXJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiAodGhpcy5vYmpHbG9iYWxbcmVnaW9uXS5DYWNoZVBvbGljaWVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB0aGlzLm9iakdsb2JhbFtyZWdpb25dLkNhY2hlUG9saWNpZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9ialtyZWdpb25dLkNhY2hlUG9saWNpZXMucHVzaChjYWNoZVBvbGljeVN1bW1hcnkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2FyckMucHVzaChjYXRjaGVyLmhhbmRsZShjYWNoZVBvbGljeVN1bW1hcnksIG9iakF0dHJpYnMpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5vYmpHbG9iYWxbcmVnaW9uXS5DYWNoZVBvbGljaWVzLnB1c2goY2FjaGVQb2xpY3kpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVzb2x2ZShgJHtyZWdpb259L2Nsb3VkZnJvbnRfTGlzdENhY2hlUG9saWNpZXNgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXNvbHZlKG9iaik7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuXG5cbmV4cG9ydCBsZXQgY2xvdWRmcm9udF9MaXN0RGlzdHJpYnV0aW9ucyA9IChyZWdpb246IHN0cmluZywgY3JlZGVudGlhbHM6IEF3c0NyZWRlbnRpYWxJZGVudGl0eSwgc3ZjQ2FsbHNBbGw6IHN0cmluZ1tdLCBvYmpBdHRyaWJzOiB7fSwgY2F0Y2hlcjogX2NhdGNoZXIpID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgIHNlcnZpY2VDYWxsTWFuaWZlc3QgPSBzdmNDYWxsc0FsbDtcbiAgICAgICAgY29uc3QgY2xpZW50ID0gbmV3IENsb3VkRnJvbnRDbGllbnQoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmVnaW9uLFxuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgcENvbmZpZyA9IHtcbiAgICAgICAgICAgIGNsaWVudCxcbiAgICAgICAgICAgIHBhZ2VTaXplOiAxMDAsXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgY21kUGFyYW1zID0ge307XG5cbiAgICAgICAgY29uc3QgcGFnaW5hdG9yID0gcGFnaW5hdGVMaXN0RGlzdHJpYnV0aW9ucyhwQ29uZmlnLCBjbWRQYXJhbXMpO1xuXG4gICAgICAgIGNvbnN0IGFyciA9IFtdO1xuICAgICAgICBjb25zdCBfYXJyQyA9IFtdO1xuXG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGZvciBhd2FpdCAoY29uc3QgcGFnZSBvZiBwYWdpbmF0b3IpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFnZS5EaXN0cmlidXRpb25MaXN0KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhZ2UuRGlzdHJpYnV0aW9uTGlzdC5JdGVtcykgYXJyLnB1c2goLi4ucGFnZS5EaXN0cmlidXRpb25MaXN0Lkl0ZW1zKTtcbiAgICAgICAgICAgICAgICAgICAgX2FyckMucHVzaChjYXRjaGVyLmhhbmRsZShwYWdlLkRpc3RyaWJ1dGlvbkxpc3QuSXRlbXMsIG9iakF0dHJpYnMpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBvYmpHbG9iYWwgPSB7XG4gICAgICAgICAgICBbcmVnaW9uXToge1xuICAgICAgICAgICAgICAgIERpc3RyaWJ1dGlvbnM6IGFyclxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXNvbHZlKG9iakdsb2JhbCk7XG4gICAgfSk7XG59O1xuIl19