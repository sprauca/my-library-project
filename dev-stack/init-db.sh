set -e
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE '${PG_DB_KEYCLOAK:-keycloakdb}';
EOSQL