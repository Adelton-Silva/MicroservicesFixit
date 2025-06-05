# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy everything
COPY . ./

# Restore and publish
RUN dotnet restore ./ApiGateway.csproj
RUN dotnet publish -c Release -o /app

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

COPY --from=build /app .

ENV ASPNETCORE_URLS=http://+:8088
EXPOSE 8088

ENTRYPOINT ["dotnet", "ApiGateway.dll"]
