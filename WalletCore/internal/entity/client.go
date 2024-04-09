package entity

import (
	"errors"
	"github.com/google/uuid"
	"time"
)

type Client struct {
	ID        string
	Name      string
	Email     string
	Accounts  []*Account
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func NewClient(name string, email string) (*Client, error) {
	client := &Client{
		ID:        uuid.New().String(),
		Name:      name,
		Email:     email,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	err := client.Validate(name, email)

	if err != nil {
		return nil, err
	}

	return client, nil

}

func (c *Client) Update(name string, email string) error {
	c.Name = name
	c.Email = email
	c.UpdatedAt = time.Now()

	err := c.Validate(name, email)

	if err != nil {
		return err
	}

	return nil
}

func (c *Client) AddAccount(account *Account) error {
	if account.Client.ID != c.ID {
		return errors.New("account does not belong to this client")
	}

	c.Accounts = append(c.Accounts, account)
	return nil
}

func (c *Client) Validate(name string, email string) error {
	if name == "" {
		return errors.New("name is required")
	}
	if email == "" {
		return errors.New("email is required")
	}

	c.Name = name
	c.Email = email

	return nil
}
