import { useLocation, Navigate, Outlet} from "react-router-dom";
import useAuth from "../Hooks/useAuth";

export const AuthComponents = ({authProp}: any) => {
    const { auth } : any = useAuth();
    const location = useLocation();

    return (
        auth?.userRoles?.find((role : any) => authProp?.allowedRoles?.includes(role))
            ? <Outlet />
            : auth?.username
                ? <Navigate to="/unauthorized" state ={{from: location}} replace />
                : <Navigate to="/" state ={{from: location}} replace />
    );
}