using Microsoft.EntityFrameworkCore;
using UserManagementService.Config;
using UserManagementService.Repositories;
using UserManagementService.Services;

var builder = WebApplication.CreateBuilder(args);

// Adicionar suporte a controladores
builder.Services.AddControllers(); // Registra os controladores

// Configurar banco de dados
builder.Services.AddDbContext<UserDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Serviços
builder.Services.AddScoped<UserRepository>();
builder.Services.AddHostedService<RabbitMQConsumer>();

// Adicionar Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Middlewares
app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "UserManagementService v1"));

// Mapear controladores
app.MapControllers();

app.Run();
