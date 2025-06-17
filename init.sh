#!/bin/bash
set -e

export PGPASSWORD="$POSTGRES_PASSWORD"

echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h postgres -p 5432 -U "$POSTGRES_USER"; do
  sleep 2
done

echo "Checking if tables already exist..."
if psql -h postgres -p 5432 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tAc "SELECT to_regclass('public.services');" | grep -q 'services'; then
  echo "Tables already exist. Skipping initialization."
else
  echo "Running SQL scripts to initialize database..."
  psql -h postgres -p 5432 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /docker-entrypoint-initdb.d/CreateTable.sql
  psql -h postgres -p 5432 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /docker-entrypoint-initdb.d/InsertData.sql
fi
