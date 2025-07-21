import Games from "./Games";
import styles from "./Dashboard.module.css";
const Dashboard = () => {
    return (
        <div className={styles.container}>
            <Games />
        </div>
    );
};

export default Dashboard;