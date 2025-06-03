using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;
using UserManagementService.Repositories;
using UserManagementService.Models;
using BCrypt.Net;

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

            var consumer = new EventingBasicConsumer(channel);

            consumer.Received += async (model, ea) =>
            {
                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);

                var props = ea.BasicProperties;
                var replyProps = channel.CreateBasicProperties();
                replyProps.CorrelationId = props.CorrelationId;

                using var scope = _scopeFactory.CreateScope();
                var userRepository = scope.ServiceProvider.GetRequiredService<UserRepository>();

                var loginRequest = JsonSerializer.Deserialize<LoginRequest>(message);
                var user = await userRepository.GetUserByUsernameAsync(loginRequest.Username);

                var isAuthenticated = user != null && BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.Password);

                var response = JsonSerializer.Serialize(new
                {
                    Username = loginRequest.Username,
                    Status = isAuthenticated ? "Success" : "Failure",
                    User = isAuthenticated ? new
                    {
                        user.Id,
                        user.Username,
                        user.Email
                    } : null
                });

                var responseBytes = Encoding.UTF8.GetBytes(response);

                channel.BasicPublish(exchange: "", routingKey: props.ReplyTo, basicProperties: replyProps, body: responseBytes);

                channel.BasicAck(deliveryTag: ea.DeliveryTag, multiple: false);
            };

            channel.BasicConsume(queue: "auth.login", autoAck: false, consumer: consumer);

            return Task.CompletedTask;
        }
    }
}
