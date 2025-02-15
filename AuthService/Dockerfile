# Etapa de build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copiar o arquivo .csproj e restaurar dependências
COPY AuthService.csproj ./
WORKDIR /src/AuthService
RUN dotnet restore "AuthService.csproj"

# Copiar o restante dos arquivos e compilar
COPY . .
RUN dotnet publish "AuthService.csproj" -c Release -o /app

# Etapa final para execução
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app .

# Definir a porta correta
ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000
ENTRYPOINT ["dotnet", "AuthService.dll"]
