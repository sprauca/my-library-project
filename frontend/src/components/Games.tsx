import {useEffect, useState} from "react";
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

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("You must be logged in to see your games.");
            return;
        }

        axios.get("http://localhost:3000/games", {
            headers: {
                "Authorization": `Bearer ${token}`
            },
        })
        .then((res) => setGames(res.data))
        .catch(() => setError("Could not load games (maybe your token expired?)"));
    }, []);

    if (error) return <p>{error}</p>;
    if (games.length === 0) return <p>No games found.</p>;

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