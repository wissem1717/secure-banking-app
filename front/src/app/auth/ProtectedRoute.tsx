import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
    role: string
}

export const ProtectedRoute = ({ children, ...props }: React.PropsWithChildren<ProtectedRouteProps>) => {
    const { user } = useAuth();
    if (!user || user.role != props.role) {
        // user is not authenticated
        return <Navigate to="/login" />;
    }
    return children
}