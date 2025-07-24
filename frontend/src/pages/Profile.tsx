import {Box, Heading, VStack, FormControl, FormLabel, Input, Button, useToast} from '@chakra-ui/react';
import {useState} from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

const Profile = () => {
    const {keycloak, initialized} = useAuth();
    const user = keycloak.tokenParsed || {};
    const toast = useToast();

    const [email, setEmail] = useState(user.email || "");
    const [username, setUsername] = useState(user.preferred_username || "");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            await axios.put(
                "http://localhost:3000/me",
                {email, username},
                {headers: {Authorization: `Bearer ${keycloak.token}`}}
            );
            if (password) {
                await axios.put(
                    "http://localhost:3000/me/password",
                    {password},
                    {headers: {Authorization: `Bearer ${keycloak.token}`}}
                );
                toast({title: "Password changed", status: "success"});
                keycloak.logout({redirectUri: window.location.origin});
                return;
            }

            toast({title: "Profile updated", status: "success"});
        } catch (err: any) {
            toast({title: err.response?.data?.error || "Error", status: "error"});
        } finally {
            setLoading(false);
        }
    };

    if (!initialized) return null;

    return (
        <Box maxW="md" mx="auto" p={6} bg="white" borderRadius="md" shadow="md">
            <Heading size="lg" mb={4}>My Profile</Heading>
            <VStack align="stretch" spacing={4}>
                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Username</FormLabel>
                    <Input 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Password</FormLabel>
                        <Input
                            type='password'
                            placeholder='Leave empty if you do not want to modify'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                </FormControl>
                <Button colorScheme="teal" onClick={handleSave} isLoading={loading}>
                    Save
                </Button>
            </VStack>
        </Box>
    );
};

export default Profile;