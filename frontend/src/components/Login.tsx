import { useState } from "react";
import axios from "axios";
import styles from "./Login.module.css";

const Login = ({onLogin}: {onLogin: (token: string) => void}) => {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:3000/auth/login", {
                identifier,
                password,
            });

            const {token, user} = res.data;
            onLogin(token);


            setMessage(`Welcome ${user.username || user.email} !`);
        } catch (e: any) {
            setMessage(e.response?.data?.error || "An error occurred during login.");
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Login</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    placeholder="Email or Username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className={styles.input}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                    required
                />
                <button
                    type="submit"
                    className={styles.button}
                >
                    Login
                </button>
            </form>
            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
};

export default Login;