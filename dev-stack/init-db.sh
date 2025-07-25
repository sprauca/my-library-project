set -e

echo "Creating Keycloak DB..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
    CREATE DATABASE keycloakdb;
EOSQL