using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using ServiceManagementService.Services;
using ServiceManagementService.Data;
using Microsoft.EntityFrameworkCore;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configuração do PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("PostgresConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
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
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("RTGHAKHJS&SUSHSJJSKJSKSLLLALLLJNHG98542152HDJKDLSDLÇSDKKDD58742JKDJHDJKDKDLLDLLDD6KDJKDJJDD")), // Chave secreta usada para assinar o token
        };
    });

// Adicionar serviços do RabbitMQ
builder.Services.AddSingleton<RabbitMQService>();

// Adicionar controllers
builder.Services.AddControllers();

// Adicionar Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configurar middlewares
app.UseAuthentication();
app.UseAuthorization();
app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "ServiceManagementService v1"));

// Mapear controladores
app.MapControllers();

app.Run();
