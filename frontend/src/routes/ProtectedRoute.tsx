import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
    const { authenticated, isLoading } = useAuth();

    if (isLoading) return <p>Loading...</p>;

    return authenticated ? <>{children}</> : <Navigate to="/" />;
};

export default ProtectedRoute;