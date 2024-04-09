package handler

import (
	"WalletCore/pkg/events"
	"WalletCore/pkg/kafka"
	"fmt"
	"sync"
)

type UpdateBalanceKafkaHandler struct {
	Kafka *kafka.Producer
}

func NewUpdateBalanceKafkaHandler(kafka *kafka.Producer) *UpdateBalanceKafkaHandler {
	return &UpdateBalanceKafkaHandler{Kafka: kafka}
}

func (u *UpdateBalanceKafkaHandler) Handle(message events.EventInterface, wg *sync.WaitGroup) {
	defer wg.Done()
	u.Kafka.Publish(message, nil, "balances")
	fmt.Println("UpdateBalanceKafkaHandler called")
}
