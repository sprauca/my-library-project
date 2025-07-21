import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import axios from "axios";

type Game = {
    id: number;
    title: string;
    platform: string;
    status: string;
    sourceUrl?: string;
    createdAt: string;
};

const Games = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [error, setError] = useState("");
    const { keycloak } = useAuth();

    useEffect(() => {
        if (!keycloak.token) return;

            axios.get("http://localhost:3000/games", {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                },
            })
                .then((res) => setGames(res.data))
                .catch(() => setError("Could not fetch games."));
        }, [keycloak.token]);

    if (error) return <p>{error}</p>;
    if (games.length === 0) return <p>No games for the moment.</p>;

    return (
        <div>
            <h2>🎮 My Games</h2>
            <ul>
                {games.map((game) => (
                    <li key={game.id}>
                        <strong>{game.title}</strong> - {game.platform} - {game.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Games;