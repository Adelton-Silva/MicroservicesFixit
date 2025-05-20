#!/bin/bash
set -e

echo "⏳ Aguardando PostgreSQL ficar pronto..."
until PGPASSWORD=1992 psql -h postgres -U postgres -d servicemanagment -c 'SELECT 1' &> /dev/null; do
    echo "⏳ PostgreSQL ainda não está pronto... tentando novamente em 10s"
    sleep 10
done

echo "✅ PostgreSQL está pronto!"

echo "🚀 Aplicando migrações do banco de dados..."
dotnet ef database update --context AppointmentContext
dotnet ef database update --context CompanyContext
dotnet ef database update --context Machine_modContext
dotnet ef database update --context Machine_typeContext
dotnet ef database update --context MachineContext
dotnet ef database update --context PartsContext
dotnet ef database update --context ServiceContext
dotnet ef database update --context StatusContext
dotnet ef database update --context ReviewContext
echo "✅ Migrações concluídas!"

echo "🚀 Iniciando a aplicação..."
exec dotnet ServiceManagementService.dll
