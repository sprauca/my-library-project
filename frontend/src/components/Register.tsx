import { useState } from "react";
import axios from "axios";
import styles from "./Register.module.css";

const Register = ({onRegister}: {onRegister: (token: string) => void}) => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axios.post("http://localhost:3000/users", {
                email,
                username,
                password,
            });

            const res = await axios.post("http://localhost:3000/auth/login", {
                identifier: email,
                password,
            })

            const { token } = res.data;

            setMessage(`Registration successful! Welcome ${username || email}!`);
            setEmail("");
            setUsername("");
            setPassword("");

            onRegister(token);

        } catch (e: any) {
            setMessage(e.response?.data?.error || "An error occurred during registration.");
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Registration</h2>
            <form onSubmit={handleRegister} className={styles.form}>
                <input 
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    required
                />
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                <button type="submit" className={styles.button}>
                    Register
                </button>
            </form>
            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
};

export default Register;