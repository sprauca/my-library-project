import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

function App() {
    const token = localStorage.getItem("token");
    const [view, setView] = useState<"login" | "register">("login");

    if (token) return <Dashboard />;

    return (
        <div>
            {view === "login" ? (
                <>
                    <Login onLogin={() => window.location.reload()} />
                    <p style={{textAlign: "center", marginTop: "1rem"}}>
                        Don't have an account ?{" "}
                        <button onClick={() => setView("register")}>Register</button>
                    </p>
                </>
            ) : (
                <>
                    <Register onRegister={() => window.location.reload()}/>
                    <p style={{textAlign: "center", marginTop: "1rem"}}>
                        Already have an account ?{" "}
                        <button onClick={() => setView("login")}>Login</button>
                    </p>
                </>
            )}
        </div>
    );
}

export default App;