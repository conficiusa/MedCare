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
	return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <body
    style='background-color:rgb(245,249,247);font-family:ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'>
    <!--$-->
    <div
      style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">
      Welcome to MedCare Hub - Your Virtual Healthcare Partner
      <div>
         ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿
      </div>
    </div>
    <table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="margin-left:auto;margin-right:auto;padding-top:40px;padding-bottom:40px;padding-left:16px;padding-right:16px;max-width:600px">
      <tbody>
        <tr style="width:100%">
          <td>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="text-align:center;margin-bottom:32px">
              <tbody>
                <tr>
                  <td>
                    <h1
                      style="font-size:28px;font-weight:700;color:rgb(15,118,110);margin:0px">
                      MedCare Hub
                    </h1>
                    <p
                      style="font-size:16px;color:rgb(100,116,139);margin-top:4px;line-height:24px;margin-bottom:16px">
                      Virtual Healthcare Solutions
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="background-color:rgb(255,255,255);border-radius:16px;padding:32px;box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 8px 30px rgba(0,0,0,0.08);margin-bottom:24px">
              <tbody>
                <tr>
                  <td>
                    <h1
                      style="font-size:24px;font-weight:700;color:rgb(30,41,59);margin-bottom:16px">
                      Welcome to MedCare Hub!
                    </h1>
                    <p
                      style="font-size:16px;color:rgb(71,85,105);margin-bottom:24px;line-height:24px;margin-top:16px">
                      Dear ${name},
                    </p>
                    <p
                      style="font-size:16px;color:rgb(71,85,105);margin-bottom:24px;line-height:24px;margin-top:16px">
                      Thank you for choosing MedCare Hub as your telemedicine
                      healthcare provider. We&#x27;re excited to have you join
                      our community of patients who enjoy convenient,
                      high-quality healthcare from the comfort of their homes.
                    </p>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="background-color:rgb(240,253,250);padding:24px;border-radius:12px;margin-bottom:28px;border-left-width:4px;border-color:rgb(15,118,110);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 4px 12px rgba(15,118,110,0.08)">
                      <tbody>
                        <tr>
                          <td>
                            <p
                              style="font-size:18px;font-weight:500;color:rgb(30,41,59);margin-bottom:16px;margin:0px;line-height:24px;margin-top:16px">
                              Your Account is Ready
                            </p>
                            <p
                              style="font-size:16px;color:rgb(71,85,105);margin-bottom:16px;line-height:24px;margin-top:16px">
                              Your MedCare Hub patient account has been
                              successfully created. You can now access our full
                              range of telemedicine services.
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="text-align:center;margin-bottom:32px">
                      <tbody>
                        <tr>
                          <td>
                            <a
                              class="hover:bg-[#115e59]"
                              href="https://medcarehub.com/patient-portal"
                              style="background-color:rgb(15,118,110);color:rgb(255,255,255);font-weight:500;padding-top:14px;padding-bottom:14px;padding-left:32px;padding-right:32px;border-radius:8px;font-size:16px;text-decoration-line:none;text-align:center;box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 4px 12px rgba(15,118,110,0.25);box-sizing:border-box;line-height:100%;text-decoration:none;display:inline-block;max-width:100%;mso-padding-alt:0px;padding:14px 32px 14px 32px"
                              target="_blank"
                              ><span
                                ><!--[if mso]><i style="mso-font-width:400%;mso-text-raise:21" hidden>&#8202;&#8202;&#8202;&#8202;</i><![endif]--></span
                              ><span
                                style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:10.5px"
                                >Access Your Patient Portal</span
                              ><span
                                ><!--[if mso]><i style="mso-font-width:400%" hidden>&#8202;&#8202;&#8202;&#8202;&#8203;</i><![endif]--></span
                              ></a
                            >
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="margin-bottom:28px">
                      <tbody>
                        <tr>
                          <td>
                            <p
                              style="font-size:18px;font-weight:500;color:rgb(30,41,59);margin-bottom:16px;line-height:24px;margin-top:16px">
                              What You Can Do Now:
                            </p>
                            <table
                              align="center"
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="background-color:rgb(250,250,250);padding:24px;border-radius:12px;box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 4px 12px rgba(0,0,0,0.03)">
                              <tbody>
                                <tr>
                                  <td>
                                    <p
                                      style="font-size:16px;color:rgb(71,85,105);margin-bottom:12px;margin:0px;display:flex;line-height:24px;margin-top:16px">
                                      <span
                                        style="color:rgb(15,118,110);font-weight:700;margin-right:12px"
                                        >✓</span
                                      >Schedule telemedicine appointments with
                                      our healthcare providers
                                    </p>
                                    <p
                                      style="font-size:16px;color:rgb(71,85,105);margin-bottom:12px;margin:0px;display:flex;line-height:24px;margin-top:16px">
                                      <span
                                        style="color:rgb(15,118,110);font-weight:700;margin-right:12px"
                                        >✓</span
                                      >Access your medical records and test
                                      results securely
                                    </p>
                                    <p
                                      style="font-size:16px;color:rgb(71,85,105);margin-bottom:12px;margin:0px;display:flex;line-height:24px;margin-top:16px">
                                      <span
                                        style="color:rgb(15,118,110);font-weight:700;margin-right:12px"
                                        >✓</span
                                      >Request prescription refills and receive
                                      digital prescriptions
                                    </p>
                                    <p
                                      style="font-size:16px;color:rgb(71,85,105);margin-bottom:12px;margin:0px;display:flex;line-height:24px;margin-top:16px">
                                      <span
                                        style="color:rgb(15,118,110);font-weight:700;margin-right:12px"
                                        >✓</span
                                      >Message your healthcare team securely
                                    </p>
                                    <p
                                      style="font-size:16px;color:rgb(71,85,105);margin:0px;display:flex;line-height:24px;margin-bottom:16px;margin-top:16px">
                                      <span
                                        style="color:rgb(15,118,110);font-weight:700;margin-right:12px"
                                        >✓</span
                                      >Pay bills and manage your healthcare
                                      finances
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="margin-bottom:28px">
                      <tbody>
                        <tr>
                          <td>
                            <p
                              style="font-size:18px;font-weight:500;color:rgb(30,41,59);margin-bottom:16px;line-height:24px;margin-top:16px">
                              Getting Started is Easy
                            </p>
                            <p
                              style="font-size:16px;color:rgb(71,85,105);margin-bottom:12px;line-height:24px;margin-top:16px">
                              1.
                              <span style="font-weight:500"
                                >Complete your health profile</span
                              >
                              - Update your medical history, allergies, and
                              current medications if you haven&apos;t already to help our providers deliver
                              better care.
                            </p>
                            <p
                              style="font-size:16px;color:rgb(71,85,105);margin-bottom:12px;line-height:24px;margin-top:16px">
                              2.
                              <span style="font-weight:500"
                                >Schedule your first appointment</span
                              >
                              - Book a consultation with one of our qualified
                              healthcare providers.
                            </p>
                            <p
                              style="font-size:16px;color:rgb(71,85,105);line-height:24px;margin-bottom:16px;margin-top:16px">
                              3.
                              <span style="font-weight:500"
                                >Download our mobile app</span
                              >
                              - For even more convenient access to your
                              healthcare on the go.
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <p
                      style="font-size:16px;color:rgb(71,85,105);margin-bottom:24px;line-height:24px;margin-top:16px">
                      If you have any questions or need assistance, our support
                      team is here to help. Contact us at
                      <a
                        href="mailto:support@medcarehub.com"
                        style="color:rgb(15,118,110);text-decoration-line:none"
                        target="_blank"
                        >support@medcarehub.com</a
                      >
                      or call
                      <span style="color:rgb(30,41,59);font-weight:500"
                        >0249906015</span
                      >.
                    </p>
                    <p
                      style="font-size:16px;color:rgb(71,85,105);margin-bottom:16px;line-height:24px;margin-top:16px">
                      We look forward to providing you with exceptional
                      healthcare services.
                    </p>
                    <p
                      style="font-size:16px;color:rgb(71,85,105);margin-bottom:8px;line-height:24px;margin-top:16px">
                      Warm regards,
                    </p>
                    <p
                      style="font-size:16px;font-weight:500;color:rgb(30,41,59);line-height:24px;margin-bottom:16px;margin-top:16px">
                      The MedCare Hub Team
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="text-align:center">
              <tbody>
                <tr>
                  <td>
                    <p
                      style="font-size:14px;color:rgb(100,116,139);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                      ©
                      <!-- -->2025<!-- -->
                      MedCare Hub. All rights reserved.
                    </p>
                    <p
                      style="font-size:14px;color:rgb(100,116,139);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                     TTH Road, Tamale, Ghana
                    </p>
                    <p
                      style="font-size:14px;color:rgb(100,116,139);margin-bottom:8px;margin:0px;line-height:24px;margin-top:16px">
                      <a
                        href="https://medcarehub.com/privacy"
                        style="color:rgb(100,116,139);text-decoration-line:underline"
                        target="_blank"
                        >Privacy Policy</a
                      >
                      •<a
                        href="https://medcarehub.com/terms"
                        style="color:rgb(100,116,139);text-decoration-line:underline"
                        target="_blank"
                        >Terms of Service</a
                      >
                    </p>
                    
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <!--7--><!--/$-->
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
      <p>MedCare Hub &copy; 2025</p>
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
      <p>MedCare Hub &copy; 2025</p>
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
      <p>MedCare Hub &copy; 2025</p>
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
	isForDoctor?: boolean;
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

export function bankUpdateEmail(token: string, name: string): string {
	return `<!DOCTYPE html>
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <body
    style='background-color:rgb(245,249,247);font-family:ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'>
    <!--$-->
    <div
      style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">
      Security Alert: Bank Details Update Request - Action Required
      <div>
         ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿
      </div>
    </div>
    <table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="margin-left:auto;margin-right:auto;padding-top:40px;padding-bottom:40px;padding-left:16px;padding-right:16px;max-width:600px">
      <tbody>
        <tr style="width:100%">
          <td>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="text-align:center;margin-bottom:32px">
              <tbody>
                <tr>
                  <td>
                    <h1
                      style="font-size:28px;font-weight:700;color:rgb(15,118,110);margin:0px">
                      MedCare Hub
                    </h1>
                    <p
                      style="font-size:16px;color:rgb(100,116,139);margin-top:4px;line-height:24px;margin-bottom:16px">
                      Provider Security Alert
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="background-color:rgb(255,255,255);border-radius:16px;padding:32px;box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 8px 30px rgba(0,0,0,0.08);margin-bottom:24px">
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="background-color:rgb(255,251,235);padding:16px;border-radius:8px;border-left-width:4px;border-color:rgb(245,158,11);margin-bottom:24px">
                      <tbody>
                        <tr>
                          <td>
                            <p
                              style="font-size:16px;font-weight:500;color:rgb(146,64,14);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                              Security Alert: A request to update your bank
                              details has been initiated
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <h1
                      style="font-size:22px;font-weight:700;color:rgb(30,41,59);margin-bottom:16px">
                      Bank Details Update Verification
                    </h1>
                    <p
                      style="font-size:16px;color:rgb(71,85,105);margin-bottom:24px;line-height:24px;margin-top:16px">
                      Dear Dr. ${name},
                    </p>
                    <p
                      style="font-size:16px;color:rgb(71,85,105);margin-bottom:24px;line-height:24px;margin-top:16px">
                      We have received a request to update the bank account
                      details associated with your MedCare Hub provider account.
                      To ensure the security of your financial information, we
                      require additional verification.
                    </p>
                    <p
                      style="font-size:16px;color:rgb(71,85,105);margin-bottom:24px;line-height:24px;margin-top:16px">
                      <strong>If you did not initiate this request</strong>,
                      please contact our Provider Support team immediately at
                      (123) 456-7890 and disregard this email.
                    </p>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="background-color:rgb(240,253,250);padding:24px;border-radius:12px;margin-bottom:28px;border-width:1px;border-color:rgb(15,118,110);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 4px 12px rgba(15,118,110,0.08)">
                      <tbody>
                        <tr>
                          <td>
                            <p
                              style="font-size:18px;font-weight:500;color:rgb(30,41,59);margin-bottom:16px;text-align:center;margin:0px;line-height:24px;margin-top:16px">
                              Your Security Verification Token
                            </p>
                            <p
                              style='font-size:24px;font-weight:700;color:rgb(15,118,110);text-align:center;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;letter-spacing:2px;margin-bottom:16px;line-height:24px;margin-top:16px'>
                              ${token}
                            </p>
                            <p
                              style="font-size:14px;color:rgb(71,85,105);text-align:center;margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                              This token will expire in 30 minutes for your
                              security.
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="text-align:center;margin-bottom:28px">
                      <tbody>
                        <tr>
                          <td>
                            <a
                              class="hover:bg-[#115e59]"
                              href="https://medcarehub.com/provider-portal/banking-verification"
                              style="background-color:rgb(15,118,110);color:rgb(255,255,255);font-weight:500;padding-top:14px;padding-bottom:14px;padding-left:32px;padding-right:32px;border-radius:8px;font-size:16px;text-decoration-line:none;text-align:center;box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 4px 12px rgba(15,118,110,0.25);box-sizing:border-box;line-height:100%;text-decoration:none;display:inline-block;max-width:100%;mso-padding-alt:0px;padding:14px 32px 14px 32px"
                              target="_blank"
                              ><span
                                ><!--[if mso]><i style="mso-font-width:400%;mso-text-raise:21" hidden>&#8202;&#8202;&#8202;&#8202;</i><![endif]--></span
                              ><span
                                style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:10.5px"
                                >Complete Bank Details Update</span
                              ><span
                                ><!--[if mso]><i style="mso-font-width:400%" hidden>&#8202;&#8202;&#8202;&#8202;&#8203;</i><![endif]--></span
                              ></a
                            >
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="margin-bottom:28px">
                      <tbody>
                        <tr>
                          <td>
                            <p
                              style="font-size:18px;font-weight:500;color:rgb(30,41,59);margin-bottom:16px;line-height:24px;margin-top:16px">
                              How to Complete This Process:
                            </p>
                            <p
                              style="font-size:16px;color:rgb(71,85,105);margin-bottom:12px;line-height:24px;margin-top:16px">
                              1.
                              <span style="font-weight:500"
                                >Click the button above</span
                              >
                              to access the secure verification page.
                            </p>
                            <p
                              style="font-size:16px;color:rgb(71,85,105);margin-bottom:12px;line-height:24px;margin-top:16px">
                              2.
                              <span style="font-weight:500"
                                >Enter the security token</span
                              >
                              displayed in this email when prompted.
                            </p>
                            <p
                              style="font-size:16px;color:rgb(71,85,105);margin-bottom:12px;line-height:24px;margin-top:16px">
                              3.
                              <span style="font-weight:500"
                                >Verify your identity</span
                              >
                              using your MedCare Hub credentials.
                            </p>
                            <p
                              style="font-size:16px;color:rgb(71,85,105);line-height:24px;margin-bottom:16px;margin-top:16px">
                              4.
                              <span style="font-weight:500"
                                >Review and confirm</span
                              >
                              the new bank details.
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="background-color:rgb(241,245,249);padding:24px;border-radius:12px;margin-bottom:28px">
                      <tbody>
                        <tr>
                          <td>
                            <p
                              style="font-size:16px;font-weight:500;color:rgb(30,41,59);margin-bottom:12px;margin:0px;line-height:24px;margin-top:16px">
                              Important Security Information
                            </p>
                            <p
                              style="font-size:15px;color:rgb(71,85,105);margin-bottom:12px;margin:0px;line-height:24px;margin-top:16px">
                              • MedCare Hub will never ask for your full banking
                              details or password via email.
                            </p>
                            <p
                              style="font-size:15px;color:rgb(71,85,105);margin-bottom:12px;margin:0px;line-height:24px;margin-top:16px">
                              • Always verify that you&#x27;re on our secure
                              website (https://medcarehub.com) before entering
                              sensitive information.
                            </p>
                            <p
                              style="font-size:15px;color:rgb(71,85,105);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                              • For added security, consider using our mobile
                              app for financial updates.
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <p
                      style="font-size:16px;color:rgb(71,85,105);margin-bottom:24px;line-height:24px;margin-top:16px">
                      If you have any questions or concerns, please contact our
                      Provider Support team at
                      <a
                        href="mailto:provider-support@medcarehub.com"
                        style="color:rgb(15,118,110);text-decoration-line:none"
                        target="_blank"
                        >provider-support@medcarehub.com</a
                      >
                      or call
                      <span style="color:rgb(30,41,59);font-weight:500"
                        >(123) 456-7890</span
                      >.
                    </p>
                    <p
                      style="font-size:16px;color:rgb(71,85,105);margin-bottom:8px;line-height:24px;margin-top:16px">
                      Thank you for your attention to this security matter,
                    </p>
                    <p
                      style="font-size:16px;font-weight:500;color:rgb(30,41,59);margin-bottom:4px;line-height:24px;margin-top:16px">
                      MedCare Hub Security Team
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="text-align:center">
              <tbody>
                <tr>
                  <td>
                    <p
                      style="font-size:14px;color:rgb(100,116,139);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                      ©
                      <!-- -->2025<!-- -->
                      MedCare Hub. All rights reserved.
                    </p>
                    <p
                      style="font-size:14px;color:rgb(100,116,139);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                      123 Healthcare Avenue, Accra, Ghana
                    </p>
                    <p
                      style="font-size:14px;color:rgb(100,116,139);margin-bottom:8px;margin:0px;line-height:24px;margin-top:16px">
                      <a
                        href="https://medcarehub.com/privacy"
                        style="color:rgb(100,116,139);text-decoration-line:underline"
                        target="_blank"
                        >Privacy Policy</a
                      >
                      •<a
                        href="https://medcarehub.com/terms"
                        style="color:rgb(100,116,139);text-decoration-line:underline"
                        target="_blank"
                        >Terms of Service</a
                      >
                    </p>
                    <p
                      style="font-size:14px;color:rgb(100,116,139);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                      This is a security-critical message. You cannot
                      unsubscribe from these alerts.
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <!--7--><!--/$-->
  </body>
</html>
`;
}

// Template for immediate start notification when appointment starts now or very soon
export function generateImmediateStartEmail(
	doctorName: string,
	patientName: string,
	formattedDate: string,
	formattedTime: string,
	consultationUrl: string,
	isForDoctor: boolean
): string {
	const recipient = isForDoctor ? `Dr. ${doctorName}` : patientName;
	const otherParty = isForDoctor ? patientName : `Dr. ${doctorName}`;

	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Appointment Starts Now</title>
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
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      margin: 15px 0;
      text-align: center;
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
      <h1>Your Appointment Is Ready to Join</h1>
    </div>
    <div class="content">
      <p>Dear ${recipient},</p>
      <p><strong class="urgent">Your appointment is confirmed and ready to join now!</strong></p>
      <div class="details">
        <p><strong>${
					isForDoctor ? "Patient" : "Doctor"
				}:</strong> ${otherParty}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${formattedTime}</p>
      </div>
      <p>Your payment has been confirmed and the consultation is now available to join.</p>
      <a href="${consultationUrl}" class="btn">Join Consultation Now</a>
      <p>Please ensure your device, internet connection, and environment are prepared for a successful consultation.</p>
    </div>
    <div class="footer">
      <p>MedCare Hub &copy; 2025</p>
    </div>
  </div>
</body>
</html>`;
}

// Template for consultation completion confirmation request when meeting conditions weren't met
export function generateConsultationConfirmationEmail(params: {
	doctorName: string;
	patientName: string;
	reportIssueLink: string;
	isForDoctor: boolean;
}): string {
	const { doctorName, isForDoctor, patientName, reportIssueLink } = params;
	const recipient = isForDoctor ? `Dr. ${doctorName}` : patientName;
	const otherParty = isForDoctor ? patientName : `Dr. ${doctorName}`;
	const salutation = isForDoctor ? `Dr. ${doctorName}` : patientName;

	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Consultation Confirmation Request</title>
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
      background-color: #FFA500;
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
      margin: 0 0 15px;
    }
    .content .details {
      background-color: #f4f7f6;
      padding: 15px;
      border-radius: 5px;
      margin: 15px 0;
    }
    .btn {
      display: inline-block;
      padding: 12px 24px;
      background-color: #4CAF50;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      margin: 15px 0;
      text-align: center;
    }
    .report-btn {
      background-color: #FF9800;
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
      <h1>Consultation Completion Confirmation</h1>
    </div>
    <div class="content">
      <p>Dear ${salutation},</p>
      <p>We noticed your consultation with ${otherParty} may not have been completed properly. Our system shows that the required conditions for automatic completion were not met.</p>
      <div class="details">
        <p>For a consultation to be automatically marked as complete, both the doctor and patient must be present in the video call for at least 5 minutes.</p>
      </div>
      <p>Please reply to this email to confirm if the consultation was completed successfully. Your confirmation will help us maintain accurate records and ensure proper service delivery.</p>
      <p>If you experienced any technical issues during the consultation, please let us know so we can improve our service.</p>
      <a href="${reportIssueLink}" class="btn report-btn">Report an Issue</a>
      <p>Thank you for your cooperation.</p>
    </div>
    <div class="footer">
      <p>MedCare Hub &copy; 2025</p>
      <p>If you have any questions, please contact our support team.</p>
    </div>
  </div>
</body>
</html>`;
}

// Template for thank you email with review request after consultation is completed
export function generateConsultationCompletedEmail(params: {
	doctorName: string;
	patientName: string;
	reviewLink: string;
	reportIssueLink: string;
	isForDoctor: boolean;
}): string {
	const { doctorName, isForDoctor, patientName, reportIssueLink, reviewLink } =
		params;
	const recipient = isForDoctor ? `Dr. ${doctorName}` : patientName;

	if (!isForDoctor) {
		// Patient version with review request
		return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Consultation Completed</title>
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
      margin: 0 0 15px;
    }
    .content .details {
      background-color: #f4f7f6;
      padding: 15px;
      border-radius: 5px;
      margin: 15px 0;
    }
    .btn {
      display: inline-block;
      padding: 12px 24px;
      background-color: #4CAF50;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      margin: 15px 0;
      text-align: center;
    }
    .report-btn {
      background-color: #FF5722;
      margin-left: 10px;
    }
    .footer {
      text-align: center;
      padding: 15px;
      font-size: 14px;
      background-color: #f9f9f9;
      color: #777;
    }
    .stars {
      color: #FFD700;
      font-size: 24px;
      letter-spacing: 4px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Consultation Completed</h1>
    </div>
    <div class="content">
      <p>Dear ${recipient},</p>
      <p>Thank you for completing your consultation with Dr. ${doctorName}. We hope it was helpful and met your healthcare needs.</p>
      <p>Your feedback is valuable to us and helps maintain high-quality healthcare services on our platform.</p>
      <div class="details">
        <p class="stars">★★★★★</p>
        <p>Please take a moment to rate your experience and provide feedback:</p>
      </div>
      <center>
        <a href="${reviewLink}" class="btn">Rate Your Experience</a>
        <a href="${reportIssueLink}" class="btn report-btn">Report Issue</a>
      </center>
      <p>If you have any questions about your consultation or need further assistance, please don't hesitate to contact our support team.</p>
    </div>
    <div class="footer">
      <p>MedCare Hub &copy; 2025</p>
      <p>Thank you for choosing our platform for your healthcare needs.</p>
    </div>
  </div>
</body>
</html>`;
	} else {
		// Doctor version
		return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Consultation Completed</title>
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
      margin: 0 0 15px;
    }
    .content .details {
      background-color: #f4f7f6;
      padding: 15px;
      border-radius: 5px;
      margin: 15px 0;
    }
    .btn {
      display: inline-block;
      padding: 12px 24px;
      background-color: #4CAF50;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      margin: 15px 0;
      text-align: center;
    }
    .report-btn {
      background-color: #FF5722;
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
      <h1>Consultation Report</h1>
    </div>
    <div class="content">
      <p>Dear ${recipient},</p>
      <p>Thank you for completing your consultation with ${patientName}. Your commitment to providing quality healthcare through our platform is greatly appreciated.</p>
      <div class="details">
        <p>The consultation has been marked as completed in our system. If you need to provide any follow-up information or prescriptions for the patient, please do so through our secure platform.</p>
      </div>
      <p>Remember that you can offer follow-up appointments at a discounted rate if needed.</p>
      <center>
        <a href="${reviewLink}" class="btn">View Consultation Records</a>
        <a href="${reportIssueLink}" class="btn report-btn">Report Issue</a>
      </center>
      <p>Thank you for your continued partnership in providing excellent healthcare services.</p>
    </div>
    <div class="footer">
      <p>MedCare Hub &copy; 2025</p>
      <p>We value your expertise and dedication.</p>
    </div>
  </div>
</body>
</html>`;
	}
}
