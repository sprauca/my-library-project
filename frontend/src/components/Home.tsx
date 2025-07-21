import useAuth from "../hooks/useAuth";

const Home = () => {
    const { keycloak } = useAuth();

    const handleLogin = () => keycloak.login();
    const handleLogout = () => keycloak.logout();

    return (
        <div>
            <h1>My Library App</h1>

            {keycloak.authenticated ? (
                <>
                    <p>Welcome, {keycloak.tokenParsed?.preferred_username} !</p>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>
                    <p>Login in to access your library.</p>
                    <button onClick={handleLogin}>Login / Register</button>
                </>
            )}
        </div>
    );
};

export default Home;