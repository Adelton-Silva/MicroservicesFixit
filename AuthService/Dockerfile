# Use the official .NET 9 SDK image as a build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /source

# Copy the project file and restore dependencies
COPY *.csproj .
RUN dotnet add package BCrypt.Net-Next
RUN dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
RUN dotnet add package Microsoft.AspNetCore.OpenApi
RUN dotnet add package RabbitMQ.Client
RUN dotnet add package Swashbuckle.AspNetCore
RUN dotnet restore

# Copy the rest of the application code
COPY . .

# Build the application
RUN dotnet publish -c Release -o /app

# Use the official .NET 9 runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

# Copy the build output from the build stage
COPY --from=build /app .

# Expose the port the application runs on
EXPOSE 5082

# Set the entry point for the application
ENTRYPOINT ["dotnet", "AuthService.dll"]