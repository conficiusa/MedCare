import moment from "moment";
import { Appointment } from "./definitions";

export const appointmentConfirmPatient = (appointment: Appointment) => {
	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body>
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f7f6;">
          <h2 style="color: #4CAF50;">Appointment Confirmation</h2>
          <p style="font-size: 16px;">Dear ${appointment?.patient?.name},</p>
          <p style="font-size: 16px;">Your appointment with Dr. ${
						appointment?.doctor?.name
					} on ${moment(appointment?.date).format(
		"dddd, MMMM Do YYYY hh:mm A"
	)} has been successfully confirmed. Thank you for using MedCare .</p>
          <p style="font-size: 16px;">If you have any questions, feel free to contact us.</p>
          <p style="font-size: 16px;">Best regards,</p>
          <p style="font-size: 16px;">The Telemedicine Platform Team</p>
        </div>
        </body>
      `;
};
export const patientOnboardemail = (name: string) => {
	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      margin: 20px auto;
      padding: 20px;
      max-width: 600px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding: 20px 0;
    }
    .logo {
      width: 48px;
      height: 48px;
      margin-bottom: 10px;
      color: #22c55e; /* Tailwind green-500 */
    }
    .header h1 {
      color: #22c55e; /* Tailwind green-500 */
      font-size: 24px;
      margin: 0;
    }
    .content {
      padding: 20px;
      color: #555555;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #22c55e; /* Tailwind green-500 */
      color: #ffffff;
      text-decoration: none;
      border-radius: 4px;
      margin-top: 20px;
    }
    .footer {
      text-align: center;
      color: #777777;
      font-size: 12px;
      padding: 20px 0;
    }
    .footer a {
      color: #22c55e; /* Tailwind green-500 */
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <svg class="logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4h16v16H4V4z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M9 9h6v6H9V9z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <h1>Welcome to Medcare Hub!</h1>
    </div>
    <div class="content">
      <p>Dear ${name},</p>
      <p>Congratulations on completing your onboarding process! We're excited to have you as part of the Medcare Hub community. Our platform is designed to connect you with top medical professionals and provide you with convenient, high-quality care at your fingertips.</p>
      <p>Here’s what you can do next:</p>
      <ul>
        <li>Explore available doctors and schedule appointments easily.</li>
        <li>Access your health records securely anytime, anywhere.</li>
        <li>Receive personalized health recommendations and follow-ups.</li>
      </ul>
      <p>We're here to support you on your healthcare journey.</p>
      <a href="medcare-hub.vercel.app" class="button">Visit Medcare Hub</a>
    </div>
    <div class="footer">
      <p>If you have any questions, feel free to <a href="mailto:support@medcarehub.com">contact us</a>.</p>
      <p>&copy; 2024 Medcare Hub. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
};

export const doctorAppointmentEmail = (
	doctorName: string,
	patientName: string,
	appointmentDate: string,
	appointmentTime: string
) => {
	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Notification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
      color: #333;
      line-height: 1.6;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #4CAF50;
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
    }
    .content p {
      margin: 0 0 10px;
    }
    .content .details {
      background-color: #f4f7f6;
      padding: 15px;
      border-radius: 5px;
      margin: 15px 0;
    }
    .content .details p {
      margin: 5px 0;
    }
    .footer {
      text-align: center;
      padding: 15px;
      font-size: 14px;
      background-color: #f9f9f9;
      color: #777;
    }
    .footer a {
      color: #4CAF50;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>New Appointment Booked</h1>
    </div>
    <div class="content">
      <p>Dear Dr. ${doctorName},</p>
      <p>We are pleased to inform you that a new appointment has been booked. Please find the details below:</p>
      <div class="details">
        <p><strong>Patient Name:</strong> ${patientName}</p>
        <p><strong>Appointment Date:</strong> ${appointmentDate}</p>
        <p><strong>Time:</strong> ${appointmentTime}</p>
      </div>
      <p>If need to reschedule this appointment, please do so in your dashboard at least 10 minutes before the appointment time.</p>
      <p>Thank you for being a valued partner in providing quality healthcare services.</p>
    </div>
    <div class="footer">
      <p>MedCare Hub &copy; 2024</p>
      <p><a href="https://medcare-hub.vercel.app/doctor/dashboard/appointments">Visit your dashboard</a> to view more details.</p>
    </div>
  </div>
</body>
</html>`;
};

export const appointmentUpcomingReminder = (
	doctorName: string,
	patientName: string,
	appointmentDate: string,
	appointmentTime: string,
	timeUntil: string,
	joinLink?: string
) => {
	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Upcoming Appointment Reminder</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
      color: #333;
      line-height: 1.6;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #4CAF50;
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
    }
    .content p {
      margin: 0 0 10px;
    }
    .content .details {
      background-color: #f4f7f6;
      padding: 15px;
      border-radius: 5px;
      margin: 15px 0;
    }
    .content .details p {
      margin: 5px 0;
    }
    .btn {
      display: inline-block;
      padding: 12px 24px;
      background-color: #4CAF50;
      color: #ffffff;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      margin: 15px 0;
    }
    .urgent {
      color: #ff0000;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      padding: 15px;
      font-size: 14px;
      background-color: #f9f9f9;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Upcoming Appointment Reminder</h1>
    </div>
    <div class="content">
      <p>Dear ${patientName},</p>
      <p><strong>${timeUntil}</strong> until your appointment with Dr. ${doctorName}!</p>
      <div class="details">
        <p><strong>Appointment Date:</strong> ${appointmentDate}</p>
        <p><strong>Time:</strong> ${appointmentTime}</p>
      </div>
      <p>Please ensure you're ready for your appointment. Make sure your device, internet connection, and environment are set up for a successful consultation.</p>
      ${
				joinLink
					? `<p><a href="${joinLink}" class="btn">Join Appointment</a></p>`
					: ""
			}
      <p>If you need to reschedule, please do so as soon as possible through the MedCare Hub platform.</p>
    </div>
    <div class="footer">
      <p>MedCare Hub &copy; 2024</p>
    </div>
  </div>
</body>
</html>`;
};

export const doctorUpcomingAppointmentReminder = (
	doctorName: string,
	patientName: string,
	appointmentDate: string,
	appointmentTime: string,
	timeUntil: string,
	joinLink?: string
) => {
	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Upcoming Appointment Reminder</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
      color: #333;
      line-height: 1.6;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #4CAF50;
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
    }
    .content p {
      margin: 0 0 10px;
    }
    .content .details {
      background-color: #f4f7f6;
      padding: 15px;
      border-radius: 5px;
      margin: 15px 0;
    }
    .content .details p {
      margin: 5px 0;
    }
    .btn {
      display: inline-block;
      padding: 12px 24px;
      background-color: #4CAF50;
      color: #ffffff;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      margin: 15px 0;
    }
    .urgent {
      color: #ff0000;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      padding: 15px;
      font-size: 14px;
      background-color: #f9f9f9;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Upcoming Appointment Reminder</h1>
    </div>
    <div class="content">
      <p>Dear Dr. ${doctorName},</p>
      <p><strong>${timeUntil}</strong> until your appointment with ${patientName}!</p>
      <div class="details">
        <p><strong>Appointment Date:</strong> ${appointmentDate}</p>
        <p><strong>Time:</strong> ${appointmentTime}</p>
      </div>
      <p>Please ensure you're ready for the consultation. Make sure your device, internet connection, and environment are set up for a successful appointment.</p>
      ${
				joinLink
					? `<p><a href="${joinLink}" class="btn">Join Appointment</a></p>`
					: ""
			}
    </div>
    <div class="footer">
      <p>MedCare Hub &copy; 2024</p>
    </div>
  </div>
</body>
</html>`;
};

export interface EmailTemplateParams {
	patientName?: string;
	doctorName: string;
	reviewLink?: string;
	reportIssueLink: string;
	supportEmail: string;
}

export function generateThankYouEmail(params: EmailTemplateParams): string {
	const { patientName, doctorName, reviewLink, reportIssueLink, supportEmail } =
		params;

	if (patientName) {
		return `
      <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Thank You for Choosing MedCare, ${patientName}!</h2>
        <p>
          We hope your experience with Dr. ${doctorName} was excellent. Your feedback is important to us and helps ensure
          we provide the best care possible.
        </p>
        <p>
          Please take a moment to review your doctor by clicking the link below:
        </p>
        <p>
          <a href="${reviewLink}" style="color: #007BFF; text-decoration: none;">Leave a Review</a>
        </p>
        <p>
          If you faced any issues or have concerns, please let us know immediately by clicking below or contacting us at
          <a href="mailto:${supportEmail}" style="color: #007BFF; text-decoration: none;">${supportEmail}</a>.
        </p>
        <p>
          <a href="${reportIssueLink}" style="color: #FF0000; text-decoration: none;">Report an Issue</a>
        </p>
        <p>
          Thank you for trusting MedCare with your health. We look forward to serving you again!
        </p>
        <p>
          Best Regards,<br />
          The MedCare Team
        </p>
      </body>
      </html>
    `;
	}

	return `
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Thank You for Your Commitment, Dr. ${doctorName}!</h2>
      <p>
        We appreciate your dedication to providing exceptional care. This is a friendly reminder to complete your consultation report for your recent session.
      </p>
      <p>
        Additionally, if you feel the patient might benefit, you have the option to grant them a free or discounted follow-up session.
      </p>
      <p>
        If you encounter any issues or need assistance, please report them immediately by clicking below or contacting us at
        <a href="mailto:${supportEmail}" style="color: #007BFF; text-decoration: none;">${supportEmail}</a>.
      </p>
      <p>
        <a href="${reportIssueLink}" style="color: #FF0000; text-decoration: none;">Report an Issue</a>
      </p>
      <p>
        Thank you for your hard work and dedication to MedCare.
      </p>
      <p>
        Best Regards,<br />
        The MedCare Team
      </p>
    </body>
    </html>
  `;
}

export function bankUpdateEmail(token: string): string {
	return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>Bank Details Update Verification</title>
    <style type="text/css">
      /* Some email clients strip out head styles, so critical styles should be inline. */
      @media only screen and (max-width: 600px) {
        .container {
          width: 100% !important;
        }
        .mobile-padding {
          padding-left: 20px !important;
          padding-right: 20px !important;
        }
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f2f4f6; font-family: Arial, sans-serif;">
    <!-- Wrapper Table -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <!-- Container Table -->
          <table
            class="container"
            border="0"
            cellpadding="0"
            cellspacing="0"
            width="600"
            style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1); overflow: hidden;"
          >
            <!-- Header -->
            <tr>
              <td align="center" style="padding: 20px;">
                <img
                  src="https://medcare-hub.vercel.app/logo.png"
                  alt="Medcare hub"
                  width="150"
                  style="display: block; max-width: 100%; height: auto;"
                />
              </td>
            </tr>
            <!-- Title Section -->
            <tr>
              <td class="mobile-padding" style="padding: 0 40px 20px 40px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px; color: #333333;">Bank Details Update Request</h1>
              </td>
            </tr>
            <!-- Body Content -->
            <tr>
              <td class="mobile-padding" style="padding: 0 40px 20px 40px; color: #333333;">
                <p style="font-size: 16px; line-height: 1.5; margin: 0 0 10px 0;">Hello,</p>
                <p style="font-size: 16px; line-height: 1.5; margin: 0 0 10px 0;">
                  We received a request to update your bank details on your Medcare Hub account.
                  To ensure the security of your account, please use the verification token below.
                </p>
                <p style="font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                  Enter the token in the designated field on our website to proceed.
                </p>
                <!-- Token Display -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px 0;">
                  <tr>
                    <td align="center">
                      <span style="display: inline-block; padding: 12px 20px; font-size: 24px; letter-spacing: 2px; font-weight: bold; color: #d9534f; background-color: #f7f7f7; border: 2px dashed #cccccc; border-radius: 4px;">
                        ${token}
                      </span>
                    </td>
                  </tr>
                </table>
                <p style="font-size: 16px; line-height: 1.5; margin: 0 0 10px 0;">
                  This token is valid for <strong>10 minutes</strong>.
                </p>
                <p style="font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                  If you did not request this update, please disregard this email or contact our support team immediately.
                </p>
                <p style="font-size: 16px; line-height: 1.5; margin: 0;">Thank you,</p>
                <p style="font-size: 16px; line-height: 1.5; margin: 0;">The Telemedicine Platform Team</p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td align="center" style="background-color: #f2f4f6; padding: 20px; font-size: 12px; color: #888888;">
                <p style="margin: 0;">© 2025 Medcare Hub. All rights reserved.</p>
                <p style="margin: 0;">1234 Example Street, Suite 100, City, Country</p>
              </td>
            </tr>
          </table>
          <!-- End Container Table -->
        </td>
      </tr>
    </table>
    <!-- End Wrapper Table -->
  </body>
</html>
`;
}
