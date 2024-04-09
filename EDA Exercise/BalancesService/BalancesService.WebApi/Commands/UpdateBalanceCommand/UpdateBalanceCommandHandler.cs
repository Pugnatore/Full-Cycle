using MediatR;

namespace BalancesService.WebApi.Commands.UpdateBalanceCommand;

public class UpdateBalanceCommandHandler : IRequestHandler<UpdateBalanceCommand, Unit>
{
    private readonly IBalanceRepository _balanceRepository;

    public UpdateBalanceCommandHandler(IBalanceRepository balanceRepository)
    {
        _balanceRepository = balanceRepository;
    }

    public async Task<Unit> Handle(UpdateBalanceCommand request, CancellationToken cancellationToken)
    {
        var balanceFrom = await _balanceRepository.GetByAccountId(request.BalanceUpdatedInputDto.AccountIdFrom);
        var balanceTo = await _balanceRepository.GetByAccountId(request.BalanceUpdatedInputDto.AccountIdTo);

        if (balanceFrom == null || balanceTo == null)
        {
            throw new Exception("Balance not found");
        }

        balanceFrom.UpdateAmount(request.BalanceUpdatedInputDto.BalanceAccountIdFrom);
        balanceTo.UpdateAmount(request.BalanceUpdatedInputDto.BalanceAccountIdTo);

        await _balanceRepository.UpdateAsync(balanceFrom);
        await _balanceRepository.UpdateAsync(balanceTo);

        return Unit.Value;
    }
}