using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using UserManagementService.Repositories;
using System.Text.Json;

namespace UserManagementService.Services
{
    public class UserValidationConsumer : BackgroundService
    {
        private readonly string _hostName;
        private readonly string _userName;
        private readonly string _password;
        private readonly IServiceScopeFactory _scopeFactory;

        public UserValidationConsumer(IConfiguration configuration, IServiceScopeFactory scopeFactory)
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
            channel.QueueDeclare(queue: "user.validate", durable: false, exclusive: false, autoDelete: false, arguments: null);
            channel.QueueDeclare(queue: "user.validate.response", durable: false, exclusive: false, autoDelete: false, arguments: null);

            var consumer = new EventingBasicConsumer(channel);
            consumer.Received += async (model, ea) =>
            {
                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);
                var request = JsonSerializer.Deserialize<JsonElement>(message);

                using var scope = _scopeFactory.CreateScope();
                var userRepository = scope.ServiceProvider.GetRequiredService<UserRepository>();

                int userId = request.GetProperty("UserId").GetInt32();
                var user = await userRepository.GetUserByIdAsync(userId);

                var response = JsonSerializer.Serialize(new
                {
                    Status = user != null ? "Success" : "Failure"
                });

                var responseBytes = Encoding.UTF8.GetBytes(response);
                
                channel.BasicPublish(exchange: "", routingKey: "user.validate.response", basicProperties: null, body: responseBytes);

                // Reconhecer a mensagem após o processamento
                channel.BasicAck(ea.DeliveryTag, false);
            };

            channel.BasicConsume(queue: "user.validate", autoAck: false, consumer: consumer);

            return Task.CompletedTask;
        }
    }
}
