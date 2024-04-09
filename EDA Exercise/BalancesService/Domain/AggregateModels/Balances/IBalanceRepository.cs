using Domain.AggregateModels.Balances;
using Domain.SeedWork;

public interface IBalanceRepository : IRepository<Balance>
{
    Task<Balance?> GetByAccountId(string accountId);
}