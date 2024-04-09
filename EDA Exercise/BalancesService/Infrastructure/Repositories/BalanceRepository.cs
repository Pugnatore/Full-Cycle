using Domain.AggregateModels.Balances;
using Infrastructure;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;


public class BalancesRepository(BalancesContext context) : GenericRepository<Balance>(context), IBalanceRepository
{
    public async Task<Balance?> GetByAccountId(string accountId)
    {
        return await _entities.FirstOrDefaultAsync(x => x.AccountId == accountId);
    }
}