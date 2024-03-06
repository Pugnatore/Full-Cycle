package create_account

import (
	"WalletCore/internal/entity"
	"WalletCore/internal/gateway"
)

type CreateAccountInputDto struct {
	CliendId string
}

type CreateAccountOutputDto struct {
	Id string
}

type CreateAccountUseCase struct {
	accountGateway gateway.AccountGateway
	clientGateway  gateway.ClientGateway
}

func NewCreateAccountUseCase(accountGateway gateway.AccountGateway, clientGateway gateway.ClientGateway) *CreateAccountUseCase {
	return &CreateAccountUseCase{
		accountGateway: accountGateway,
		clientGateway:  clientGateway,
	}
}

func (useCase *CreateAccountUseCase) Execute(input *CreateAccountInputDto) (*CreateAccountOutputDto, error) {
	client, err := useCase.clientGateway.Get(input.CliendId)
	if err != nil {
		return nil, err
	}

	account := entity.NewAccount(client)
	err = useCase.accountGateway.Save(account)
	if err != nil {
		return nil, err
	}

	return &CreateAccountOutputDto{Id: account.ID}, nil
}
