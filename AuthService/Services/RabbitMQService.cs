using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Text;
using System.Threading.Tasks;

namespace AuthService.Services
{
    public class RabbitMQService : IDisposable
    {
        private readonly string? _hostName;
        private readonly string? _userName;
        private readonly string? _password;
        private readonly int _port;

        private IConnection? _connection;
        private IModel? _channel;
        private string? _replyQueueName;
        private EventingBasicConsumer? _consumer;

        public RabbitMQService(IConfiguration configuration)
        {
            _hostName = configuration["RabbitMQ:Host"];
            _userName = configuration["RabbitMQ:Username"];
            _password = configuration["RabbitMQ:Password"];
            _port = int.Parse(configuration["RabbitMQ:Port"] ?? "5672");

            InitializeRabbitMQ();
        }

        private void InitializeRabbitMQ()
        {
            var factory = new ConnectionFactory()
            {
                HostName = _hostName,
                UserName = _userName,
                Password = _password,
                Port = _port,
                DispatchConsumersAsync = false
            };

            _connection = factory.CreateConnection();
            _channel = _connection.CreateModel();

            // Cria fila temporária exclusiva para receber respostas
            _replyQueueName = _channel.QueueDeclare(queue: "", exclusive: true).QueueName;

            _consumer = new EventingBasicConsumer(_channel);
            _channel.BasicConsume(queue: _replyQueueName, autoAck: true, consumer: _consumer);
        }

        public string SendAndReceive(string queueName, string message, TimeSpan timeout)
        {
            if (_channel == null || _replyQueueName == null || _consumer == null)
                throw new InvalidOperationException("RabbitMQ is not initialized properly.");

            var correlationId = Guid.NewGuid().ToString();
            var tcs = new TaskCompletionSource<string>();

            // Configura o evento para receber a resposta e filtrar por CorrelationId
            void OnReceived(object sender, BasicDeliverEventArgs ea)
            {
                if (ea.BasicProperties.CorrelationId == correlationId)
                {
                    var body = ea.Body.ToArray();
                    var response = Encoding.UTF8.GetString(body);
                    tcs.TrySetResult(response);
                }
            }

            _consumer.Received += OnReceived;

            var props = _channel.CreateBasicProperties();
            props.CorrelationId = correlationId;
            props.ReplyTo = _replyQueueName;

            var bodyMessage = Encoding.UTF8.GetBytes(message);
            _channel.BasicPublish(exchange: "", routingKey: queueName, basicProperties: props, body: bodyMessage);

            // Espera pela resposta com timeout
            if (tcs.Task.Wait(timeout))
            {
                _consumer.Received -= OnReceived;
                return tcs.Task.Result;
            }
            else
            {
                _consumer.Received -= OnReceived;
                return string.Empty; // ou lance exceção de timeout
            }
        }

        public void Dispose()
        {
            _channel?.Close();
            _channel?.Dispose();
            _connection?.Close();
            _connection?.Dispose();
        }
    }
}
