using Microsoft.EntityFrameworkCore;
using UserManagementService.Config;
using UserManagementService.Repositories;
using UserManagementService.Services;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using MongoDB.Driver;



var builder = WebApplication.CreateBuilder(args);

// Adicionar suporte a controladores
builder.Services.AddControllers();

builder.Services.AddSingleton<UserDbContext>();
builder.Services.AddScoped<UserRepository>();

// Configuração do MongoDB
var mongoDbSettings = builder.Configuration.GetSection("MongoDbSettings").Get<MongoDbSettings>();
Console.WriteLine($"MongoDB ConnectionString: {mongoDbSettings.ConnectionString}");
if (string.IsNullOrEmpty(mongoDbSettings.ConnectionString))
{
    throw new ArgumentNullException("MongoDB ConnectionString não pode ser nulo ou vazio.");
}
builder.Services.AddSingleton<IMongoClient>(serviceProvider =>
    new MongoClient(mongoDbSettings.ConnectionString));
builder.Services.AddSingleton<IMongoDatabase>(serviceProvider =>
    serviceProvider.GetRequiredService<IMongoClient>().GetDatabase(mongoDbSettings.DatabaseName));




// Serviços
builder.Services.AddScoped<UserRepository>();
builder.Services.AddHostedService<RabbitMQConsumer>();

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
   

// Adicionar Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseAuthentication(); // Middleware de autenticação
app.UseAuthorization();  // Middleware de autorização

// Middlewares adicionais
app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "UserManagementService v1"));

// Mapear controladores
app.MapControllers();

app.Run();
