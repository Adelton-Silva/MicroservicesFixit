using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Load configuration for Ocelot
builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

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
    }
);

// Adicionar o serviço de Controllers
builder.Services.AddOcelot();
builder.Services.AddControllers(); // ADICIONADO!

var app = builder.Build();


// Ocelot handles all routing
await app.UseOcelot();
app.UseAuthentication(); // Primeiro, a autenticação
app.UseAuthorization(); // Depois, a autorização

app.MapControllers(); // ADICIONADO!


app.Run();