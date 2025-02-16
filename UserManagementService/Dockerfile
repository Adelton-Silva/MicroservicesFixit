# Etapa de build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copiar apenas o arquivo .csproj e restaurar dependências
COPY UserManagementService/UserManagementService.csproj UserManagementService/
WORKDIR /src/UserManagementService
RUN dotnet restore

# Copiar o restante dos arquivos do projeto
COPY UserManagementService/. .

# Compilar e publicar a aplicação
RUN dotnet publish -c Release -o /app

# Etapa final para execução
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Copiar os arquivos da etapa de build para a imagem final
COPY --from=build /app .

# Configurar a porta e variáveis de ambiente
ENV ASPNETCORE_URLS=http://+:5001
EXPOSE 5001

# Definir o comando de entrada da aplicação
ENTRYPOINT ["dotnet", "UserManagementService.dll"]
