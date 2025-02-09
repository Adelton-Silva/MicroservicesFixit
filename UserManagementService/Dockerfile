# Etapa de build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copiar o arquivo .csproj e restaurar dependências
COPY ./UserManagementService.csproj UserManagementService/
WORKDIR /src/UserManagementService
RUN dotnet restore "UserManagementService.csproj"

# Copiar o restante dos arquivos e compilar
COPY . . 
RUN dotnet publish "UserManagementService.csproj" -c Release -o /app

# Etapa final para execução
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app .

# Definir a porta correta
ENV ASPNETCORE_URLS=http://+:5001
EXPOSE 5001
ENTRYPOINT ["dotnet", "UserManagementService.dll"]
