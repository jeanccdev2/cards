package auth

type RegisterRequestDTO struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginRequestDTO struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type UserResponseDTO struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	CreatedAt string `json:"created_at"`
}

type LoginResponseDTO struct {
	Token string           `json:"token"`
	User  *UserResponseDTO `json:"user"`
}

type ForgotPasswordRequestDTO struct {
	Email string `json:"email" binding:"required"`
}
