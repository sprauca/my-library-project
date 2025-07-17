import { useEffect, useState } from "react";
import axios from "axios";
import type { Game } from "../types/Game";

const GameList = () => {
    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        axios.get("http://localhost:3000/games")
            .then(res => setGames(res.data))
            .catch(() => console.error("Error fetching games:"));
    }, []);

    return (
        <div style={{maxWidth: "800px", margin: "2rem auto"}}>
            <h2 style={{fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem"}}>
                🎮 My Games
            </h2>
            {games.length > 0 ? (
                <p>No games for the moment.</p>
            ) : (
                <ul style={{listStyle: "none", padding: 0}}>
                    {games.map(game => (
                        <li 
                            key={game.id} 
                            style={{
                                borderBottom: "1px solid #ddd",
                                padding: "1rem 0",
                            }}
                        >
                            <strong>{game.title}</strong> - <em>{game.platform}</em><br />
                            Status : {game.status}
                            {game.sourceUrl && (
                                <div>
                                    🔗<a href={game.sourceUrl} target="blank" style={{textDecoration: "none", color: "#007bff"}}>
                                        View Source
                                    </a>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default GameList;