'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ecr_DescribeRepositories = exports.getPerms = void 0;
const client_ecr_1 = require("@aws-sdk/client-ecr");
let serviceCallManifest;
function getPerms() {
    return [
        {
            "service": "ecr",
            "call": "DescribeRepositories",
            "permission": "DescribeRepositories",
            "initiator": true
        }
    ];
}
exports.getPerms = getPerms;
;
let ecr_DescribeRepositories = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {
        serviceCallManifest = svcCallsAll;
        const client = new client_ecr_1.ECRClient({
            region,
            credentials
        });
        const pConfig = {
            client,
            pageSize: 100,
        };
        const cmdParams = {};
        const paginator = (0, client_ecr_1.paginateDescribeRepositories)(pConfig, cmdParams);
        const arr = [];
        const _arrC = [];
        try {
            for await (const page of paginator) {
                if (page.repositories)
                    arr.push(...page.repositories);
                _arrC.push(catcher.handle(page.repositories, objAttribs));
            }
        }
        catch (e) {
            reject(e);
        }
        // this.objGlobal[region].ECRRepositories = arr;
        // resolve(`${region}/ecr_DescribeRepositories`);
        let obj = {
            [region]: {
                ECRRepositories: arr
            }
        };
        resolve(obj);
    });
};
exports.ecr_DescribeRepositories = ecr_DescribeRepositories;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZWNyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7O0FBRWIsb0RBQTRFO0FBRzVFLElBQUksbUJBQW1CLENBQUM7QUFNeEIsU0FBZ0IsUUFBUTtJQUNwQixPQUFPO1FBQ0g7WUFDSSxTQUFTLEVBQUUsS0FBSztZQUNoQixNQUFNLEVBQUUsc0JBQXNCO1lBQzlCLFlBQVksRUFBRSxzQkFBc0I7WUFDcEMsV0FBVyxFQUFFLElBQUk7U0FDcEI7S0FDSixDQUFDO0FBQ04sQ0FBQztBQVRELDRCQVNDO0FBQUEsQ0FBQztBQUdLLElBQUksd0JBQXdCLEdBQUcsQ0FBQyxNQUFjLEVBQUUsV0FBa0MsRUFBRSxXQUFxQixFQUFFLFVBQWMsRUFBRSxPQUFpQixFQUFFLEVBQUU7SUFDbkosT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBRXpDLG1CQUFtQixHQUFHLFdBQVcsQ0FBQztRQUNsQyxNQUFNLE1BQU0sR0FBRyxJQUFJLHNCQUFTLENBQ3hCO1lBQ0ksTUFBTTtZQUNOLFdBQVc7U0FDZCxDQUNKLENBQUM7UUFFRixNQUFNLE9BQU8sR0FBRztZQUNaLE1BQU07WUFDTixRQUFRLEVBQUUsR0FBRztTQUNoQixDQUFDO1FBRUYsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBRXJCLE1BQU0sU0FBUyxHQUFHLElBQUEseUNBQTRCLEVBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRW5FLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNmLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUVqQixJQUFJO1lBRUEsSUFBSSxLQUFLLEVBQUUsTUFBTSxJQUFJLElBQUksU0FBUyxFQUFFO2dCQUNoQyxJQUFJLElBQUksQ0FBQyxZQUFZO29CQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ3RELEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7YUFDN0Q7U0FDSjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1IsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2I7UUFDRCxnREFBZ0Q7UUFDaEQsaURBQWlEO1FBQ2pELElBQUksR0FBRyxHQUFHO1lBQ04sQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDTixlQUFlLEVBQUUsR0FBRzthQUN2QjtTQUNKLENBQUM7UUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDakIsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUM7QUF6Q1MsUUFBQSx3QkFBd0IsNEJBeUNqQyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtFQ1JDbGllbnQsIHBhZ2luYXRlRGVzY3JpYmVSZXBvc2l0b3JpZXN9IGZyb20gXCJAYXdzLXNkay9jbGllbnQtZWNyXCI7XG5pbXBvcnQge0F3c0NyZWRlbnRpYWxJZGVudGl0eX0gZnJvbSBcIkBhd3Mtc2RrL3R5cGVzXCI7XG5cbmxldCBzZXJ2aWNlQ2FsbE1hbmlmZXN0O1xuXG5pbnRlcmZhY2UgX2NhdGNoZXIge1xuICAgIGhhbmRsZTogRnVuY3Rpb24sXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQZXJtcygpIHtcbiAgICByZXR1cm4gW1xuICAgICAgICB7XG4gICAgICAgICAgICBcInNlcnZpY2VcIjogXCJlY3JcIixcbiAgICAgICAgICAgIFwiY2FsbFwiOiBcIkRlc2NyaWJlUmVwb3NpdG9yaWVzXCIsXG4gICAgICAgICAgICBcInBlcm1pc3Npb25cIjogXCJEZXNjcmliZVJlcG9zaXRvcmllc1wiLFxuICAgICAgICAgICAgXCJpbml0aWF0b3JcIjogdHJ1ZVxuICAgICAgICB9XG4gICAgXTtcbn07XG5cblxuZXhwb3J0IGxldCBlY3JfRGVzY3JpYmVSZXBvc2l0b3JpZXMgPSAocmVnaW9uOiBzdHJpbmcsIGNyZWRlbnRpYWxzOiBBd3NDcmVkZW50aWFsSWRlbnRpdHksIHN2Y0NhbGxzQWxsOiBzdHJpbmdbXSwgb2JqQXR0cmliczoge30sIGNhdGNoZXI6IF9jYXRjaGVyKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgICBzZXJ2aWNlQ2FsbE1hbmlmZXN0ID0gc3ZjQ2FsbHNBbGw7XG4gICAgICAgIGNvbnN0IGNsaWVudCA9IG5ldyBFQ1JDbGllbnQoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmVnaW9uLFxuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgcENvbmZpZyA9IHtcbiAgICAgICAgICAgIGNsaWVudCxcbiAgICAgICAgICAgIHBhZ2VTaXplOiAxMDAsXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgY21kUGFyYW1zID0ge307XG5cbiAgICAgICAgY29uc3QgcGFnaW5hdG9yID0gcGFnaW5hdGVEZXNjcmliZVJlcG9zaXRvcmllcyhwQ29uZmlnLCBjbWRQYXJhbXMpO1xuXG4gICAgICAgIGNvbnN0IGFyciA9IFtdO1xuICAgICAgICBjb25zdCBfYXJyQyA9IFtdO1xuXG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGZvciBhd2FpdCAoY29uc3QgcGFnZSBvZiBwYWdpbmF0b3IpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFnZS5yZXBvc2l0b3JpZXMpIGFyci5wdXNoKC4uLnBhZ2UucmVwb3NpdG9yaWVzKTtcbiAgICAgICAgICAgICAgICBfYXJyQy5wdXNoKGNhdGNoZXIuaGFuZGxlKHBhZ2UucmVwb3NpdG9yaWVzLCBvYmpBdHRyaWJzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB0aGlzLm9iakdsb2JhbFtyZWdpb25dLkVDUlJlcG9zaXRvcmllcyA9IGFycjtcbiAgICAgICAgLy8gcmVzb2x2ZShgJHtyZWdpb259L2Vjcl9EZXNjcmliZVJlcG9zaXRvcmllc2ApO1xuICAgICAgICBsZXQgb2JqID0ge1xuICAgICAgICAgICAgW3JlZ2lvbl06IHtcbiAgICAgICAgICAgICAgICBFQ1JSZXBvc2l0b3JpZXM6IGFyclxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXNvbHZlKG9iaik7XG4gICAgfSk7XG59O1xuIl19