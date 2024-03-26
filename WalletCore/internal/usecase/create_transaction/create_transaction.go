package create_transaction

import (
	"WalletCore/internal/entity"
	"WalletCore/internal/gateway"
)

type CreateTransactionInputDto struct {
	AccountIdFrom string
	AccountIdTo   string
	Amount        float64
}

type CreateTransactionOutputDto struct {
	Id string
}

type CreateTransactionUseCase struct {
	transactionGateway gateway.TransactionGateway
	accountGateway     gateway.AccountGateway
}

func NewCreateTransactionUseCase(transactionGateway gateway.TransactionGateway, accountGateway gateway.AccountGateway) *CreateTransactionUseCase {
	return &CreateTransactionUseCase{
		transactionGateway: transactionGateway,
		accountGateway:     accountGateway,
	}
}

func (useCase *CreateTransactionUseCase) Execute(input *CreateTransactionInputDto) (*CreateTransactionOutputDto, error) {
	accountFrom, err := useCase.accountGateway.FindById(input.AccountIdFrom)
	if err != nil {
		return nil, err
	}

	accountTo, err := useCase.accountGateway.FindById(input.AccountIdTo)
	if err != nil {
		return nil, err
	}

	transaction, err := entity.NewTransaction(accountFrom, accountTo, input.Amount)

	if err != nil {
		return nil, err

	}

	err = useCase.transactionGateway.Create(transaction)
	if err != nil {
		return nil, err
	}

	return &CreateTransactionOutputDto{Id: transaction.ID}, nil
}
