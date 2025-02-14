using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using System.Text;
using UserManagementService.Config;
using UserManagementService.Repositories;
using UserManagementService.Services;

var builder = WebApplication.CreateBuilder(args);

// Adiciona suporte a controladores
builder.Services.AddControllers();

// Configuração do MongoDB
var mongoDbSettings = builder.Configuration.GetSection("MongoDbSettings").Get<MongoDbSettings>();

if (mongoDbSettings == null || string.IsNullOrEmpty(mongoDbSettings.ConnectionString) || string.IsNullOrEmpty(mongoDbSettings.DatabaseName))
{
    throw new ArgumentNullException("MongoDB ConnectionString e DatabaseName não podem ser nulos ou vazios.");
}

builder.Services.AddSingleton<IMongoClient>(_ => new MongoClient(mongoDbSettings.ConnectionString));
builder.Services.AddSingleton<IMongoDatabase>(sp => sp.GetRequiredService<IMongoClient>().GetDatabase(mongoDbSettings.DatabaseName));
builder.Services.AddScoped<UserDbContext>();
builder.Services.AddScoped<UserRepository>();

// Configuração do RabbitMQ Consumer com tratamento de erro


builder.Services.AddHostedService<RabbitMQConsumer>();
builder.Services.AddHostedService<UserValidationConsumer>();
// Configuração JWT
var jwtKey = builder.Configuration["Jwt:Key"] ?? Environment.GetEnvironmentVariable("Jwt__Key");

if (string.IsNullOrEmpty(jwtKey))
{
    throw new ArgumentNullException("JWT Key não pode ser nula ou vazia.");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? Environment.GetEnvironmentVariable("Jwt__Issuer") ?? "AuthService",
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? Environment.GetEnvironmentVariable("Jwt__Audience") ?? "UserManagementService",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

// Adicionar Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Criar a aplicação
var app = builder.Build();

// Middleware de autenticação e autorização
app.UseAuthentication();
app.UseAuthorization();

// Configuração do Swagger
app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "UserManagementService v1"));

// Mapear controladores
app.MapControllers();

// Iniciar aplicação com tratamento de erro
try
{
    app.Run();
}
catch (Exception ex)
{
    Console.WriteLine($"Erro crítico na inicialização: {ex.Message}");
}
