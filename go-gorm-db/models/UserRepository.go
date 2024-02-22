// create CRUD for user
package models

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// สร้าง struct ชื่อ UserRepository ที่มีฟิลด์ชื่อ Db เป็น pointer ของ gorm.DB
type UserRepository struct {
	Db *gorm.DB
}

// ทำหน้าที่สร้าง Instance ของ UserRepository และส่งคืนกลับไป ให้เรียกใช้งานได้
func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{Db: db}
}

// ทำหน้าที่ดึงข้อมูล User ทั้งหมดจากฐานข้อมูล และส่งกลับไปให้ผู้ใช้งาน
// (r *UserRepository) คือการระบุว่าเป็น method ของ UserRepository
// r คือตัวแปรที่เป็น pointer ของ UserRepository
// ฟังก์ชัน GetUsers รับพารามิเตอร์เป็น c *gin.Context และมีการส่งกลับค่าเป็น JSON กลับไปให้ผู้ใช้งานผ่าน c.JSON(200, users) ซึ่ง c คือตัวแปรที่เป็น pointer ของ gin.Context
// ในกรณีนี้เราไม่ต้องใช้ return เพราะเราใช้ c.JSON แทน
// ฟังก์ชันนี้ parameter ที่รับมาจะเป็น pointer ของ gin.Context เพราะเราจะใช้ c.JSON ส่งค่ากลับไปให้ผู้ใช้งาน
func (r *UserRepository) GetUsers(c *gin.Context) {
	var users []User
	// ดึงข้อมูล User ทั้งหมดจากฐานข้อมูล และเก็บลงในตัวแปร users
	r.Db.Find(&users) // SELECT * FROM users

	// ลบฟิลด์ Password ออก เพื่อไม่ให้แสดงใน JSON
	for i := range users {
		users[i].Password = ""
	}

	// ส่งข้อมูลกลับไปให้ผู้ใช้งาน
	c.JSON(200, users) // ส่งข้อมูลกลับไปให้ผู้ใช้งาน
}

// ทำหน้าที่เพิ่มข้อมูล User ลงในฐานข้อมูล และส่งกลับไปให้ผู้ใช้งานผ่าน c.JSON(200, newUser)
func (r *UserRepository) PostUser(c *gin.Context) {
	var newUser User
	c.BindJSON(&newUser) // รับค่า JSON จากผู้ใช้งาน และแปลงเป็น struct ของ User
	// ใช้ฟังก์ชัน GeneratePasswordHash ในการเข้ารหัสรหัสผ่าน
	newUser.Hash = GeneratePasswordHash(newUser.Password)

	// สร้างข้อมูล User ใหม่ลงในฐานข้อมูล
	r.Db.Create(&newUser) // INSERT INTO users (name, email, hash) VALUES (newUser.Name, newUser.Email, newUser.Hash)

	// ลบฟิลด์ Password ออก เพื่อไม่ให้แสดงใน JSON
	newUser.Password = ""

	// ส่งข้อมูลกลับไปให้ผู้ใช้งาน
	c.JSON(200, newUser) // ส่งข้อมูลกลับไปให้ผู้ใช้งาน
}

// ฟังก์ชันสำหรับเข้ารหัสรหัสผ่าน
func GeneratePasswordHash(password string) string {
	// ใช้ฟังก์ชัน GenerateFromPassword ในการเข้ารหัสรหัสผ่าน
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println(err)
	}
	return string(hash)
}

// ฟังก์ชันค้นหา User จากฐานข้อมูล โดยใช้ id ที่รับเข้ามาเป็นเงื่อนไขในการค้นหา
// ฟังก์ชันนี้ parameter ที่รับมาจะเป็น pointer ของ gin.Context เพราะเราจะใช้ c.JSON ส่งค่ากลับไปให้ผู้ใช้งาน
func (r *UserRepository) GetUser(c *gin.Context) {
	email := c.Param("email") // รับค่า email จากผู้ใช้งาน
	var user User             // สร้างตัวแปร user เพื่อเก็บข้อมูลที่ค้นหาได้
	// print email ออกมาดู
	fmt.Println(email)
	// ดึงข้อมูล User จากฐานข้อมูล โดยใช้ email เป็นเงื่อนไขในการค้นหา
	r.Db.First(&user, "email = ?", email) // SELECT * FROM users WHERE email = email
	c.JSON(200, user)                     // ส่งข้อมูลกลับไปให้ผู้ใช้งาน
}

// ฟังก์ชันอัพเดทข้อมูล User ลงในฐานข้อมูล และส่งกลับไปให้ผู้ใช้งานผ่าน c.JSON(200, user)
func (r *UserRepository) UpdateUser(c *gin.Context) {
	id := c.Param("id")
	var user User
	r.Db.First(&user, id) // SELECT * FROM users WHERE id = id
	c.BindJSON(&user)

	// ถ้ามีการเปลี่ยนแปลงรหัสผ่าน ให้เข้ารหัสรหัสผ่านใหม่
	if user.Password != "" {
		user.Hash = GeneratePasswordHash(user.Password)
	}

	r.Db.Save(&user) // UPDATE users SET name = user.Name, email = user.Email, hash = user.Hash WHERE id = id
	c.JSON(200, user)
}

// ฟังก์ชันลบข้อมูล User ออกจากฐานข้อมูล และส่งกลับไปให้ผู้ใช้งานผ่าน c.JSON(200, user)
func (r *UserRepository) DeleteUser(c *gin.Context) {
	id := c.Param("id")
	var user User
	r.Db.First(&user, id) // SELECT * FROM users WHERE id = id
	r.Db.Delete(&user)    // DELETE FROM users WHERE id = id
	c.JSON(200, user)
}

// ฟังก์ชันสำหรับ Login ของ User
// ฟังก์ชันนี้ parameter ที่รับมาจะเป็น pointer ของ gin.Context เพราะเราจะใช้ c.JSON ส่งค่ากลับไปให้ผู้ใช้งาน
func (r *UserRepository) Login(c *gin.Context) {
	var user User
	var inputUser User
	c.BindJSON(&inputUser)                          // รับค่า JSON จากผู้ใช้งาน และแปลงเป็น struct ของ User
	r.Db.First(&user, "email = ?", inputUser.Email) // SELECT * FROM users WHERE email = inputUser.Email
	if user.ID == 0 {
		c.JSON(401, gin.H{"message": "Invalid email or password"})
		return
	}
	// ตรวจสอบรหัสผ่าน
	// ถ้ารหัสผ่านไม่ตรงกัน ให้ส่งข้อความว่า "Invalid email or password"
	// ถ้ารหัสผ่านตรงกัน ให้ส่งข้อความว่า "Login Success"
	// ใช้ฟังก์ชัน CheckPasswordHash ในการตรวจสอบรหัสผ่าน
	if !CheckPasswordHash(inputUser.Password, user.Hash) {
		c.JSON(401, gin.H{"message": "Invalid email or password"})
		return
	}
	c.JSON(200, gin.H{"message": "success"})
}

// ฟังก์ชันสำหรับเข้ารหัสรหัสผ่าน
// ฟังก์ชันนี้รับพารามิเตอร์ 2 ตัว คือ password และ hash
// ฟังก์ชันนี้จะส่งค่ากลับเป็น boolean ว่ารหัสผ่านตรงกันหรือไม่

func CheckPasswordHash(password, hash string) bool {
	// ใช้ฟังก์ชัน CompareHashAndPassword ในการตรวจสอบรหัสผ่าน

	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	if err != nil {
		fmt.Println("Password does not match")
	}
	return err == nil // ส่งค่ากลับเป็น boolean ว่ารหัสผ่านตรงกันหรือไม่ (true หรือ false) โดยใช้เงื่อนไข err == nil ในการตรวจสอบ ถ้า err เป็น nil คือรหัสผ่านตรงกัน และส่งค่ากลับเป็น true ถ้าไม่ตรงกัน ส่งค่ากลับเป็น false
}
