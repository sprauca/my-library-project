import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { configureKeycloak } from "./middlewares/keycloak";
import gameRoutes from "./routes/games";
import meRoutes from "./routes/me";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const keycloak = configureKeycloak(app);

app.get("/", (_req, res) => {
    res.send("🚀 Backend is running!");
});

app.use("/games", keycloak.protect(), gameRoutes);
app.use("/me", keycloak.protect(), meRoutes);

const port = parseInt(process.env.PORT || "3000", 10);
app.listen(port, () => {
    console.log(`🚀 Backend is listening on http://localhost:${port}`);
});
