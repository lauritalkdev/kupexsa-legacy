import nodemailer from "nodemailer";

type SendEmailOptions = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
};

function getTransporter() {
  const host = process.env.EMAIL_HOST;
  const port = Number(process.env.EMAIL_PORT || 465);
  const user = process.env.EMAIL_USER;
  const password = process.env.EMAIL_PASSWORD;

  if (!host || !user || !password) {
    throw new Error("Email server configuration is incomplete.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass: password,
    },
  });
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailOptions) {
  const user = process.env.EMAIL_USER;
  const fromName = process.env.EMAIL_FROM_NAME || "KUPEXSA Connect";

  if (!user) {
    throw new Error("Email sender is not configured.");
  }

  const transporter = getTransporter();

  return transporter.sendMail({
    from: `"${fromName}" <${user}>`,
    to,
    subject,
    html,
    text,
    replyTo: user,
  });
}