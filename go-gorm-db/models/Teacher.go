// models/Teacher.go
package models

import "gorm.io/gorm"

// Teacher represents the structure of your "Teachers" table in the database.
type Teacher struct {
	gorm.Model // Gorm's default model that includes fields like ID, CreatedAt, UpdatedAt, and DeletedAt

	// Your custom fields
	FirstName string
	LastName  string
	Age       int
	Salary    int
}

// You can add more fields and methods based on your specific requirements.
