import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./components/Home";
import Games from "./components/Games";
import Dashboard from "./components/Dashboard";
// import Admin from "./components/Admin";
import { useAuth } from "./context/AuthProvider";
import ProtectedRoute from "./routes/ProtectedRoute";
function App() {
    const { initialized, authenticated } = useAuth();
    console.log("initialized:", initialized, "authenticated:", authenticated);

    if (!initialized) return <p>Loading auth...</p>;

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />

                <Route
                    path="/games"
                    element={
                        <ProtectedRoute>
                            <Games />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                {/* <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <Admin />
                        </ProtectedRoute>
                    }
                /> */}
            </Routes>
        </Router>
    );
}

export default App;