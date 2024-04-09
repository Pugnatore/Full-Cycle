using Domain.AggregateModels.Balances;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure;

public class BalancesContext : DbContext
{

    public DbSet<Balance> Balances { get; set; }

}