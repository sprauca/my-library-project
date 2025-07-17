import { useState, useEffect } from "react";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Register from "./components/Register";

function App() {
    const [view, setView] = useState<"login" | "register">("login");
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("token");
        setToken(stored);
    }, []);

    if (token) return <Profile />;

    return (
        <div>
            {view === "login" ? (
                <>
                    <Login onLogin={(token) => {
                        localStorage.setItem("token", token);
                        setToken(token);
                    }}/>
                    <p style={{textAlign: "center", marginTop: "1rem"}}>
                        Don't have an account ?{" "}
                        <button 
                            onClick={() => setView("register")}
                            style={{color: "#2563EB", background: "none", border: "none", fontSize: "1rem", cursor: "pointer"}}
                        >
                            Register
                        </button>
                    </p>
                </>
            ) : (
                <>
                    <Register onRegister={(token) => {
                        localStorage.setItem("token", token);
                        setToken(token);
                    }}/>
                    <p style={{textAlign: "center", marginTop: "1rem"}}>
                        Already have an account ?{" "}
                        <button
                            onClick={() => setView("login")}
                            style={{color: "#2563EB", background: "none", border: "none", fontSize: "1rem", cursor: "pointer"}}
                        >
                            Login
                        </button>
                    </p>
                </>
            )}
        </div>
    );
}

export default App;