package handlers

import (
	"fmt"

	"mono_portfolio/apps/api/src/config"
	"mono_portfolio/apps/api/src/service"

	"github.com/gofiber/fiber/v3"
	"github.com/resend/resend-go/v4"
)

type Contact struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Message string `json:"message"`
	Subject string `json:"subject"`
}

// SendContactEmail receives the contact form data and sends an email to your personal inbox.
func SendContactEmail(c fiber.Ctx) error {
	var contact *Contact
	if err := c.Bind().Body(&contact); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
		})
	}

	if contact.Email == "" || contact.Name == "" || contact.Message == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Name, email, and message are required",
		})
	}

	fmt.Println("EmailClient: ", service.EmailClient)
	if service.EmailClient == nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Email client is not initialized",
		})
	}
	from := "Portfolio Contact <contact@punam.xastros.site>"

	env := config.NewEnv()
	myGmail := env.MY_PERSONAL_EMAIL
	if myGmail == "" {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "MY_PERSONAL_EMAIL is not set in environment",
		})
	}

	subject := fmt.Sprintf("New Portfolio Message from %s %s", contact.Name, contact.Subject)
	htmlContent := fmt.Sprintf(`
			<h3>New Contact Form Submission</h3>
			<p><strong>Name:</strong> %s</p>
			<p><strong>Email:</strong> %s</p>
			<hr/>
			<p><strong>Message:</strong></p>
			<p>%s</p>
		`, contact.Name, contact.Email, contact.Message)

	params := &resend.SendEmailRequest{
		From:    from,
		To:      []string{myGmail},
		ReplyTo: contact.Email,
		Subject: subject,
		Html:    htmlContent,
		Text:    fmt.Sprintf("From: %s (%s)\n\nMessage:\n%s", contact.Name, contact.Email, contact.Message),
	}

	fmt.Println("params: ", params)

	sent, err := service.EmailClient.Emails.Send(params)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": fmt.Sprintf("Failed to send email: %v", err),
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Email sent successfully",
		"id":      sent.Id,
	})
}
