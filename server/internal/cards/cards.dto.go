package cards

type cardStatus string

const (
	CardStatusUndone cardStatus = "undone"
	CardStatusDoing  cardStatus = "doing"
	CardStatusDone   cardStatus = "done"
)

type SimpleCardResponseDTO struct {
	Title   string `json:"title" binding:"required"`
	Content string `json:"content" binding:"required"`
}

type CreateCardDTO struct {
	Title   string `json:"title" binding:"required"`
	Content string `json:"content" binding:"required"`
}

type UpdateCardDTO struct {
	Title   *string     `json:"title"`
	Content *string     `json:"content"`
	Status  *cardStatus `json:"status" binding:"oneof=undone doing done"`
}

type GenerateMultipleCardsDTO struct {
	UserPrompt string `json:"userPrompt" binding:"required"`
}
