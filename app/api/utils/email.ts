"use server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  auth: {
    user: "addawebadua@gmail.com",
    pass: process.env.GMAIL_PASSWORD, // Make sure to use an app-specific password or OAuth2 for better security
  },
});
export async function sendEmail(
  recipient: string,
  subject: string,
  body: string
) {
  try {
    // Define the email options
    const mailOptions = {
      from: "addawebadua@gmail.com", // Sender's email
      to: recipient, // Recipient's email
      subject: subject, // Subject line
      html: body, // HTML body (can include inline styles)
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
