'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.cognitoidp_ListUserPools = exports.getPerms = void 0;
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
function getPerms() {
    return [
        {
            "service": "cognito-idp",
            "call": "ListUserPools",
            "permission": "ListUserPools",
            "initiator": true
        },
        {
            "service": "cognito-idp",
            "call": "ListUsers",
            "permission": "ListUsers",
            "initiator": false
        },
        {
            "service": "cognito-idp",
            "call": "ListGroups",
            "permission": "ListGroups",
            "initiator": false
        },
    ];
}
exports.getPerms = getPerms;
let cognitoidp_ListGroups = (UserPoolId, client, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {
        const pConfig = {
            client,
            pageSize: 60,
        };
        const cmdParams = {
            UserPoolId,
        };
        const paginator = (0, client_cognito_identity_provider_1.paginateListGroups)(pConfig, cmdParams);
        const arr = [];
        try {
            for await (const page of paginator) {
                if (page.Groups)
                    arr.push(...page.Groups);
            }
        }
        catch (e) {
            reject(e);
        }
        let obj = {
            Groups: [],
        };
        obj.Groups.push(...arr);
        resolve(obj);
    });
};
let cognitoidp_ListUsers = (UserPoolId, client, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {
        const pConfig = {
            client,
            pageSize: 60,
        };
        const cmdParams = {
            UserPoolId,
        };
        const paginator = (0, client_cognito_identity_provider_1.paginateListUsers)(pConfig, cmdParams);
        const arr = [];
        try {
            for await (const page of paginator) {
                if (page.Users)
                    arr.push(...page.Users);
            }
        }
        catch (e) {
            reject(e);
        }
        let obj = {
            Users: [],
        };
        obj.Users.push(...arr);
        resolve(obj);
    });
};
let cognitoidp_ListUserPools = (region, credentials, svcCallsAll, objAttribs, catcher) => {
    return new Promise(async (resolve, reject) => {
        const client = new client_cognito_identity_provider_1.CognitoIdentityProviderClient({
            region,
            credentials,
        });
        const pConfig = {
            client,
            pageSize: 60,
        };
        const _input = {
            MaxResults: 60,
        };
        const paginator = (0, client_cognito_identity_provider_1.paginateListUserPools)(pConfig, _input);
        const arr = [];
        const _arrC = [];
        try {
            for await (const page of paginator) {
                if (page.UserPools)
                    arr.push(...page.UserPools);
                _arrC.push(catcher.handle(page.UserPools, objAttribs));
            }
        }
        catch (e) {
            reject(e);
        }
        let arrPromisesG = [];
        let arrPromisesU = [];
        arr.forEach((objUserPool, i) => {
            if (svcCallsAll.indexOf('ListUsers') > -1) {
                if (objUserPool.Id)
                    arrPromisesU.push(cognitoidp_ListUsers(objUserPool.Id, client, objAttribs, catcher));
            }
            if (svcCallsAll.indexOf('ListGroups') > -1) {
                if (objUserPool.Id)
                    arrPromisesG.push(cognitoidp_ListGroups(objUserPool.Id, client, objAttribs, catcher));
            }
        });
        Promise.all(arrPromisesU)
            .then((arrResourcesUsers) => {
            Promise.all(arrPromisesG)
                .then((arrResourcesGroups) => {
                let objReturn = {
                    [region]: {
                        UserPools: arr,
                        Users: [],
                        Groups: [],
                    }
                };
                arrResourcesUsers.forEach((objResource) => {
                    if (objResource.Users)
                        objReturn[region].Users.push(...objResource.Users);
                });
                arrResourcesGroups.forEach((objResource) => {
                    objReturn[region].Groups.push(...objResource.Groups);
                });
                resolve(objReturn);
            });
        });
    });
};
exports.cognitoidp_ListUserPools = cognitoidp_ListUserPools;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29nbml0b2lkcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvZ25pdG9pZHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7QUFFYixnR0FNbUQ7QUFRbkQsU0FBZ0IsUUFBUTtJQUNwQixPQUFPO1FBQ0g7WUFDSSxTQUFTLEVBQUUsYUFBYTtZQUN4QixNQUFNLEVBQUUsZUFBZTtZQUN2QixZQUFZLEVBQUUsZUFBZTtZQUM3QixXQUFXLEVBQUUsSUFBSTtTQUNwQjtRQUNEO1lBQ0ksU0FBUyxFQUFFLGFBQWE7WUFDeEIsTUFBTSxFQUFFLFdBQVc7WUFDbkIsWUFBWSxFQUFFLFdBQVc7WUFDekIsV0FBVyxFQUFFLEtBQUs7U0FDckI7UUFDRDtZQUNJLFNBQVMsRUFBRSxhQUFhO1lBQ3hCLE1BQU0sRUFBRSxZQUFZO1lBQ3BCLFlBQVksRUFBRSxZQUFZO1lBQzFCLFdBQVcsRUFBRSxLQUFLO1NBQ3JCO0tBQ0osQ0FBQztBQUNOLENBQUM7QUFyQkQsNEJBcUJDO0FBR0QsSUFBSSxxQkFBcUIsR0FBRyxDQUFDLFVBQWtCLEVBQUUsTUFBcUMsRUFBRSxVQUFjLEVBQUUsT0FBaUIsRUFFdEgsRUFBRTtJQUNELE9BQU8sSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUV6QyxNQUFNLE9BQU8sR0FBRztZQUNaLE1BQU07WUFDTixRQUFRLEVBQUUsRUFBRTtTQUNmLENBQUM7UUFFRixNQUFNLFNBQVMsR0FBRztZQUNkLFVBQVU7U0FDYixDQUFDO1FBRUYsTUFBTSxTQUFTLEdBQUcsSUFBQSxxREFBa0IsRUFBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFekQsTUFBTSxHQUFHLEdBQWdCLEVBQUUsQ0FBQztRQUU1QixJQUFJO1lBRUEsSUFBSSxLQUFLLEVBQUUsTUFBTSxJQUFJLElBQUksU0FBUyxFQUFFO2dCQUNoQyxJQUFJLElBQUksQ0FBQyxNQUFNO29CQUFFLEdBQUcs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QUMsQ0FBQyxDQUFDO2dCQUNILGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFO29CQUV2QyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDekQsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBRXZCLENBQUMsQ0FBQyxDQUFDO1FBRVgsQ0FBQyxDQUFDLENBQUM7SUFFWCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQztBQXRGUyxRQUFBLHdCQUF3Qiw0QkFzRmpDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge1xuICAgIENvZ25pdG9JZGVudGl0eVByb3ZpZGVyQ2xpZW50LFxuICAgIHBhZ2luYXRlTGlzdFVzZXJQb29scyxcbiAgICBwYWdpbmF0ZUxpc3RVc2VycyxcbiAgICBwYWdpbmF0ZUxpc3RHcm91cHMsXG4gICAgTGlzdEdyb3Vwc0NvbW1hbmRPdXRwdXQsIEdyb3VwVHlwZSwgVXNlclR5cGUsIFVzZXJQb29sVHlwZSwgTGlzdFVzZXJQb29sc0NvbW1hbmRJbnB1dCxcbn0gZnJvbSAnQGF3cy1zZGsvY2xpZW50LWNvZ25pdG8taWRlbnRpdHktcHJvdmlkZXInO1xuaW1wb3J0IHtBd3NDcmVkZW50aWFsSWRlbnRpdHl9IGZyb20gXCJAYXdzLXNkay90eXBlc1wiO1xuXG5cbmludGVyZmFjZSBfY2F0Y2hlciB7XG4gICAgaGFuZGxlOiBGdW5jdGlvbixcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBlcm1zKCkge1xuICAgIHJldHVybiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwic2VydmljZVwiOiBcImNvZ25pdG8taWRwXCIsXG4gICAgICAgICAgICBcImNhbGxcIjogXCJMaXN0VXNlclBvb2xzXCIsXG4gICAgICAgICAgICBcInBlcm1pc3Npb25cIjogXCJMaXN0VXNlclBvb2xzXCIsXG4gICAgICAgICAgICBcImluaXRpYXRvclwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwic2VydmljZVwiOiBcImNvZ25pdG8taWRwXCIsXG4gICAgICAgICAgICBcImNhbGxcIjogXCJMaXN0VXNlcnNcIixcbiAgICAgICAgICAgIFwicGVybWlzc2lvblwiOiBcIkxpc3RVc2Vyc1wiLFxuICAgICAgICAgICAgXCJpbml0aWF0b3JcIjogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJzZXJ2aWNlXCI6IFwiY29nbml0by1pZHBcIixcbiAgICAgICAgICAgIFwiY2FsbFwiOiBcIkxpc3RHcm91cHNcIixcbiAgICAgICAgICAgIFwicGVybWlzc2lvblwiOiBcIkxpc3RHcm91cHNcIixcbiAgICAgICAgICAgIFwiaW5pdGlhdG9yXCI6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgXTtcbn1cblxuXG5sZXQgY29nbml0b2lkcF9MaXN0R3JvdXBzID0gKFVzZXJQb29sSWQ6IHN0cmluZywgY2xpZW50OiBDb2duaXRvSWRlbnRpdHlQcm92aWRlckNsaWVudCwgb2JqQXR0cmliczoge30sIGNhdGNoZXI6IF9jYXRjaGVyKTogUHJvbWlzZTx7XG4gICAgR3JvdXBzOiBHcm91cFR5cGVbXVxufT4gPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgY29uc3QgcENvbmZpZyA9IHtcbiAgICAgICAgICAgIGNsaWVudCxcbiAgICAgICAgICAgIHBhZ2VTaXplOiA2MCxcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBjbWRQYXJhbXMgPSB7XG4gICAgICAgICAgICBVc2VyUG9vbElkLFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHBhZ2luYXRvciA9IHBhZ2luYXRlTGlzdEdyb3VwcyhwQ29uZmlnLCBjbWRQYXJhbXMpO1xuXG4gICAgICAgIGNvbnN0IGFycjogR3JvdXBUeXBlW10gPSBbXTtcblxuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBmb3IgYXdhaXQgKGNvbnN0IHBhZ2Ugb2YgcGFnaW5hdG9yKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhZ2UuR3JvdXBzKSBhcnIucHVzaCguLi5wYWdlLkdyb3Vwcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcblxuICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICB9XG5cblxuICAgICAgICBsZXQgb2JqOiB7XG4gICAgICAgICAgICBHcm91cHM6IEdyb3VwVHlwZVtdLFxuICAgICAgICB9ID0ge1xuICAgICAgICAgICAgR3JvdXBzOiBbXSxcbiAgICAgICAgfTtcblxuICAgICAgICBvYmouR3JvdXBzLnB1c2goLi4uYXJyKTtcblxuICAgICAgICByZXNvbHZlKG9iaik7XG5cbiAgICB9KTtcbn07XG5cblxubGV0IGNvZ25pdG9pZHBfTGlzdFVzZXJzID0gKFVzZXJQb29sSWQ6IHN0cmluZywgY2xpZW50OiBDb2duaXRvSWRlbnRpdHlQcm92aWRlckNsaWVudCwgb2JqQXR0cmliczoge30sIGNhdGNoZXI6IF9jYXRjaGVyKTogUHJvbWlzZTx7XG4gICAgVXNlcnM6IFVzZXJUeXBlW11cbn0+ID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgIGNvbnN0IHBDb25maWcgPSB7XG4gICAgICAgICAgICBjbGllbnQsXG4gICAgICAgICAgICBwYWdlU2l6ZTogNjAsXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgY21kUGFyYW1zID0ge1xuICAgICAgICAgICAgVXNlclBvb2xJZCxcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBwYWdpbmF0b3IgPSBwYWdpbmF0ZUxpc3RVc2VycyhwQ29uZmlnLCBjbWRQYXJhbXMpO1xuXG4gICAgICAgIGNvbnN0IGFyciA9IFtdO1xuXG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGZvciBhd2FpdCAoY29uc3QgcGFnZSBvZiBwYWdpbmF0b3IpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFnZS5Vc2VycykgYXJyLnB1c2goLi4ucGFnZS5Vc2Vycyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcblxuICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG9iajoge1xuICAgICAgICAgICAgVXNlcnM6IFVzZXJUeXBlW10sXG4gICAgICAgIH0gPSB7XG4gICAgICAgICAgICBVc2VyczogW10sXG4gICAgICAgIH07XG5cbiAgICAgICAgb2JqLlVzZXJzLnB1c2goLi4uYXJyKTtcblxuICAgICAgICByZXNvbHZlKG9iaik7XG5cblxuICAgIH0pO1xufTtcblxuXG5leHBvcnQgbGV0IGNvZ25pdG9pZHBfTGlzdFVzZXJQb29scyA9IChyZWdpb246IHN0cmluZywgY3JlZGVudGlhbHM6IEF3c0NyZWRlbnRpYWxJZGVudGl0eSwgc3ZjQ2FsbHNBbGw6IHN0cmluZ1tdLCBvYmpBdHRyaWJzOiB7fSwgY2F0Y2hlcjogX2NhdGNoZXIpID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgIGNvbnN0IGNsaWVudCA9IG5ldyBDb2duaXRvSWRlbnRpdHlQcm92aWRlckNsaWVudChcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZWdpb24sXG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbHMsXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgcENvbmZpZyA9IHtcbiAgICAgICAgICAgIGNsaWVudCxcbiAgICAgICAgICAgIHBhZ2VTaXplOiA2MCxcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBfaW5wdXQ6IExpc3RVc2VyUG9vbHNDb21tYW5kSW5wdXQgPSB7XG4gICAgICAgICAgICBNYXhSZXN1bHRzOiA2MCxcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgcGFnaW5hdG9yID0gcGFnaW5hdGVMaXN0VXNlclBvb2xzKHBDb25maWcsIF9pbnB1dCk7XG5cbiAgICAgICAgY29uc3QgYXJyOiBVc2VyUG9vbFR5cGVbXSA9IFtdO1xuICAgICAgICBjb25zdCBfYXJyQyA9IFtdO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmb3IgYXdhaXQgKGNvbnN0IHBhZ2Ugb2YgcGFnaW5hdG9yKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhZ2UuVXNlclBvb2xzKSBhcnIucHVzaCguLi5wYWdlLlVzZXJQb29scyk7XG4gICAgICAgICAgICAgICAgX2FyckMucHVzaChjYXRjaGVyLmhhbmRsZShwYWdlLlVzZXJQb29scywgb2JqQXR0cmlicykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGxldCBhcnJQcm9taXNlc0c6IFByb21pc2U8e1xuICAgICAgICAgICAgR3JvdXBzOiBHcm91cFR5cGVbXVxuICAgICAgICB9PltdID0gW107XG4gICAgICAgIGxldCBhcnJQcm9taXNlc1U6IFByb21pc2U8e1xuICAgICAgICAgICAgVXNlcnM6IFVzZXJUeXBlW11cbiAgICAgICAgfT5bXSA9IFtdO1xuXG5cbiAgICAgICAgYXJyLmZvckVhY2goKG9ialVzZXJQb29sLCBpKSA9PiB7XG5cbiAgICAgICAgICAgIGlmIChzdmNDYWxsc0FsbC5pbmRleE9mKCdMaXN0VXNlcnMnKSA+IC0xKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAob2JqVXNlclBvb2wuSWQpIGFyclByb21pc2VzVS5wdXNoKGNvZ25pdG9pZHBfTGlzdFVzZXJzKG9ialVzZXJQb29sLklkLCBjbGllbnQsIG9iakF0dHJpYnMsIGNhdGNoZXIpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHN2Y0NhbGxzQWxsLmluZGV4T2YoJ0xpc3RHcm91cHMnKSA+IC0xKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAob2JqVXNlclBvb2wuSWQpIGFyclByb21pc2VzRy5wdXNoKGNvZ25pdG9pZHBfTGlzdEdyb3VwcyhvYmpVc2VyUG9vbC5JZCwgY2xpZW50LCBvYmpBdHRyaWJzLCBjYXRjaGVyKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cblxuICAgICAgICBQcm9taXNlLmFsbChhcnJQcm9taXNlc1UpXG4gICAgICAgICAgICAudGhlbigoYXJyUmVzb3VyY2VzVXNlcnMpID0+IHtcblxuICAgICAgICAgICAgICAgIFByb21pc2UuYWxsKGFyclByb21pc2VzRylcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGFyclJlc291cmNlc0dyb3VwcykgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgb2JqUmV0dXJuID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtyZWdpb25dOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFVzZXJQb29sczogYXJyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBVc2VyczogPFVzZXJUeXBlW10+W10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEdyb3VwczogPEdyb3VwVHlwZVtdPltdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGFyclJlc291cmNlc1VzZXJzLmZvckVhY2goKG9ialJlc291cmNlKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqUmVzb3VyY2UuVXNlcnMpIG9ialJldHVybltyZWdpb25dLlVzZXJzLnB1c2goLi4ub2JqUmVzb3VyY2UuVXNlcnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJSZXNvdXJjZXNHcm91cHMuZm9yRWFjaCgob2JqUmVzb3VyY2UpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ialJldHVybltyZWdpb25dLkdyb3Vwcy5wdXNoKC4uLm9ialJlc291cmNlLkdyb3Vwcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvYmpSZXR1cm4pO1xuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgIH0pO1xufTtcbiJdfQ==