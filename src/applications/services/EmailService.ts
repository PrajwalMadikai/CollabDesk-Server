import nodemailer from "nodemailer";

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
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
      from: `"Collabdesk" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Verify Your Email - Welcome to Collabdesk",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; border-radius: 10px; text-align: center; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="background: #000000; padding: 20px; border-radius: 10px 10px 0 0; color: #fff;">
            <h2>Welcome to Collabdesk!</h2>
          </div>
    
          <div style="padding: 20px; background: #fff; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #333;">Hello <strong>${fullname}</strong>,</p>
            <p style="font-size: 16px; color: #333;">Thank you for signing up! Please verify your email address to activate your account.</p>
            
            <a href="${verificationUrl}" 
               style="display: inline-block; padding: 12px 20px; margin: 20px 0; color: #fff; background-color: #000000; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
               Verify My Email
            </a>
    
            <p style="font-size: 14px; color: #666;">If the button above doesn’t work, copy and paste the link below into your browser:</p>
            <p style="word-break: break-all; font-size: 14px; color: #000000;">${verificationUrl}</p>
    
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
            <p style="font-size: 14px; color: #888;">If you didn’t create an account, you can safely ignore this email.</p>
            <p style="font-size: 14px; color: #888;">Best regards, <br> <strong>Your App Team</strong></p>
          </div>
    
          <div style="margin-top: 20px; font-size: 12px; color: #888;">
            <p>This email relates to your <strong>Collabdesk</strong> account.</p>
            <p>Your App Team, 123 App Street, San Francisco, CA 94107</p>
          </div>
        </div>
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

  async sendResetVerification(email: string,token: string) {
    const verificationUrl = `http://localhost:3000/email-check?email=${encodeURIComponent(
      email
    )}&token=${encodeURIComponent(token)}`;

    const mailOptions = {
      from: `"Collabdesk" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Verify Your Email - Welcome to Collabdesk",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; border-radius: 10px; text-align: center; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="background:#000000; padding: 20px; border-radius: 10px 10px 0 0; color: #fff;">
            <h2>Welcome to Your collabdesk!</h2>
          </div>

          <div style="padding: 20px; background: #fff; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #333;">Hello <strong>User</strong>,</p>
            <p style="font-size: 16px; color: #333;">  Please verify your email address to reset your password.</p>
            
            <a href="${verificationUrl}" 
               style="display: inline-block; padding: 12px 20px; margin: 20px 0; color: #fff; background-color: #000000; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
               Verify My Email
            </a>

            <p style="font-size: 14px; color: #666;">If the button above doesn’t work, copy and paste the link below into your browser:</p>
            <p style="word-break: break-all; font-size: 14px; color: #007bff;">${verificationUrl}</p>

            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
            <p style="font-size: 14px; color: #888;">If you didn’t create an account, you can safely ignore this email.</p>
            <p style="font-size: 14px; color: #888;">Best regards, <br> <strong>collabdesk.Ltd</strong></p>
          </div>
        </div>
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

  async sendCollaboratorAddedNotification(email:string,invitedByEmail:string,workspaceName:string){

    const mailOptions = {
      from: `"Collabdesk" <${process.env.SENDER_EMAIL}>`,
      to: email,  
      subject: `You've Been Added to Workspace - ${workspaceName}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; border-radius: 10px; text-align: center; box-shadow: 0px 4px 6px 10px rgba(0, 0, 0, 0.1);">
          <div style="background: #000000; padding: 20px; border-radius: 10px 10px 0 0; color: #fff;">
            <h2>Welcome to Collabdesk!</h2>
          </div>
          <div style="padding: 20px; background: #fff; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #000000;">Hello <strong>${email}</strong>,</p>
            <p style="font-size: 16px; color: #000000;">
              You have been added to the workspace <strong>${workspaceName}</strong> by <strong>${invitedByEmail}</strong>.
            </p>
            <p style="font-size: 16px; color: #000000;">
              To access the workspace, please log in to your account or verify your email if you haven't already.
            </p>
    
            <a href="${process.env.CLIENT_URL}"
               style="display: inline-block; padding: 12px 20px; margin: 20px 0; color: #fff; background-color: #000000; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
               open collabdesk
            </a>
    
           
    
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
            <p style="font-size: 14px; color: #888;">
              If you believe this is a mistake, please contact <strong>${invitedByEmail}</strong> or our support team.
            </p>
            <p style="font-size: 14px; color: #888;">Best regards, <br> <strong>Collabdesk.Ltd</strong></p>
          </div>
        </div>
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
