import { Button, Container, Heading, Text, VStack, Center } from "@chakra-ui/react";
import useAuth from "../hooks/useAuth";

const Home = () => {
    const { keycloak, authenticated } = useAuth();

    const handleLogin = () =>
        keycloak.login({ redirectUri: window.location.origin + "/games" });
    const handleLogout = () =>
        keycloak.logout({ redirectUri: window.location.origin });

    return (
        <Container maxW="container.md" centerContent py={12}>
            <VStack spacing={6}>
                {authenticated ? (
                    <Center>
                        <Button colorScheme="red" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Center>
                ) : (
                    <>
                        <Heading size="xl" textAlign="center">
                            Welcome to My Library
                        </Heading>
                        <Text>Please login to access your library.</Text>
                        <Button colorScheme="teal" textAlign="center" onClick={handleLogin}>
                            Login / Register
                        </Button>
                    </>
                )}
            </VStack>
        </Container>
    );
};

export default Home;
