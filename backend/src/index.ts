import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { configureKeycloak } from "./middlewares/keycloak";
import gameRoutes from "./routes/games";
import meRoutes from "./routes/me";

dotenv.config();
const app = express();

app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

app.use(express.json());

const keycloak = configureKeycloak(app);

app.get("/", (_req, res) => res.send("🚀 OK!"));

app.use("/games", keycloak.protect(), gameRoutes);
app.use("/me", keycloak.protect(), meRoutes);

const port = +process.env.PORT! || 3000;
app.listen(port, () => {
    console.log(`🚀 Listening on ${port}`);
});
