# Use the official .NET 9 SDK image as a build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /source

# Copy the project file and restore dependencies
COPY *.csproj .
RUN dotnet restore

# Copy the rest of the application code
COPY . .

# Build the application
RUN dotnet publish -c Release -o /app

# Use the official .NET 9 runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

# Adiciona repositório oficial e chave pública da Microsoft
RUN apt-get update && apt-get install -y wget apt-transport-https software-properties-common \
    && wget -qO- https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
    && wget https://packages.microsoft.com/config/ubuntu/22.04/prod.list \
    && mv prod.list /etc/apt/sources.list.d/dotnet-prod.list \
    && apt-get update

# Instala o SDK do .NET
RUN apt-get install -y dotnet-sdk-9.0

# Copy the build output from the build stage
COPY --from=build /app .

# Instala dotnet-ef dentro do contêiner final
RUN dotnet tool install --global dotnet-ef
ENV PATH="$PATH:/root/.dotnet/tools"

# Expose the port the application runs on
# Definir a porta correta
ENV ASPNETCORE_URLS=http://+:5002
EXPOSE 5002
# Set the entry point for the application
ENTRYPOINT ["dotnet", "ServiceManagementService.dll"]