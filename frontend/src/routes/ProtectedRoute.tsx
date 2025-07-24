import {type ReactNode} from 'react';
import {Navigate} from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import {Box, Text} from '@chakra-ui/react';

type ProtectedRouteProps = {
    children: ReactNode;
    roles?: string[];
};

const ProtectedRoute = ({children, roles}: ProtectedRouteProps) => {
    const {keycloak, authenticated} = useAuth();

    if (!keycloak || !authenticated) {
        return <Navigate to="/" />;
    }

    if (roles && !roles.some((role) => keycloak.hasRealmRole(role))) {
        return (
            <Box textAlign="center" mt={20} p={4}>
                <Text fontSize="xl" color="red.500" fontWeight="bold">
                    Access denied.
                </Text>
                <Text mt={2}>You do not have the necessary permissions to access this page.</Text>
            </Box>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;