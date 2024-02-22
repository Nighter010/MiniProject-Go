package models

import "gorm.io/gorm"

/*
User คือโครงสร้างข้อมูลของผู้ใช้งาน สำหรับเก็บลงฐานข้อมูล
และใช้สำหรับการ Authenticate ผู้ใช้งาน หรือ Login
*/
type User struct {
    gorm.Model	// gorm จะสร้าง ID, CreatedAt, UpdatedAt, DeletedAt ให้เอง
    Name     string	// ชื่อผู้ใช้งาน
    Email    string	`gorm:"unique"`	// อีเมล์ผู้ใช้งานห้ามซ้ำ
    Password string `gorm:"-"`	// ไม่ต้องบันทึกลงฐานข้อมูล
    Hash     string				// รหัสผ่านแบบแฮช
}