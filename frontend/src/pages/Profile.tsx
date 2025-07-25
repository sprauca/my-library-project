import { Box, Heading, Text, Button } from "@chakra-ui/react";
import useAuth from "../hooks/useAuth";

const Profile = () => {
    const { keycloak } = useAuth();
    const user = keycloak.tokenParsed;

    return (
        <Box p={6}>
            <Heading mb={4}>👤 Mon Profil</Heading>
            <Text>Email : {user?.email || "Non disponible"}</Text>
            <Text>Nom d'utilisateur : {user?.preferred_username || "Inconnu"}</Text>

            <Button mt={4} onClick={() => keycloak.logout({ redirectUri: window.location.origin })}>
                Se déconnecter
            </Button>
        </Box>
    );
};

export default Profile;
