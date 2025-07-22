# 🔐 Stack Auth & IA locale — Keycloak + PostgreSQL + TabbyML

Configuration Docker regroupée pour un environnement de dev avec :

-   🧱 Keycloak (authentification)
-   🐘 PostgreSQL (base de données pour Keycloak)
-   🤖 TabbyML (IA locale type Copilot)

---

## 📁 Structure du dossier

dev-stack/
├── docker-compose.yml
├── .env # variables sensibles (à ignorer dans Git)
├── .gitignore # pour ignorer .env
└── README.md

---

## ⚙️ Variables d'environnement (`.env`)

Crée un fichier `.env` à la racine avec le contenu suivant :

```env
PG_DB=
PG_USER=
PG_PASSWORD=

KEYCLOAK_ADMIN=
KEYCLOAK_ADMIN_PASSWORD=
```
