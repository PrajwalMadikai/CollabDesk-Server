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
