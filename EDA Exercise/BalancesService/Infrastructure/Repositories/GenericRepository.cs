using Domain.SeedWork;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class GenericRepository<TEntity> : IRepository<TEntity>
    where TEntity : class
{
    protected readonly BalancesContext _context;

    protected readonly DbSet<TEntity> _entities;


    public GenericRepository(BalancesContext context)
    {
        _context = context;
        _entities =  context.Set<TEntity>();;
    }
    public async Task<TEntity> AddAsync(TEntity entity)
    {
        var entityEntry = await this._entities.AddAsync(entity);

        return entityEntry.Entity;
    }

    public async Task<TEntity> UpdateAsync(TEntity entity)
    {
        var dataEntity = await Task.FromResult(this._entities.Update(entity));

        return dataEntity.Entity;
    }
    
}