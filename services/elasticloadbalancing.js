'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.elasticloadbalancing_DescribeLoadBalancers = exports.getPerms = void 0;
const client_elastic_load_balancing_v2_1 = require("@aws-sdk/client-elastic-load-balancing-v2");
let serviceCallManifest;
function getPerms() {
    return [
        {
            "service": "elasticloadbalancing",
            "call": "DescribeLoadBalancerAttributes",
            "permission": "DescribeLoadBalancerAttributes",
            "initiator": false
        },
        {
            "service": "elasticloadbalancing",
            "call": "DescribeLoadBalancers",
            "permission": "DescribeLoadBalancers",
            "initiator": true
        },
        {
            "service": "elasticloadbalancing",
            "call": "DescribeTargetGroups",
            "permission": "DescribeTargetGroups",
            "initiator": false
        }
    ];
}
exports.getPerms = getPerms;
let elasticloadbalancing_DescribeLoadBalancerAttributes = (loadbalancer, client, objAttribs, catcher) => {
    return new Promise((resolve, reject) => {
        client.send(new client_elastic_load_balancing_v2_1.DescribeLoadBalancerAttributesCommand({
            LoadBalancerArn: loadbalancer.LoadBalancerArn,
        }))
            .then((data) => {
            resolve(data);
        })
            .catch((err) => {
            reject(err);
        });
    });
};
let elasticloadbalancing_DescribeLoadBalancers = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {
        serviceCallManifest = svcCallsAll;
        const client = new client_elastic_load_balancing_v2_1.ElasticLoadBalancingV2Client({
            region,
            credentials,
        });
        const pConfig = {
            client,
            pageSize: 100,
        };
        const cmdParams = {};
        const paginator = (0, client_elastic_load_balancing_v2_1.paginateDescribeLoadBalancers)(pConfig, cmdParams);
        const arr = [];
        const _arrC = [];
        try {
            for await (const page of paginator) {
                if (page.LoadBalancers)
                    arr.push(...page.LoadBalancers);
                _arrC.push(catcher.handle(page.LoadBalancers, objAttribs));
            }
        }
        catch (e) {
            reject(e);
        }
        const arrLoadBalancers = [];
        for (let i = 0; i < arr.length; i++) {
            let loadBalancer = arr[i];
            const _attribs = await elasticloadbalancing_DescribeLoadBalancerAttributes(loadBalancer, client, objAttribs, catcher);
            const objLoadBalancer = {
                Attributes: _attribs,
                LoadBalancer: loadBalancer,
            };
            arrLoadBalancers.push(objLoadBalancer);
        }
        let obj = {
            [region]: {
                ApplicationLoadBalancers: arrLoadBalancers
            }
        };
        resolve(obj);
    });
};
exports.elasticloadbalancing_DescribeLoadBalancers = elasticloadbalancing_DescribeLoadBalancers;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxhc3RpY2xvYWRiYWxhbmNpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlbGFzdGljbG9hZGJhbGFuY2luZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7OztBQUViLGdHQUttRDtBQUduRCxJQUFJLG1CQUFtQixDQUFDO0FBTXhCLFNBQWdCLFFBQVE7SUFDcEIsT0FBTztRQUNIO1lBQ0ksU0FBUyxFQUFFLHNCQUFzQjtZQUNqQyxNQUFNLEVBQUUsZ0NBQWdDO1lBQ3hDLFlBQVksRUFBRSxnQ0FBZ0M7WUFDOUMsV0FBVyxFQUFFLEtBQUs7U0FDckI7UUFDRDtZQUNJLFNBQVMsRUFBRSxzQkFBc0I7WUFDakMsTUFBTSxFQUFFLHVCQUF1QjtZQUMvQixZQUFZLEVBQUUsdUJBQXVCO1lBQ3JDLFdBQVcsRUFBRSxJQUFJO1NBQ3BCO1FBQ0Q7WUFDSSxTQUFTLEVBQUUsc0JBQXNCO1lBQ2pDLE1BQU0sRUFBRSxzQkFBc0I7WUFDOUIsWUFBWSxFQUFFLHNCQUFzQjtZQUNwQyxXQUFXLEVBQUUsS0FBSztTQUNyQjtLQUNKLENBQUM7QUFDTixDQUFDO0FBckJELDRCQXFCQztBQUdELElBQUksbURBQW1ELEdBQUcsQ0FBQyxZQUEwQixFQUFFLE1BQW9DLEVBQUUsVUFBYyxFQUFFLE9BQWlCLEVBQXdELEVBQUU7SUFDcE4sT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUVuQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksd0VBQXFDLENBQ2pEO1lBQ0ksZUFBZSxFQUFFLFlBQVksQ0FBQyxlQUFlO1NBQ2hELENBQ0osQ0FBQzthQUNHLElBQUksQ0FBQyxDQUFDLElBQWlELEVBQUUsRUFBRTtZQUN4RCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEIsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLENBQUMsR0FBVSxFQUFFLEVBQUU7WUFDbEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUM7QUFHSyxJQUFJLDBDQUEwQyxHQUFHLENBQUMsTUFBYyxFQUFFLFdBQWtDLEVBQUUsV0FBcUIsRUFBRSxVQUFjLEVBQUUsT0FBaUIsRUFBRSxFQUFFO0lBQ3JLLE9BQU8sSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUV6QyxtQkFBbUIsR0FBRyxXQUFXLENBQUM7UUFDbEMsTUFBTSxNQUFNLEdBQUcsSUFBSSwrREFBNEIsQ0FDM0M7WUFDSSxNQUFNO1lBQ04sV0FBVztTQUNkLENBQ0osQ0FBQztRQUVGLE1BQU0sT0FBTyxHQUFHO1lBQ1osTUFBTTtZQUNOLFFBQVEsRUFBRSxHQUFHO1NBQ2hCLENBQUM7UUFFRixNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFFckIsTUFBTSxTQUFTLEdBQUcsSUFBQSxnRUFBNkIsRUFBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFcEUsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2YsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBRWpCLElBQUk7WUFFQSxJQUFJLEtBQUssRUFBRSxNQUFNLElBQUksSUFBSSxTQUFTLEVBQUU7Z0JBQ2hDLElBQUksSUFBSSxDQUFDLGFBQWE7b0JBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDeEQsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQzthQUM5RDtTQUNKO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDUixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDYjtRQUNELE1BQU0sZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO1FBRzVCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2pDLElBQUksWUFBWSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQixNQUFNLFFBQVEsR0FBRyxNQUFNLG1EQUFtRCxDQUFDLFlBQVksRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3RILE1BQU0sZUFBZSxHQUFHO2dCQUNwQixVQUFVLEVBQUUsUUFBUTtnQkFDcEIsWUFBWSxFQUFFLFlBQVk7YUFDN0IsQ0FBQztZQUNGLGdCQUFnQixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUMxQztRQUVELElBQUksR0FBRyxHQUFHO1lBQ04sQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDTix3QkFBd0IsRUFBRSxnQkFBZ0I7YUFDN0M7U0FDSixDQUFDO1FBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pCLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDO0FBcERTLFFBQUEsMENBQTBDLDhDQW9EbkQiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7XG4gICAgRGVzY3JpYmVMb2FkQmFsYW5jZXJBdHRyaWJ1dGVzQ29tbWFuZCxcbiAgICBEZXNjcmliZUxvYWRCYWxhbmNlckF0dHJpYnV0ZXNDb21tYW5kT3V0cHV0LFxuICAgIEVsYXN0aWNMb2FkQmFsYW5jaW5nVjJDbGllbnQsIExvYWRCYWxhbmNlcixcbiAgICBwYWdpbmF0ZURlc2NyaWJlTG9hZEJhbGFuY2Vyc1xufSBmcm9tIFwiQGF3cy1zZGsvY2xpZW50LWVsYXN0aWMtbG9hZC1iYWxhbmNpbmctdjJcIjtcbmltcG9ydCB7QXdzQ3JlZGVudGlhbElkZW50aXR5fSBmcm9tIFwiQGF3cy1zZGsvdHlwZXNcIjtcblxubGV0IHNlcnZpY2VDYWxsTWFuaWZlc3Q7XG5cbmludGVyZmFjZSBfY2F0Y2hlciB7XG4gICAgaGFuZGxlOiBGdW5jdGlvbixcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBlcm1zKCkge1xuICAgIHJldHVybiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwic2VydmljZVwiOiBcImVsYXN0aWNsb2FkYmFsYW5jaW5nXCIsXG4gICAgICAgICAgICBcImNhbGxcIjogXCJEZXNjcmliZUxvYWRCYWxhbmNlckF0dHJpYnV0ZXNcIixcbiAgICAgICAgICAgIFwicGVybWlzc2lvblwiOiBcIkRlc2NyaWJlTG9hZEJhbGFuY2VyQXR0cmlidXRlc1wiLFxuICAgICAgICAgICAgXCJpbml0aWF0b3JcIjogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJzZXJ2aWNlXCI6IFwiZWxhc3RpY2xvYWRiYWxhbmNpbmdcIixcbiAgICAgICAgICAgIFwiY2FsbFwiOiBcIkRlc2NyaWJlTG9hZEJhbGFuY2Vyc1wiLFxuICAgICAgICAgICAgXCJwZXJtaXNzaW9uXCI6IFwiRGVzY3JpYmVMb2FkQmFsYW5jZXJzXCIsXG4gICAgICAgICAgICBcImluaXRpYXRvclwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwic2VydmljZVwiOiBcImVsYXN0aWNsb2FkYmFsYW5jaW5nXCIsXG4gICAgICAgICAgICBcImNhbGxcIjogXCJEZXNjcmliZVRhcmdldEdyb3Vwc1wiLFxuICAgICAgICAgICAgXCJwZXJtaXNzaW9uXCI6IFwiRGVzY3JpYmVUYXJnZXRHcm91cHNcIixcbiAgICAgICAgICAgIFwiaW5pdGlhdG9yXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICBdO1xufVxuXG5cbmxldCBlbGFzdGljbG9hZGJhbGFuY2luZ19EZXNjcmliZUxvYWRCYWxhbmNlckF0dHJpYnV0ZXMgPSAobG9hZGJhbGFuY2VyOiBMb2FkQmFsYW5jZXIsIGNsaWVudDogRWxhc3RpY0xvYWRCYWxhbmNpbmdWMkNsaWVudCwgb2JqQXR0cmliczoge30sIGNhdGNoZXI6IF9jYXRjaGVyKTogUHJvbWlzZTxEZXNjcmliZUxvYWRCYWxhbmNlckF0dHJpYnV0ZXNDb21tYW5kT3V0cHV0PiA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgICBjbGllbnQuc2VuZChuZXcgRGVzY3JpYmVMb2FkQmFsYW5jZXJBdHRyaWJ1dGVzQ29tbWFuZChcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBMb2FkQmFsYW5jZXJBcm46IGxvYWRiYWxhbmNlci5Mb2FkQmFsYW5jZXJBcm4sXG4gICAgICAgICAgICB9XG4gICAgICAgICkpXG4gICAgICAgICAgICAudGhlbigoZGF0YTogRGVzY3JpYmVMb2FkQmFsYW5jZXJBdHRyaWJ1dGVzQ29tbWFuZE91dHB1dCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKChlcnI6IEVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbn07XG5cblxuZXhwb3J0IGxldCBlbGFzdGljbG9hZGJhbGFuY2luZ19EZXNjcmliZUxvYWRCYWxhbmNlcnMgPSAocmVnaW9uOiBzdHJpbmcsIGNyZWRlbnRpYWxzOiBBd3NDcmVkZW50aWFsSWRlbnRpdHksIHN2Y0NhbGxzQWxsOiBzdHJpbmdbXSwgb2JqQXR0cmliczoge30sIGNhdGNoZXI6IF9jYXRjaGVyKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgICBzZXJ2aWNlQ2FsbE1hbmlmZXN0ID0gc3ZjQ2FsbHNBbGw7XG4gICAgICAgIGNvbnN0IGNsaWVudCA9IG5ldyBFbGFzdGljTG9hZEJhbGFuY2luZ1YyQ2xpZW50KFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJlZ2lvbixcbiAgICAgICAgICAgICAgICBjcmVkZW50aWFscyxcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCBwQ29uZmlnID0ge1xuICAgICAgICAgICAgY2xpZW50LFxuICAgICAgICAgICAgcGFnZVNpemU6IDEwMCxcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBjbWRQYXJhbXMgPSB7fTtcblxuICAgICAgICBjb25zdCBwYWdpbmF0b3IgPSBwYWdpbmF0ZURlc2NyaWJlTG9hZEJhbGFuY2VycyhwQ29uZmlnLCBjbWRQYXJhbXMpO1xuXG4gICAgICAgIGNvbnN0IGFyciA9IFtdO1xuICAgICAgICBjb25zdCBfYXJyQyA9IFtdO1xuXG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGZvciBhd2FpdCAoY29uc3QgcGFnZSBvZiBwYWdpbmF0b3IpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFnZS5Mb2FkQmFsYW5jZXJzKSBhcnIucHVzaCguLi5wYWdlLkxvYWRCYWxhbmNlcnMpO1xuICAgICAgICAgICAgICAgIF9hcnJDLnB1c2goY2F0Y2hlci5oYW5kbGUocGFnZS5Mb2FkQmFsYW5jZXJzLCBvYmpBdHRyaWJzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhcnJMb2FkQmFsYW5jZXJzID0gW107XG5cblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGxvYWRCYWxhbmNlciA9IGFycltpXTtcbiAgICAgICAgICAgIGNvbnN0IF9hdHRyaWJzID0gYXdhaXQgZWxhc3RpY2xvYWRiYWxhbmNpbmdfRGVzY3JpYmVMb2FkQmFsYW5jZXJBdHRyaWJ1dGVzKGxvYWRCYWxhbmNlciwgY2xpZW50LCBvYmpBdHRyaWJzLCBjYXRjaGVyKTtcbiAgICAgICAgICAgIGNvbnN0IG9iakxvYWRCYWxhbmNlciA9IHtcbiAgICAgICAgICAgICAgICBBdHRyaWJ1dGVzOiBfYXR0cmlicyxcbiAgICAgICAgICAgICAgICBMb2FkQmFsYW5jZXI6IGxvYWRCYWxhbmNlcixcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBhcnJMb2FkQmFsYW5jZXJzLnB1c2gob2JqTG9hZEJhbGFuY2VyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBvYmogPSB7XG4gICAgICAgICAgICBbcmVnaW9uXToge1xuICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyczogYXJyTG9hZEJhbGFuY2Vyc1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXNvbHZlKG9iaik7XG4gICAgfSk7XG59O1xuIl19