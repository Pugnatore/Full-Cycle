package handler

import (
	"WalletCore/pkg/events"
	"WalletCore/pkg/kafka"
	"fmt"
	"sync"
)

type TransactionCreatedKafkaHandler struct {
	Kafka *kafka.Producer
}

func NewTransactionCreatedKafkaHandler(kafka *kafka.Producer) *TransactionCreatedKafkaHandler {
	return &TransactionCreatedKafkaHandler{Kafka: kafka}
}

func (t *TransactionCreatedKafkaHandler) Handle(message events.EventInterface, wg *sync.WaitGroup) {
	defer wg.Done()
	t.Kafka.Publish(message, nil, "transactions")
	fmt.Println("TransactionCreatedKafkaHandler: ", message.GetPayload())
}
