using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Threading;
using Microsoft.Extensions.Configuration;

namespace ServiceManagementService.Services
{
    public class RabbitMQService
    {
        private readonly string _hostName;
        private readonly string _userName;
        private readonly string _password;
        private readonly int _port;

        public RabbitMQService(IConfiguration configuration)
        {
            _hostName = configuration["RabbitMQ:Host"];
            _userName = configuration["RabbitMQ:Username"];
            _password = configuration["RabbitMQ:Password"];
            _port = int.TryParse(configuration["RabbitMQ:Port"], out var parsedPort) ? parsedPort : 5672; // Padrão 5672
        }

        public void SendMessage(string queueName, string message)
        {
            var factory = new ConnectionFactory()
            {
                HostName = _hostName,
                Port = _port,
                UserName = _userName,
                Password = _password
            };

            using var connection = factory.CreateConnection();
            using var channel = connection.CreateModel();
            channel.QueueDeclare(queue: queueName, durable: false, exclusive: false, autoDelete: false, arguments: null);

            var body = Encoding.UTF8.GetBytes(message);
            channel.BasicPublish(exchange: "", routingKey: queueName, basicProperties: null, body: body);
        }

       public string ReceiveMessage(string queueName, TimeSpan timeout)
{
    var factory = new ConnectionFactory()
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
    var messageReceived = new ManualResetEventSlim(false);

    consumer.Received += (model, ea) =>
    {
        var body = ea.Body.ToArray();
        response = Encoding.UTF8.GetString(body);

        // 🔍 Log para verificar se a resposta chegou
        Console.WriteLine($"[ServiceManagementService] Mensagem recebida de {queueName}: {response}");

        // Confirma o recebimento da mensagem
        channel.BasicAck(ea.DeliveryTag, false);
        messageReceived.Set();
    };

    channel.BasicConsume(queue: queueName, autoAck: false, consumer: consumer);

    //


            // Aguarda até o timeout pela resposta
            if (!messageReceived.Wait(timeout))
            {
                return string.Empty; // Timeout atingido, sem resposta
            }

            return response ?? string.Empty;
        }
    }
}
