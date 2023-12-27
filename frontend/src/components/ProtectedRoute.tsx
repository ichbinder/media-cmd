import React, { FunctionComponent, PropsWithChildren } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

type ProtectedRouteProps = {
    isAllowed: boolean;
    redirectPath?: string;
};

const ProtectedRoute: FunctionComponent<PropsWithChildren<ProtectedRouteProps>> = (props) => {
    const { isAllowed, redirectPath = '/login', children } = props;
    if (!isAllowed) {
        return <Navigate to={redirectPath} replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;