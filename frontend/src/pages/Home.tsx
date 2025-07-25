import { Button, Container, Heading, Text, VStack, Center, HStack } from "@chakra-ui/react";
import useAuth from "../hooks/useAuth";

const Home = () => {
    const { keycloak, authenticated } = useAuth();

    const handleLogin = () =>
        keycloak.login({ redirectUri: window.location.origin + "/games" });

    const handleLogout = () =>
        keycloak.logout({ redirectUri: window.location.origin });

    const handleEditProfile = () => 
        keycloak.accountManagement();

    return (
        <Container maxW="container.md" centerContent py={12}>
            <VStack spacing={6}>
                <Heading size="xl" textAlign="center">
                    Welcome to My Library
                </Heading>

                {authenticated ? (
                    <Center>
                        <Text>You're logged in as <strong>{keycloak.tokenParsed?.preferred_username}</strong>.</Text>
                        <HStack spacing={4}>
                            <Button colorScheme="blue" onClick={handleEditProfile}>
                                Edit Profile
                            </Button>
                            <Button colorScheme="red" onClick={handleLogout}>
                                Logout
                            </Button>
                        </HStack>
                    </Center>
                ) : (
                    <Center>
                        <Text>Please login to access your library.</Text>
                        <Button colorScheme="teal" textAlign="center" onClick={handleLogin}>
                            Login / Register
                        </Button>
                    </Center>
                )}
            </VStack>
        </Container>
    );
};

export default Home;
