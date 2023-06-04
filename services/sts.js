'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.sts_GetCallerIdentity = exports.getPerms = void 0;
const client_sts_1 = require("@aws-sdk/client-sts");
function getPerms() {
    return [
        {
            "service": "sts",
            "call": "GetCallerIdentity",
            "permission": "GetCallerIdentity",
            "initiator": false
        }
    ];
}
exports.getPerms = getPerms;
let sts_GetCallerIdentity = (region, credentials) => {
    // return new Promise((resolve, reject) => {
    let client = new client_sts_1.STSClient({
        region,
        credentials,
    });
    return client.send(new client_sts_1.GetCallerIdentityCommand({}));
    // .then(async (data) => {
    //     await catcher.handle(data, objAttribs);
    //     // oRC.incr(SVC);
    //     resolve(data);
    // })
    // .catch((e) => {
    //     // oRC.incr(SVC);
    //     reject(e);
    // });
    // });
};
exports.sts_GetCallerIdentity = sts_GetCallerIdentity;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7O0FBR2Isb0RBRzZCO0FBSTdCLFNBQWdCLFFBQVE7SUFDcEIsT0FBTztRQUNIO1lBQ0ksU0FBUyxFQUFFLEtBQUs7WUFDaEIsTUFBTSxFQUFFLG1CQUFtQjtZQUMzQixZQUFZLEVBQUUsbUJBQW1CO1lBQ2pDLFdBQVcsRUFBRSxLQUFLO1NBQ3JCO0tBQ0osQ0FBQztBQUNOLENBQUM7QUFURCw0QkFTQztBQUdNLElBQUkscUJBQXFCLEdBQUcsQ0FBQyxNQUFjLEVBQUUsV0FBa0MsRUFBRSxFQUFFO0lBQ3RGLDRDQUE0QztJQUU1QyxJQUFJLE1BQU0sR0FBRyxJQUFJLHNCQUFTLENBQUM7UUFDdkIsTUFBTTtRQUNOLFdBQVc7S0FDZCxDQUFDLENBQUM7SUFFSCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxxQ0FBd0IsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3JELDBCQUEwQjtJQUMxQiw4Q0FBOEM7SUFDOUMsd0JBQXdCO0lBQ3hCLHFCQUFxQjtJQUNyQixLQUFLO0lBQ0wsa0JBQWtCO0lBQ2xCLHdCQUF3QjtJQUN4QixpQkFBaUI7SUFDakIsTUFBTTtJQUVOLE1BQU07QUFDVixDQUFDLENBQUM7QUFwQlMsUUFBQSxxQkFBcUIseUJBb0I5QiIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuXG5pbXBvcnQge1xuICAgIFNUU0NsaWVudCxcbiAgICBHZXRDYWxsZXJJZGVudGl0eUNvbW1hbmQsXG59IGZyb20gJ0Bhd3Mtc2RrL2NsaWVudC1zdHMnO1xuaW1wb3J0IHtBd3NDcmVkZW50aWFsSWRlbnRpdHl9IGZyb20gXCJAYXdzLXNkay90eXBlc1wiO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQZXJtcygpIHtcbiAgICByZXR1cm4gW1xuICAgICAgICB7XG4gICAgICAgICAgICBcInNlcnZpY2VcIjogXCJzdHNcIixcbiAgICAgICAgICAgIFwiY2FsbFwiOiBcIkdldENhbGxlcklkZW50aXR5XCIsXG4gICAgICAgICAgICBcInBlcm1pc3Npb25cIjogXCJHZXRDYWxsZXJJZGVudGl0eVwiLFxuICAgICAgICAgICAgXCJpbml0aWF0b3JcIjogZmFsc2VcbiAgICAgICAgfVxuICAgIF07XG59XG5cblxuZXhwb3J0IGxldCBzdHNfR2V0Q2FsbGVySWRlbnRpdHkgPSAocmVnaW9uOiBzdHJpbmcsIGNyZWRlbnRpYWxzOiBBd3NDcmVkZW50aWFsSWRlbnRpdHkpID0+IHtcbiAgICAvLyByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgbGV0IGNsaWVudCA9IG5ldyBTVFNDbGllbnQoe1xuICAgICAgICByZWdpb24sXG4gICAgICAgIGNyZWRlbnRpYWxzLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNsaWVudC5zZW5kKG5ldyBHZXRDYWxsZXJJZGVudGl0eUNvbW1hbmQoe30pKTtcbiAgICAvLyAudGhlbihhc3luYyAoZGF0YSkgPT4ge1xuICAgIC8vICAgICBhd2FpdCBjYXRjaGVyLmhhbmRsZShkYXRhLCBvYmpBdHRyaWJzKTtcbiAgICAvLyAgICAgLy8gb1JDLmluY3IoU1ZDKTtcbiAgICAvLyAgICAgcmVzb2x2ZShkYXRhKTtcbiAgICAvLyB9KVxuICAgIC8vIC5jYXRjaCgoZSkgPT4ge1xuICAgIC8vICAgICAvLyBvUkMuaW5jcihTVkMpO1xuICAgIC8vICAgICByZWplY3QoZSk7XG4gICAgLy8gfSk7XG5cbiAgICAvLyB9KTtcbn07XG4iXX0=