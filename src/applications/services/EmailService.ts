import nodemailer from "nodemailer";

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure nodemailer transporter
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", 
      port: 587, 
      secure: false, 
      auth: {
        user: process.env.SENDER_EMAIL,  
        pass: process.env.MAILER_AUTH,  
      },
    });
  }

  async sendVerificationEmail(email: string, fullname: string, token: string) {
    const verificationUrl = `http://localhost:3000/verify-email?email=${encodeURIComponent(
      email
    )}&token=${encodeURIComponent(token)}`;

    const mailOptions = {
      from: process.env.SENDER_EMAIL,  
      to: email,  
      subject: "Verify Your Email",
      html: `
        <p>Hi ${fullname},</p>
        <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
        <p>${verificationUrl}</p>
        <p>Best regards,<br>Your App Team</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log("Verification email sent to:", email);
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send verification email.");
    }
  }
}
