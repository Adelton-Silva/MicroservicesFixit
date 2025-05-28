using AuthService.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.DependencyInjection;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Adicionar os serviços necessários
builder.Services.AddAuthorization(); // Adiciona a autorização
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

// Adicionar o serviço de Controllers
builder.Services.AddControllers();

// Configurar CORS para permitir requisições do frontend React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder =>
        {
            builder.WithOrigins("http://localhost:3000")
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

// Serviços personalizados
builder.Services.AddScoped<TokenService>();
builder.Services.AddSingleton<RabbitMQService>();

// Adicionar Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Usar CORS antes da autenticação/autorização
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

// Ativar o Swagger
app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "AuthService v1"));

// Mapear os controladores
app.MapControllers();

app.Run();
