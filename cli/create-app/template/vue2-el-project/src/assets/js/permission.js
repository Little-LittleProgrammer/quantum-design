// 匹配后台返回的权限路由
export function generateRoutes(userRoutes, asyncRoutes) {
    let permission_routes = [];
    asyncRoutes.forEach(asyncRoute => {
        userRoutes.forEach(userRoute => {
            if (userRoute.name === asyncRoute.name) {
                if (userRoute.child && userRoute.child.length) {
                    asyncRoute.children = generateRoutes(
                        userRoute.child,
                        asyncRoute.children
                    );
                }
                permission_routes.push(asyncRoute);
            }
        });
    });
    return permission_routes;
}