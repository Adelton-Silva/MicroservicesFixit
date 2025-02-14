using RabbitMQ.Client;
using System.Text;

namespace UserManagementService.Services
{
    public class RabbitMQService
    {
        private readonly string? _hostName;
        private readonly string? _userName;
        private readonly string? _password;
        private readonly string? _port;
        private readonly ILogger<RabbitMQService> _logger;

        public RabbitMQService(IConfiguration configuration, ILogger<RabbitMQService> logger)
        {
            _hostName = configuration["RabbitMQ:Host"];
            _userName = configuration["RabbitMQ:Username"];
            _password = configuration["RabbitMQ:Password"];
            _port = configuration["RabbitMQ:Port"];
            _logger = logger;

            _logger.LogInformation($"RabbitMQ Host: {_hostName}");
        }

        public void SendMessage(string queueName, string message)
        {
            try
            {
                var factory = new ConnectionFactory()
                {
                    HostName = _hostName,
                    Port = int.Parse(_port),
                    UserName = _userName,
                    Password = _password,
                };

                using var connection = factory.CreateConnection();
                using var channel = connection.CreateModel();
                channel.QueueDeclare(queue: queueName, durable: false, exclusive: false, autoDelete: false, arguments: null);

                var body = Encoding.UTF8.GetBytes(message);
                channel.BasicPublish(exchange: "", routingKey: queueName, basicProperties: null, body: body);

                _logger.LogInformation($"Mensagem enviada para {queueName}: {message}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Erro ao enviar mensagem para RabbitMQ: {ex.Message}");
                throw;
            }
        }
    }
}
