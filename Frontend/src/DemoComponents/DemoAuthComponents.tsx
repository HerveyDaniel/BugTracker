import { Navigate, useLocation, Outlet } from "react-router-dom";
import useAuth from "../Hooks/useAuth";

export const DemoAuthComponents = ({demoAuthProp}: any) => {
    const { auth } : any = useAuth();
    const location = useLocation();

    return (
        auth?.userRoles?.find((role : any) => demoAuthProp?.allowedRoles?.includes(role))
            ? <Outlet />
            : auth?.username
                ? <Navigate to="/unauthorized" state ={{from: location}} replace />
                : <Navigate to="/" state ={{from: location}} replace />
    );
}