'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.lambda_ListFunctions = exports.getPerms = void 0;
const client_lambda_1 = require("@aws-sdk/client-lambda");
let serviceCallManifest;
function getPerms() {
    return [
        {
            "service": "lambda",
            "call": "ListFunctions",
            "permission": "ListFunctions",
            "initiator": true
        }
    ];
}
exports.getPerms = getPerms;
;
let lambda_ListFunctions = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {
        serviceCallManifest = svcCallsAll;
        const client = new client_lambda_1.LambdaClient({
            region,
            credentials
        });
        const pConfig = {
            client,
            pageSize: 100,
        };
        const cmdParams = {};
        const paginator = (0, client_lambda_1.paginateListFunctions)(pConfig, cmdParams);
        const arr = [];
        const _arrC = [];
        try {
            for await (const page of paginator) {
                // oRC.incr();
                if (page.Functions)
                    arr.push(...page.Functions);
                // catcher.handle(page.Functions);
                // console.log(objAttribs)
                _arrC.push(catcher.handle(page.Functions, objAttribs));
            }
        }
        catch (e) {
            // oRC.incr();
            reject(e);
        }
        // this.objGlobal[region].Functions = arr;
        // resolve(`${region}/lambda_ListFunctions`);
        let obj = {
            [region]: {
                Functions: arr
            }
        };
        resolve(obj);
    });
};
exports.lambda_ListFunctions = lambda_ListFunctions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGFtYmRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7O0FBRWIsMERBQTJFO0FBRzNFLElBQUksbUJBQW1CLENBQUM7QUFNeEIsU0FBZ0IsUUFBUTtJQUNwQixPQUFPO1FBQ0g7WUFDSSxTQUFTLEVBQUUsUUFBUTtZQUNuQixNQUFNLEVBQUUsZUFBZTtZQUN2QixZQUFZLEVBQUUsZUFBZTtZQUM3QixXQUFXLEVBQUUsSUFBSTtTQUNwQjtLQUNKLENBQUM7QUFDTixDQUFDO0FBVEQsNEJBU0M7QUFBQSxDQUFDO0FBR0ssSUFBSSxvQkFBb0IsR0FBRyxDQUFDLE1BQWMsRUFBRSxXQUFrQyxFQUFFLFdBQXFCLEVBQUUsVUFBYyxFQUFFLE9BQWlCLEVBQUUsRUFBRTtJQUMvSSxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFFekMsbUJBQW1CLEdBQUcsV0FBVyxDQUFDO1FBQ2xDLE1BQU0sTUFBTSxHQUFHLElBQUksNEJBQVksQ0FDM0I7WUFDSSxNQUFNO1lBQ04sV0FBVztTQUNkLENBQ0osQ0FBQztRQUdGLE1BQU0sT0FBTyxHQUFHO1lBQ1osTUFBTTtZQUNOLFFBQVEsRUFBRSxHQUFHO1NBQ2hCLENBQUM7UUFFRixNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFFckIsTUFBTSxTQUFTLEdBQUcsSUFBQSxxQ0FBcUIsRUFBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFNUQsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2YsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBRWpCLElBQUk7WUFFQSxJQUFJLEtBQUssRUFBRSxNQUFNLElBQUksSUFBSSxTQUFTLEVBQUU7Z0JBQ2hDLGNBQWM7Z0JBQ2QsSUFBSSxJQUFJLENBQUMsU0FBUztvQkFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNoRCxrQ0FBa0M7Z0JBQ2xDLDBCQUEwQjtnQkFDMUIsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQzthQUMxRDtTQUVKO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDUixjQUFjO1lBQ2QsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2I7UUFFRCwwQ0FBMEM7UUFDMUMsNkNBQTZDO1FBQzdDLElBQUksR0FBRyxHQUFHO1lBQ04sQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDTixTQUFTLEVBQUUsR0FBRzthQUNqQjtTQUNKLENBQUM7UUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDakIsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUM7QUFoRFMsUUFBQSxvQkFBb0Isd0JBZ0Q3QiIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtMYW1iZGFDbGllbnQsIHBhZ2luYXRlTGlzdEZ1bmN0aW9uc30gZnJvbSBcIkBhd3Mtc2RrL2NsaWVudC1sYW1iZGFcIjtcbmltcG9ydCB7QXdzQ3JlZGVudGlhbElkZW50aXR5fSBmcm9tIFwiQGF3cy1zZGsvdHlwZXNcIjtcblxubGV0IHNlcnZpY2VDYWxsTWFuaWZlc3Q7XG5cbmludGVyZmFjZSBfY2F0Y2hlciB7XG4gICAgaGFuZGxlOiBGdW5jdGlvbixcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBlcm1zKCkge1xuICAgIHJldHVybiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwic2VydmljZVwiOiBcImxhbWJkYVwiLFxuICAgICAgICAgICAgXCJjYWxsXCI6IFwiTGlzdEZ1bmN0aW9uc1wiLFxuICAgICAgICAgICAgXCJwZXJtaXNzaW9uXCI6IFwiTGlzdEZ1bmN0aW9uc1wiLFxuICAgICAgICAgICAgXCJpbml0aWF0b3JcIjogdHJ1ZVxuICAgICAgICB9XG4gICAgXTtcbn07XG5cblxuZXhwb3J0IGxldCBsYW1iZGFfTGlzdEZ1bmN0aW9ucyA9IChyZWdpb246IHN0cmluZywgY3JlZGVudGlhbHM6IEF3c0NyZWRlbnRpYWxJZGVudGl0eSwgc3ZjQ2FsbHNBbGw6IHN0cmluZ1tdLCBvYmpBdHRyaWJzOiB7fSwgY2F0Y2hlcjogX2NhdGNoZXIpID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgIHNlcnZpY2VDYWxsTWFuaWZlc3QgPSBzdmNDYWxsc0FsbDtcbiAgICAgICAgY29uc3QgY2xpZW50ID0gbmV3IExhbWJkYUNsaWVudChcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZWdpb24sXG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbHNcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuXG4gICAgICAgIGNvbnN0IHBDb25maWcgPSB7XG4gICAgICAgICAgICBjbGllbnQsXG4gICAgICAgICAgICBwYWdlU2l6ZTogMTAwLFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGNtZFBhcmFtcyA9IHt9O1xuXG4gICAgICAgIGNvbnN0IHBhZ2luYXRvciA9IHBhZ2luYXRlTGlzdEZ1bmN0aW9ucyhwQ29uZmlnLCBjbWRQYXJhbXMpO1xuXG4gICAgICAgIGNvbnN0IGFyciA9IFtdO1xuICAgICAgICBjb25zdCBfYXJyQyA9IFtdO1xuXG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGZvciBhd2FpdCAoY29uc3QgcGFnZSBvZiBwYWdpbmF0b3IpIHtcbiAgICAgICAgICAgICAgICAvLyBvUkMuaW5jcigpO1xuICAgICAgICAgICAgICAgIGlmIChwYWdlLkZ1bmN0aW9ucykgYXJyLnB1c2goLi4ucGFnZS5GdW5jdGlvbnMpO1xuICAgICAgICAgICAgICAgIC8vIGNhdGNoZXIuaGFuZGxlKHBhZ2UuRnVuY3Rpb25zKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhvYmpBdHRyaWJzKVxuICAgICAgICAgICAgICAgIF9hcnJDLnB1c2goY2F0Y2hlci5oYW5kbGUocGFnZS5GdW5jdGlvbnMsIG9iakF0dHJpYnMpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAvLyBvUkMuaW5jcigpO1xuICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdGhpcy5vYmpHbG9iYWxbcmVnaW9uXS5GdW5jdGlvbnMgPSBhcnI7XG4gICAgICAgIC8vIHJlc29sdmUoYCR7cmVnaW9ufS9sYW1iZGFfTGlzdEZ1bmN0aW9uc2ApO1xuICAgICAgICBsZXQgb2JqID0ge1xuICAgICAgICAgICAgW3JlZ2lvbl06IHtcbiAgICAgICAgICAgICAgICBGdW5jdGlvbnM6IGFyclxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXNvbHZlKG9iaik7XG4gICAgfSk7XG59O1xuIl19