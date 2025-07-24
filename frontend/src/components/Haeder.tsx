import {Box, Flex, Heading, Spacer, Button, Link as ChakraLink} from '@chakra-ui/react';
import {Link} from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Header = () => {
    const {keycloak, authenticated} = useAuth();

    const handleLogin = () => 
        keycloak.login({redirectUri: window.location.origin + "/games"});

    const handleLogout = () => 
        keycloak.logout({redirectUri: window.location.origin});

    const isAdmin = keycloak?.tokenParsed?.realm_access?.roles?.includes("admin");

    return (
        <Box bg="gray.800" color="white" px={6} py={4}>
            <Flex align="center">
                <Heading size="md">
                    <ChakraLink as={Link} to="/" _hover={{textDecoration: "none"}}>
                        My Library
                    </ChakraLink>
                </Heading>

                <Spacer/>

                <Flex gap={4} align="center">
                    {authenticated && (
                        <>
                            <ChakraLink as={Link} to="/games">
                                My Games
                            </ChakraLink>
                            {isAdmin && (
                                <ChakraLink as={Link} to="/admin">
                                    Admin
                                </ChakraLink>
                            )}
                        </>
                    )}

                    {authenticated ? (
                        <Button size="sm" onClick={handleLogout} colorScheme="red">
                            Logout
                        </Button>
                    ) : (
                        <Button size="sm" onClick={handleLogin} colorScheme="blue">
                            Login
                        </Button>
                    )}
                </Flex>
            </Flex>
        </Box>
    );
};

export default Header;