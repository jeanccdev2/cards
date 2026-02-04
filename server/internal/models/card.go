package models

import (
	"github.com/google/uuid"
)

type Card struct {
	Base
	Title   string    `gorm:"not null" json:"title"`
	Content string    `gorm:"not null" json:"content"`
	Status  string    `gorm:"not null" json:"status"`
	UserID  uuid.UUID `gorm:"type:uuid;not null" json:"user_id"`
	User    *User     `gorm:"foreignKey:UserID;references:ID" json:"user"`
}
