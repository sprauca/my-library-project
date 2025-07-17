import {useEffect, useState} from "react";
import axios from "axios";
import styles from "./Profile.module.css";

type User = {
    id: number;
    email: string;
    username?: string;
    createdAt: string;
};

const Profile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        if(!token || token.length < 10) {
            redirectToLogin("You must be logged in to view your profile.");
            return;
        }

        axios.get("http://localhost:3000/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => setUser(res.data))
            .catch(() => {
                redirectToLogin("Token is invalid or expired.")
            });
    }, []);

    const redirectToLogin = (msg: string) => {
        localStorage.removeItem("token");
        setError(msg);
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    if(error) return <p className={styles.container}>{error}</p>;
    if(!user) return <p className={styles.container}>Loading...</p>;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>👤 My Profile</h2>
            <p className={styles.info}><strong>Email :</strong> {user.email}</p>
            <p className={styles.info}><strong>Username :</strong> {user.username || "N/A"}</p>
            <p className={styles.info}><strong>Member since :</strong> {new Date(user.createdAt).toLocaleDateString()}</p>

            <button onClick={handleLogout} className={styles.button}>
                Logout
            </button>
        </div>
    );
};

export default Profile;