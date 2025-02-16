# Etapa de build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copiar apenas o arquivo .csproj e restaurar dependências
COPY ServiceManagementService/ServiceManagementService.csproj ServiceManagementService/
WORKDIR /src/ServiceManagementService
RUN dotnet restore

# Copiar o restante dos arquivos do projeto
COPY ServiceManagementService/. .

# Compilar e publicar a aplicação
RUN dotnet publish -c Release -o /app

# Etapa final para execução
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Copiar os arquivos da etapa de build para a imagem final
COPY --from=build /app .

# Configurar a porta e variáveis de ambiente
ENV ASPNETCORE_URLS=http://+:5002
EXPOSE 5002

# Definir o comando de entrada da aplicação
ENTRYPOINT ["dotnet", "ServiceManagementService.dll"]
