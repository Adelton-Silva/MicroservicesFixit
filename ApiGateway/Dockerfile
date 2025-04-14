FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ./ApiGateway.csproj ApiGateway/
WORKDIR /src/ApiGateway
RUN dotnet restore

COPY appsettings.json /app/appsettings.json
ENV DOTNET_ENVIRONMENT=Development

COPY . .
RUN dotnet publish -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app .

EXPOSE 5000
ENTRYPOINT ["dotnet", "ApiGateway.dll"]