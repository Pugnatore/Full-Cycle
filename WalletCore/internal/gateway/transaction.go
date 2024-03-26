package gateway

import "WalletCore/internal/entity"

type TransactionGateway interface {
	Create(transaction *entity.Transaction) error
}
