import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router";

export const ProtectedRoute = () => {
    const { user } = useAuth();
    if (!user) {
        // user is not authenticated
        return <Navigate to="/login" />;
    }
    return <Outlet />
}