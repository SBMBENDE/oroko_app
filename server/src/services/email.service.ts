import nodemailer from 'nodemailer';
import { env } from '../config/env';

function createTransporter() {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    // Dev fallback: log emails to console instead of sending
    return null;
  }
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT ?? 587,
    secure: (env.SMTP_PORT ?? 587) === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
}

async function send(to: string, subject: string, html: string): Promise<void> {
  const transporter = createTransporter();
  if (!transporter) {
    console.log(`\n📧 [DEV EMAIL] To: ${to} | Subject: ${subject}\n${html}\n`);
    return;
  }
  await transporter.sendMail({ from: `"OCA-EU" <${env.EMAIL_FROM}>`, to, subject, html });
}

export async function sendVerificationEmail(
  to: string,
  firstName: string,
  token: string
): Promise<void> {
  const url = `${env.FRONTEND_URL}/verify-email?token=${token}`;
  await send(
    to,
    'Verify your OCA-EU account',
    `<h2>Welcome to OCA-EU, ${firstName}!</h2>
     <p>Please verify your email to complete your registration.</p>
     <p><a href="${url}" style="background:#d97706;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">Verify Email</a></p>
     <p>This link expires in 24 hours. If you did not register, ignore this email.</p>`
  );
}

export async function sendPasswordResetEmail(
  to: string,
  firstName: string,
  token: string
): Promise<void> {
  const url = `${env.FRONTEND_URL}/reset-password?token=${token}`;
  await send(
    to,
    'Reset your OCA-EU password',
    `<h2>Password Reset Request</h2>
     <p>Hi ${firstName}, click below to reset your password.</p>
     <p><a href="${url}" style="background:#d97706;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">Reset Password</a></p>
     <p>This link expires in 1 hour. If you did not request this, ignore this email.</p>`
  );
}

export async function sendApprovalEmail(to: string, firstName: string): Promise<void> {
  await send(
    to,
    'Your OCA-EU membership has been approved!',
    `<h2>Welcome to the community, ${firstName}!</h2>
     <p>Your membership has been approved. You can now log in and access your dashboard.</p>
     <p><a href="${env.FRONTEND_URL}/login" style="background:#d97706;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">Log In</a></p>`
  );
}

export async function sendRejectionEmail(
  to: string,
  firstName: string,
  reason?: string
): Promise<void> {
  await send(
    to,
    'Update on your OCA-EU membership application',
    `<h2>Membership Application Update</h2>
     <p>Hi ${firstName}, unfortunately your membership application was not approved at this time.</p>
     ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
     <p>Please contact us if you have any questions.</p>`
  );
}

export async function sendSuspensionEmail(
  to: string,
  firstName: string,
  reason?: string
): Promise<void> {
  await send(
    to,
    'Your OCA-EU account has been suspended',
    `<h2>Account Suspended</h2>
     <p>Hi ${firstName}, your OCA-EU account has been suspended.</p>
     ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
     <p>Please contact us to discuss this matter.</p>`
  );
}
