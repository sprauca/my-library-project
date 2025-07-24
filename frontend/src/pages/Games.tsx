import {useEffect, useState} from 'react';
import {Container, Heading, Text, Stack, Spinner, Alert, AlertIcon} from '@chakra-ui/react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

type Game = {
    id: number;
    title: string;
    platform: string;
    status: string;
    sourceUrl?: string;
    createdAt: string;
};

const Games = () => {
    const {keycloak} = useAuth();
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!keycloak.token) return;

        axios
            .get("http://localhost:3000/games", {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                },
            })
            .then((res) => setGames(res.data))
            .catch(() => setError("Games not found."))
            .finally(() => setLoading(false));
    }, [keycloak.token]);

    return (
        <Container maxW="4xl" mx="auto" p={8}>
            <Heading mb={4}>My Games Library</Heading>

            {loading ? (
                <Spinner size="lg" />
            ) : error ? (
                <Alert status="error">
                    <AlertIcon />
                    {error}
                </Alert>
            ) : games.length === 0 ? (
                <Text>No games found.</Text>
            ) : (
                <Stack spacing={4}>
                    {games.map((game) => (
                        <Container key={game.id} p={4} borderWidth="1px" borderRadius="md">
                            <Heading size="md">{game.title}</Heading>
                            <Text>Platform: {game.platform}</Text>
                            <Text>Status: {game.status}</Text>
                            {game.sourceUrl && (
                                <Text color="blue.500" isTruncated>
                                    <a href={game.sourceUrl} target="_blank">{game.sourceUrl}</a>
                                </Text>
                            )}
                        </Container>
                    ))}
                </Stack>
            )}
        </Container>
    );
};

export default Games;