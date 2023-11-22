package cli_test

import (
	"fmt"
	"github.com/golang/mock/gomock"
	"github.com/pbarros/go-hexagonal/adapters/cli"
	mock_application "github.com/pbarros/go-hexagonal/application/mocks"
	"github.com/stretchr/testify/require"
	"testing"
)

func TestRun(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	productName := "Product Test"
	productPrice := 25.99
	productStatus := "enabled"
	productId := "abc"

	productMock := mock_application.NewMockProductInterface(ctrl)
	productMock.EXPECT().GetId().Return(productId).AnyTimes()
	productMock.EXPECT().GetStatus().Return(productStatus).AnyTimes()
	productMock.EXPECT().GetPrice().Return(productPrice).AnyTimes()
	productMock.EXPECT().GetName().Return(productName).AnyTimes()

	service := mock_application.NewMockProductServiceInterface(ctrl)
	service.EXPECT().Create(productName, productPrice).Return(productMock, nil).AnyTimes()
	service.EXPECT().Get(productId).Return(productMock, nil).AnyTimes()
	service.EXPECT().Disable(gomock.Any()).Return(true, nil).AnyTimes()
	service.EXPECT().Enable(gomock.Any()).Return(true, nil).AnyTimes()

	resultExpected := fmt.Sprint("Product ID ", productId, " with the name ", productName, " has been created with the price ", productPrice)

	result, err := cli.Run(service, "create", "", productName, productPrice)

	require.Nil(t, err)
	require.Equal(t, resultExpected, result)

	resultExpected = fmt.Sprint("Product ", productName, " has been enabled")
	result, err = cli.Run(service, "enable", productId, "", 0)
	require.Nil(t, err)
	require.Equal(t, resultExpected, result)

	resultExpected = fmt.Sprint("Product ", productName, " has been disabled")
	result, err = cli.Run(service, "disable", productId, "", 0)
	require.Nil(t, err)
	require.Equal(t, resultExpected, result)

	resultExpected = fmt.Sprint("Product ID: ", productId, "\nName: ", productName, "\nStatus: ", productStatus, "\nPrice: ", productPrice)
	result, err = cli.Run(service, "get", productId, "", 0)
	require.Nil(t, err)
	require.Equal(t, resultExpected, result)

}
