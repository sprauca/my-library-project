import {Box, Heading, Text, Button, VStack} from '@chakra-ui/react';
import useAuth from '../hooks/useAuth';

const Profile = () => {
    const {keycloak} = useAuth();
    const user = keycloak.tokenParsed || {};

    return (
        <Box maxW="md" mx="auto" p={6} bg="white" borderRadius="md" shadow="md">
            <Heading size="lg" mb={4}>Profile</Heading>
            <VStack align="start" spacing={2}>
                <Text>Email: {user?.email || "NA"}</Text>
                <Text>Username: {user?.preferred_username || "Unknow"}</Text>
            </VStack>
            <Button mt={2} colorScheme="blue" onClick={() => keycloak.accountManagement()}>
                Edit Profile
            </Button>
            <Button mt={4} colorScheme="red" onClick={() => keycloak.logout({redirectUri: window.location.origin})}>
                Logout
            </Button>
        </Box>
    )
};

export default Profile;