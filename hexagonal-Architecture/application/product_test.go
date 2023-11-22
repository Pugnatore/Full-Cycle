package application_test

import (
	"github.com/pbarros/go-hexagonal/application"
	uuid "github.com/satori/go.uuid"
	"github.com/stretchr/testify/require"
	"testing"
)

func TestProduct_Enable(t *testing.T) {
	product := application.Product{}
	product.Price = 10
	product.Status = application.DISABLED
	product.Name = "Product Test"

	err := product.Enable()

	require.Nil(t, err)

	product.Price = 0
	err = product.Enable()

	require.Equal(t, "The price must be greater than zero", err.Error())
}

func TestProduct_Disable(t *testing.T) {
	product := application.Product{}
	product.Price = 0
	product.Status = application.ENABLED
	product.Name = "Product Test"

	err := product.Disable()

	require.Nil(t, err)

	product.Price = 10
	err = product.Disable()

	require.Equal(t, "The price must be zero to disable the product", err.Error())
}

func TestProduct_IsValid(t *testing.T) {
	product := application.Product{}
	product.Price = 10
	product.Status = application.DISABLED
	product.Name = "Product Test"
	product.Id = uuid.NewV4().String()

	_, err := product.IsValid()
	require.Nil(t, err)

	product.Status = "INVALID"
	_, err = product.IsValid()
	require.Equal(t, "The status must be enabled or disabled", err.Error())

	product.Status = application.ENABLED
	_, err = product.IsValid()
	require.Nil(t, err)

	product.Price = -10
	_, err = product.IsValid()
	require.Equal(t, "The price must be greater or equal than zero", err.Error())

}
