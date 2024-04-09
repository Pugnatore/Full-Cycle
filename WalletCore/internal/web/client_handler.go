package web

import (
	"WalletCore/internal/usecase/create_client"
	"encoding/json"
	"net/http"
)

type WebClientHandler struct {
	CreateClientUserCase create_client.CreateClientUseCase
}

func NewWebClientHandler(createClientUserCase create_client.CreateClientUseCase) *WebClientHandler {
	return &WebClientHandler{CreateClientUserCase: createClientUserCase}
}

func (h *WebClientHandler) CreateClient(w http.ResponseWriter, r *http.Request) {
	var dto create_client.CreateClientInputDto
	err := json.NewDecoder(r.Body).Decode(&dto)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	output, err := h.CreateClientUserCase.Execute(dto)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(output)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}