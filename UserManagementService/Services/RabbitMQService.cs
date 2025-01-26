using RabbitMQ.Client;
using System.Text;

namespace UserManagementService.Services
{
    public class RabbitMQService
    {
        private readonly string? _hostName;
        private readonly string? _userName;
        private readonly string? _password;

        public RabbitMQService(IConfiguration configuration)
        {
            _hostName = configuration["RabbitMQ:Host"];
            _userName = configuration["RabbitMQ:Username"];
            _password = configuration["RabbitMQ:Password"];
        }

        public void SendMessage(string queueName, string message)
        {
            var factory = new ConnectionFactory()
            {
                HostName = _hostName,
                UserName = _userName,
                Password = _password,
            };

            using var connection = factory.CreateConnection();
            using var channel = connection.CreateModel();
            channel.QueueDeclare(queue: queueName, durable: false, exclusive: false, autoDelete: false, arguments: null);

            var body = Encoding.UTF8.GetBytes(message);
            channel.BasicPublish(exchange: "", routingKey: queueName, basicProperties: null, body: body);
        }
    }
}
