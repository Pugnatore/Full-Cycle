package cli

import (
	"fmt"
	"github.com/pbarros/go-hexagonal/application"
)

func Run(service application.ProductServiceInterface, action string, productId string, productName string, price float64) (string, error) {

	var result = ""
	switch action {
	case "create":
		product, err := service.Create(productName, price)
		if err != nil {
			return result, err
		}
		result = fmt.Sprint("Product ID ", product.GetId(), " with the name ", product.GetName(), " has been created with the price ", product.GetPrice())
	case "enable":
		product, err := service.Get(productId)
		if err != nil {
			return result, err
		}
		service.Enable(product)
		result = fmt.Sprint("Product ", product.GetName(), " has been enabled")
	case "disable":
		product, err := service.Get(productId)
		if err != nil {
			return result, err
		}
		service.Disable(product)
		result = fmt.Sprint("Product ", product.GetName(), " has been disabled")
	case "get":
		product, err := service.Get(productId)
		if err != nil {
			return result, err
		}
		result = fmt.Sprint("Product ID: ", product.GetId(), "\nName: ", product.GetName(), "\nStatus: ", product.GetStatus(), "\nPrice: ", product.GetPrice())

	default:
		res, err := service.Get(productId)
		if err != nil {
			return result, err
		}
		result = fmt.Sprint("Product ID: ", res.GetId(), "\nName: ", res.GetName(), "\nStatus: ", res.GetStatus(), "\nPrice: ", res.GetPrice())
	}
	return result, nil
}
