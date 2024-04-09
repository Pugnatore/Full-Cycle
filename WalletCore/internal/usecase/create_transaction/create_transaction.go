package create_transaction

import (
	"WalletCore/internal/entity"
	"WalletCore/internal/gateway"
	"WalletCore/pkg/events"
	"WalletCore/pkg/uow"
	"context"
)

type CreateTransactionInputDto struct {
	AccountIdFrom string  `json:"account_id_from"`
	AccountIdTo   string  `json:"account_id_to"`
	Amount        float64 `json:"amount"`
}

type CreateTransactionOutputDto struct {
	Id            string  `json:"id"`
	AccountIDFrom string  `json:"account_id_from"`
	AccountIDTo   string  `json:"account_id_to"`
	Amount        float64 `json:"amount"`
}

type BalanceUpdatedOutputDto struct {
	AccountIdFrom        string  `json:"account_id_from"`
	AccountIdTo          string  `json:"account_id_to"`
	BalanceAccountIdFrom float64 `json:"balance_account_id_from"`
	BalanceAccountIdTo   float64 `json:"balance_account_id_to"`
}

type CreateTransactionUseCase struct {
	Uow                uow.UowInterface
	EventDispatcher    events.EventDispatcherInterface
	TransactionCreated events.EventInterface
	BalanceUpdated     events.EventInterface
}

func NewCreateTransactionUseCase(
	Uow uow.UowInterface,
	eventDispatcher events.EventDispatcherInterface,
	transactionCreated events.EventInterface,
	balanceUpdated events.EventInterface,
) *CreateTransactionUseCase {
	return &CreateTransactionUseCase{
		Uow:                Uow,
		EventDispatcher:    eventDispatcher,
		TransactionCreated: transactionCreated,
		BalanceUpdated:     balanceUpdated,
	}
}

func (useCase *CreateTransactionUseCase) Execute(ctx context.Context, input CreateTransactionInputDto) (*CreateTransactionOutputDto, error) {
	output := &CreateTransactionOutputDto{}
	balanceUpdatedOutput := &BalanceUpdatedOutputDto{}
	err := useCase.Uow.Do(ctx, func(_ *uow.Uow) error {
		accountRepo := useCase.getAccountRepository(ctx)
		transactionRepo := useCase.getTransactionRepository(ctx)

		accountFrom, err := accountRepo.FindById(input.AccountIdFrom)
		if err != nil {
			return err
		}

		accountTo, err := accountRepo.FindById(input.AccountIdTo)
		if err != nil {
			return err
		}

		transaction, err := entity.NewTransaction(accountFrom, accountTo, input.Amount)

		if err != nil {
			return err

		}

		err = accountRepo.UpdateBalance(accountFrom)
		if err != nil {
			return err
		}

		err = accountRepo.UpdateBalance(accountTo)
		if err != nil {
			return err
		}

		err = transactionRepo.Create(transaction)
		if err != nil {
			return err
		}

		output.Id = transaction.ID
		output.AccountIDFrom = input.AccountIdFrom
		output.AccountIDTo = input.AccountIdTo
		output.Amount = input.Amount

		balanceUpdatedOutput.AccountIdFrom = input.AccountIdFrom
		balanceUpdatedOutput.AccountIdTo = input.AccountIdTo
		balanceUpdatedOutput.BalanceAccountIdFrom = accountFrom.Balance
		balanceUpdatedOutput.BalanceAccountIdTo = accountTo.Balance

		return nil
	})

	if err != nil {
		return nil, err
	}

	useCase.TransactionCreated.SetPayload(output)

	useCase.EventDispatcher.Dispatch(useCase.TransactionCreated)

	useCase.BalanceUpdated.SetPayload(balanceUpdatedOutput)
	useCase.EventDispatcher.Dispatch(useCase.BalanceUpdated)

	return output, nil
}

func (useCase *CreateTransactionUseCase) getAccountRepository(ctx context.Context) gateway.AccountGateway {
	repo, err := useCase.Uow.GetRepository(ctx, "AccountDb")
	if err != nil {
		panic(err)
	}

	return repo.(gateway.AccountGateway)
}

func (useCase *CreateTransactionUseCase) getTransactionRepository(ctx context.Context) gateway.TransactionGateway {
	repo, err := useCase.Uow.GetRepository(ctx, "TransactionDB")
	if err != nil {
		panic(err)
	}

	return repo.(gateway.TransactionGateway)
}
