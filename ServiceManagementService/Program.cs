using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using ServiceManagementService.Services;
using ServiceManagementService.Data;
using Microsoft.EntityFrameworkCore;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Carregar as variáveis de ambiente, caso existam
builder.Configuration.AddEnvironmentVariables();

// Configuração do PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("PostgresConnection"); // Usando o nome correto
builder.Services.AddDbContext<CompanyContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddDbContext<Machine_modContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddDbContext<Machine_typeContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddDbContext<MachineContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddDbContext<PartsContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddDbContext<StatusContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddDbContext<AppointmentContext>(options =>
options.UseNpgsql(connectionString));
builder.Services.AddDbContext<ServiceContext>(options =>
options.UseNpgsql(connectionString));
builder.Services.AddDbContext<ReviewContext>(options =>
options.UseNpgsql(connectionString));

// Configurar autenticação com JWT
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "AuthService", // Emissor do token (AuthService)
            ValidAudience = "UserManagementService", // Público esperado
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])) // Pegando a chave do appsettings
        };
    });

// Adicionar serviços do RabbitMQ
builder.Services.AddSingleton<RabbitMQService>();

// ADD THIS LINE TO REGISTER HTTPCLIENT!
builder.Services.AddHttpClient();

// Adicionar controllers
builder.Services.AddControllers();

// Adicionar Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var allowedOrigin = "http://localhost:3000"; // URL do seu React

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins(allowedOrigin)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials(); // necessário se usar autenticação (cookies/token no header)
        });
});


var app = builder.Build();

// Configurar middlewares
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "ServiceManagementService v1"));

// Mapear controladores
app.MapControllers();

app.Run();
