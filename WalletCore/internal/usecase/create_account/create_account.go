package create_account

import (
	"WalletCore/internal/entity"
	"WalletCore/internal/gateway"
	"fmt"
)

type CreateAccountInputDto struct {
	ClientId string `json:"client_id"`
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

func (useCase *CreateAccountUseCase) Execute(input CreateAccountInputDto) (*CreateAccountOutputDto, error) {
	fmt.Println("CreateAccountUseCase.Execute")
	client, err := useCase.clientGateway.Get(input.ClientId)
	if err != nil {
		fmt.Println("Erro ao buscar o cliente")
		return nil, err
	}

	account := entity.NewAccount(client)
	err = useCase.accountGateway.Save(account)
	if err != nil {
		fmt.Println("Erro ao salvar a conta")
		return nil, err
	}

	return &CreateAccountOutputDto{Id: account.ID}, nil
}
