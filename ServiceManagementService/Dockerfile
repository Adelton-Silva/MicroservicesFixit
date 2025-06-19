FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copiar apenas o arquivo .csproj para /src
COPY ./ServiceManagementService.csproj ./

# Restaurar dependências (agora no /src)
RUN dotnet restore

# Copiar todo o restante do código para /src
COPY . ./

# Compilar e publicar
RUN dotnet publish -c Release -o /src/app

# Verificar arquivos
#RUN ls -l /src/app

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

COPY --from=build /src/app .

ENV ASPNETCORE_URLS=http://+:5002
EXPOSE 5002

ENTRYPOINT ["dotnet", "ServiceManagementService.dll"]