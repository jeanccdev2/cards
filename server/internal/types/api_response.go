package types

type ApiResponse struct {
	Status  int    `json:"status" example:"200"`
	Message string `json:"message,omitempty" example:"Operation successful"`
	Data    any    `json:"data,omitempty"`
	Error   any    `json:"error,omitempty"`
}

func NewApiResponse(status int, message string, data any, err any) ApiResponse {
	return ApiResponse{Status: status, Message: message, Data: data, Error: err}
}
