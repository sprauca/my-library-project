import { Button, Container, Heading, Text, VStack} from "@chakra-ui/react";
import useAuth from "../hooks/useAuth";

const Home = () => {
    const {keycloak, authenticated} = useAuth();

    const handleLogin = () => keycloak.login({redirectUri: window.location.origin + "/games"});
    const handleLogout = () => keycloak.logout({redirectUri: window.location.origin});

    return (
        <Container maxW="container.md" centerContent py={12}>
            <VStack spacing={6}>
                <Heading size="xl" textAlign="center">
                    Welcome to My Library
                </Heading>

                {authenticated ? (
                    <>
                        <Text>Please login to access your library.</Text>
                        <Button colorScheme="teal" onClick={handleLogin}>
                            Login / Register
                        </Button>
                    </>
                ) : (
                    <>
                        <Text>Welcome, {keycloak.tokenParsed?.preferred_username} !</Text>
                        <Button colorScheme="red" onClick={handleLogout}>
                            Logout
                        </Button>
                    </>
                )}
            </VStack>
        </Container>
    );
};

export default Home;