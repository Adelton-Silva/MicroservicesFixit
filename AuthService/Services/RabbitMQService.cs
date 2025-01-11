using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;

namespace AuthService.Services
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
            var factory = new ConnectionFactory
            {
                HostName = _hostName,
                UserName = _userName,
                Password = _password
            };

            using var connection = factory.CreateConnection();
            using var channel = connection.CreateModel();
            channel.QueueDeclare(queue: queueName, durable: false, exclusive: false, autoDelete: false, arguments: null);

            var body = Encoding.UTF8.GetBytes(message);
            channel.BasicPublish(exchange: "", routingKey: queueName, basicProperties: null, body: body);
        }

        public string ReceiveMessage(string queueName)
        {
            var factory = new ConnectionFactory
            {
                HostName = _hostName,
                UserName = _userName,
                Password = _password
            };

            using var connection = factory.CreateConnection();
            using var channel = connection.CreateModel();
            channel.QueueDeclare(queue: queueName, durable: false, exclusive: false, autoDelete: false, arguments: null);

            var consumer = new EventingBasicConsumer(channel);
            string? response = null;

            consumer.Received += (model, ea) =>
            {
                var body = ea.Body.ToArray();
                response = Encoding.UTF8.GetString(body);
            };

            channel.BasicConsume(queue: queueName, autoAck: true, consumer: consumer);

            // Simular espera (simplificado)
            System.Threading.Thread.Sleep(1000);
            return response ?? string.Empty;
        }
    }
}
