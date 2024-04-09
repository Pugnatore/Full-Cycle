package main

import (
	"WalletCore/internal/database"
	"WalletCore/internal/event"
	"WalletCore/internal/event/handler"
	"WalletCore/internal/usecase/create_account"
	"WalletCore/internal/usecase/create_client"
	"WalletCore/internal/usecase/create_transaction"
	"WalletCore/internal/web"
	"WalletCore/internal/web/webserver"
	"WalletCore/pkg/events"
	"WalletCore/pkg/kafka"
	"WalletCore/pkg/uow"
	"context"
	"database/sql"
	"fmt"
	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	_ "github.com/go-sql-driver/mysql"
)

func main() {

	//db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local", "root", "root", "mysql", "3306", "wallet"))
	db, err := sql.Open("mysql", "root:root@tcp(mysql:3306)/wallet?parseTime=true")
	if err != nil {
		fmt.Println("Erro ao conectar ao banco de dados")
		panic(err)
	}
	defer db.Close()

	configMap := ckafka.ConfigMap{
		"bootstrap.servers": "kafka:29092",
		"group.id":          "wallet",
	}

	kafkaProducer := kafka.NewKafkaProducer(&configMap)

	eventDispacher := events.NewEventDispatcher()
	eventDispacher.Register("TransactionCreated", handler.NewTransactionCreatedKafkaHandler(kafkaProducer))
	eventDispacher.Register("BalanceUpdated", handler.NewUpdateBalanceKafkaHandler(kafkaProducer))
	transactionCreatedEvent := event.NewTransactionCreated()
	balanceUpdatedEvent := event.NewBalanceUpdated()
	//eventDispacher.Register("TransactionCreated", handler)

	clientDb := database.NewClientDb(db)
	accountDb := database.NewAccountDb(db)

	ctx := context.Background()
	uow := uow.NewUow(ctx, db)
	uow.Register("AccountDb", func(tx *sql.Tx) interface{} {
		return database.NewAccountDb(db)
	})
	uow.Register("TransactionDB", func(tx *sql.Tx) interface{} {
		return database.NewTransactionDB(db)
	})

	createClientUseCase := create_client.NewCreateClientUseCase(clientDb)
	createAccountUseCase := create_account.NewCreateAccountUseCase(accountDb, clientDb)
	createTransactionUseCase := create_transaction.NewCreateTransactionUseCase(uow, eventDispacher, transactionCreatedEvent, balanceUpdatedEvent)

	webserver := webserver.NewWebServer(":8080")
	clientHandler := web.NewWebClientHandler(*createClientUseCase)
	accountHandler := web.NewWebAccountHandler(*createAccountUseCase)
	transactionHandler := web.NewWebTransactionHandler(*createTransactionUseCase)

	webserver.AddHandler("/clients", clientHandler.CreateClient)
	webserver.AddHandler("/accounts", accountHandler.CreateAccount)
	webserver.AddHandler("/transactions", transactionHandler.CreateTransaction)

	fmt.Println("Server is running")
	webserver.Start()
}
