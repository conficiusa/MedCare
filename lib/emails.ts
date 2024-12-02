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
