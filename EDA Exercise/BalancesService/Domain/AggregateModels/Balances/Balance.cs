
namespace Domain.AggregateModels.Balances;

public class Balance
{
    public int Id { get; private set; }
    public string AccountId { get; private set; }
    public decimal Amount { get; private set; }

    public Balance(int id, string accountId, decimal amount)
    {
        Id = id;
        AccountId = accountId;
        Amount = amount;
    }

    public void UpdateAmount(decimal amount)
    {
        Amount = amount;
    }


}