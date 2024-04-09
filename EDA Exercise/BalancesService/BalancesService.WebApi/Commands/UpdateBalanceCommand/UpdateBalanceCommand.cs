using MediatR;

namespace BalancesService.WebApi.Commands.UpdateBalanceCommand;

public class UpdateBalanceCommand : IRequest<Unit>
{
    public BalanceUpdatedInputDto BalanceUpdatedInputDto { get; set; }

}