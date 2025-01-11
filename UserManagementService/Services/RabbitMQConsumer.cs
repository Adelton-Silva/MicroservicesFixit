using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using UserManagementService.Repositories;
using AuthService.Models;

namespace UserManagementService.Services
{
    public class RabbitMQConsumer : BackgroundService
    {
        private readonly string _hostName;
        private readonly string _userName;
        private readonly string _password;
        private readonly IServiceScopeFactory _scopeFactory;

        public RabbitMQConsumer(IConfiguration configuration, IServiceScopeFactory scopeFactory)
        {
            _hostName = configuration["RabbitMQ:Host"];
            _userName = configuration["RabbitMQ:Username"];
            _password = configuration["RabbitMQ:Password"];
            _scopeFactory = scopeFactory;
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var factory = new ConnectionFactory()
            {
                HostName = _hostName,
                UserName = _userName,
                Password = _password
            };

            var connection = factory.CreateConnection();
            var channel = connection.CreateModel();
            channel.QueueDeclare(queue: "auth.login", durable: false, exclusive: false, autoDelete: false, arguments: null);
            channel.QueueDeclare(queue: "auth.login.response", durable: false, exclusive: false, autoDelete: false, arguments: null);

            var consumer = new EventingBasicConsumer(channel);
            consumer.Received += (model, ea) =>
            {
                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);

                using var scope = _scopeFactory.CreateScope();
                var userRepository = scope.ServiceProvider.GetRequiredService<UserRepository>();

                // Verificar credenciais
                var loginRequest = System.Text.Json.JsonSerializer.Deserialize<LoginRequest>(message);
                var user = userRepository.GetUserByUsername(loginRequest.Username);

                var isAuthenticated = user != null && BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.Password); // Verify hashed password
                var response = isAuthenticated ? "Success" : "Failure";

                // Enviar resposta
                var responseBytes = Encoding.UTF8.GetBytes(response);
                channel.BasicPublish(exchange: "", routingKey: "auth.login.response", basicProperties: null, body: responseBytes);
            };

            channel.BasicConsume(queue: "auth.login", autoAck: true, consumer: consumer);

            return Task.CompletedTask;
        }
    }
}
