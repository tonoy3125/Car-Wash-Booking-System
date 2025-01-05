import nodemailer from 'nodemailer'
import config from '../config'

export const sendEmail = async (to: string, resetLink: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: config.email_user,
      pass: config.email_pass,
    },
  })

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reset Your Password</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 50px auto;
            background: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header {
            background-color: #1990C6;
            padding: 20px;
            text-align: center;
            color: white;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .body {
            padding: 20px;
            text-align: center;
          }
          .body h2 {
            font-size: 22px;
            color: #333;
          }
          .body p {
            font-size: 16px;
            color: #555;
            margin-bottom: 20px;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #1990C6;
            color: #ffffff;
            text-decoration: none;
            font-size: 16px;
            border-radius: 5px;
          }
          .footer {
            background-color: #f4f4f4;
            padding: 10px;
            text-align: center;
            font-size: 12px;
            color: #777;
          }
          .footer p {
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Car Wash Service</h1>
            <p>Making Your Car Shine, Every Time!</p>
          </div>
          <div class="body">
            <h2>Reset Your Password</h2>
            <p>We received a request to reset your password. Click the button below to proceed.</p>
            <a href="${resetLink}" class="button">Reset Password</a>
            <p>If you didn’t request this, please ignore this email or contact support.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Car Wash Service. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `

  await transporter.sendMail({
    from: 'shaifshajedt@gmail.com',
    to,
    subject: 'Reset Your Password - Car Wash Service',
    text: `Hello! We received a request to reset your password. Click the link to reset it: ${resetLink}`,
    html,
  })
}
