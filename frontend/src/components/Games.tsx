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

    const [editId, setEditId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editPlatform, setEditPlatform] = useState("");
    const [editStatus, setEditStatus] = useState("");

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

    const startEdit = (game: Game) => {
        setEditId(game.id);
        setEditTitle(game.title);
        setEditPlatform(game.platform);
        setEditStatus(game.status);
    };

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

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:3000/games/${id}`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            fetchGames();
        } catch (e: any) {
            setError(e.res?.data?.error || "Could not delete game.");
        }
    };

    const handleUpdate = async (id: number) => {
        try {
            await axios.put(
                `http://localhost:3000/games/${id}`,
                {title: editTitle, platform: editPlatform, status: editStatus},
                {headers: {Authorization: `Bearer ${token}`}}
            );
            setEditId(null);
            fetchGames();
        } catch (e: any) {
            setError(e.res?.data?.error || "Could not update game.");
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
                            {editId === game.id ? (
                                <div>
                                    <input
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                    />
                                    <input
                                        value={editPlatform}
                                        onChange={(e) => setEditPlatform(e.target.value)}
                                    />
                                    <select
                                        value={editStatus}
                                        onChange={(e) => setEditStatus(e.target.value)}
                                    >
                                        <option value="installed">Installed</option>
                                        <option value="not installed">Not Installed</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                    <button onClick={() => handleUpdate(game.id)}>Update</button>
                                    <button onClick={(() => setEditId(null))}>Cancel</button>
                                </div>
                            ) : (
                                <div>
                                    <strong>{game.title}</strong> - {game.platform} - {game.status}
                                    <button
                                        onClick={() => startEdit(game)}
                                        style={{marginLeft: "1rem"}}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(game.id)}
                                        style={{marginLeft: "1rem", color: "red"}}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Games;