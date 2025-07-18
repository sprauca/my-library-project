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
    const [title, setTitle] = useState("");
    const [platform, setPlatform] = useState("");
    const [status, setStatus] = useState("installed");
    const [sourceUrl, setSourceUrl] = useState("");

    const token = localStorage.getItem("token");

    const fetchGames = async () => {
        try {
            const res = await axios.get("http://localhost:3000/games", {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            setGames(res.data);
        } catch {
            setError("Could not load games (maybe your token expired?)");
        }
    };

    useEffect(() => {
        if (!token) {
            setError("You must be logged in to see your games.");
            return;
        }
        fetchGames();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(
                "http://localhost:3000/games",
                {title, platform, status, sourceUrl},
                {headers: {Authorization: `Bearer ${token}`}}
            );
            setTitle("");
            setPlatform("");
            setStatus("installed");
            setSourceUrl("");
            fetchGames();
        } catch (e: any) {
            setError(e.res?.data?.error || "Could not add game.");
        }
    };

    return (
        <div style={{maxWidth: "600px", margin: "2rem auto"}}>
            <h2>🎮 My Games</h2>

            <form onSubmit={handleSubmit} style={{marginBottom: "2rem"}}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="installed">Installed</option>
                    <option value="not installed">Not Installed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
                <input
                    type="url"
                    placeholder="Platform"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    required
                />
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="installed">Installed</option>
                    <option value="not installed">Not Installed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
                <input
                    type="url"
                    placeholder="Source URL"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                />
                <button type="submit">Add Game</button>
            </form>
            {error && <p style={{color: "red"}}>{error}</p>}
            {games.length === 0 ? (
                <p>No games found.</p>
            ) : (
                <ul>
                    {games.map((game) => (
                        <li key={game.id}>
                            <strong>{game.title}</strong> - {game.platform} - {game.status}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Games;