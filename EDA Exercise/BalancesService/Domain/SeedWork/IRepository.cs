namespace Domain.SeedWork;

/// <summary>
/// <see cref="IRepository{TEntity}"/>
/// </summary>
/// <typeparam name="TEntity">The type of the entity.</typeparam>
public interface IRepository<TEntity>
{

    /// <summary>
    /// Adds the asynchronous.
    /// </summary>
    /// <param name="entity">The entity.</param>
    /// <returns></returns>
    Task<TEntity> AddAsync(TEntity entity);

    /// <summary>
    /// Updates the asynchronous.
    /// </summary>
    /// <param name="entity"></param>
    /// <returns></returns>
    Task<TEntity> UpdateAsync(TEntity entity);
    

}