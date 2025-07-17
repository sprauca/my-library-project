import { useState } from "react";
import axios from "axios";

type AddGameProps = {
    userId: number;
    onAdd: () => void;
};

const AddGame = ({userId, onAdd}: AddGameProps) => {
    const [title, setTitle] = useState("");
    const [platform, setPlatform] = useState("");
    const [status, setStatus] = useState("not installed");
    const [sourceUrl, setSourceUrl] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axios.post("http://localhost:3000/games", {
                title,
                platform,
                status,
                sourceUrl: sourceUrl || undefined,
                userId
            });

            setTitle("");
            setPlatform("");
            setStatus("not installed");
            setSourceUrl("");
            onAdd();
        } catch (e) {
            console.error("Error adding game:", e);
        }
    };

    return (
        <form onSubmit={handleSubmit}  style={{marginBottom: "2rem"}}>
            <h3>➕ Add a new game</h3>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            /> <br />
            <input
                type="text"
                placeholder="Platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                required
            /> <br />
            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            >
                <option value="not installed">Not Installed</option>
                <option value="installed">Installed</option>
                <option value="playing">Playing</option>
                <option value="completed">Completed</option>
            </select> <br />
            <input
                type="text"
                placeholder="Source URL"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
            /> <br />
            <button type="submit">Add Game</button>
        </form>
    );
};

export default AddGame;