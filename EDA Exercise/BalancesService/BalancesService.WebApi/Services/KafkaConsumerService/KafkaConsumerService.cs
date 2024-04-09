using BalancesService.WebApi.Commands.UpdateBalanceCommand;
using Confluent.Kafka;
using MediatR;
using Newtonsoft.Json;

namespace BalancesService.WebApi.Services.KafkaConsumerService;

public class KafkaConsumerService : BackgroundService
{
    private readonly ILogger<KafkaConsumerService> logger;

    private readonly IConsumer<string,string> consumer;

    private readonly IServiceScopeFactory _scopeFactory;


    public KafkaConsumerService(
        ILogger<KafkaConsumerService> logger,
        IConsumer<string, string> consumer,
        IServiceScopeFactory scopeFactory)
    {
        this.logger = logger;
        this.consumer = consumer;
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        consumer.Subscribe("transactions");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                this.logger.LogInformation("Consuming message from Kafka");
                var consumeResult = consumer.Consume(stoppingToken);

                // Process the consumed message
                this.logger.LogInformation($"Received message: {consumeResult.Message.Value}");

                var messageContent = JsonConvert.DeserializeObject<BalanceUpdatedInputDto>(consumeResult.Message.Value);

                var command = new UpdateBalanceCommand
                {
                    BalanceUpdatedInputDto =
                    {
                        AccountIdFrom = messageContent.AccountIdFrom,
                        AccountIdTo = messageContent.AccountIdTo,
                        BalanceAccountIdFrom = messageContent.BalanceAccountIdFrom,
                        BalanceAccountIdTo = messageContent.BalanceAccountIdTo

                    }

                };

                using var scope = this._scopeFactory.CreateScope();
                var mediator = scope.ServiceProvider.GetRequiredService<IMediator>();

                var result = await mediator.Send(command);

                this.logger.LogInformation("Message consumed with success");
            }
            catch (OperationCanceledException)
            {
                // Graceful shutdown
                break;
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Error consuming message from Kafka");
            }
        }
    }
}