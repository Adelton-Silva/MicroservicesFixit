# Etapa de build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copiar apenas o arquivo .csproj e restaurar dependências
COPY AuthService/AuthService.csproj AuthService/
WORKDIR /src/AuthService
RUN dotnet restore

# Copiar o restante dos arquivos do projeto
COPY . .

# Compilar e publicar a aplicação
RUN dotnet publish -c Release -o /app

# Etapa final para execução
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Copiar os arquivos da etapa de build para a imagem final
COPY --from=build /app .

# Configurar a porta e variáveis de ambiente
ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000

# Definir o comando de entrada da aplicação
ENTRYPOINT ["dotnet", "AuthService.dll"]
