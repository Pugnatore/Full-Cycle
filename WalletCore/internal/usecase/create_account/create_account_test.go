package create_account

import (
	"WalletCore/internal/entity"
	"WalletCore/internal/usecase/mocks"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"testing"
)

func TestCreateAccountUseCase_Execute(t *testing.T) {
	client, _ := entity.NewClient("John Doe", "j@j.com")
	clientMock := &mocks.ClientGatewayMock{}
	clientMock.On("Get", mock.Anything).Return(client, nil)

	accountMock := &mocks.AccountGatewayMock{}
	accountMock.On("Save", mock.Anything).Return(nil)

	uc := NewCreateAccountUseCase(accountMock, clientMock)
	input := CreateAccountInputDto{ClientId: client.ID}

	output, err := uc.Execute(input)

	assert.Nil(t, err)
	assert.NotNil(t, output.Id)
	clientMock.AssertExpectations(t)
	accountMock.AssertExpectations(t)
	clientMock.AssertNumberOfCalls(t, "Get", 1)
	accountMock.AssertNumberOfCalls(t, "Save", 1)

}
