import nodemailer from "nodemailer";
import { Resend } from "resend";

export async function sendPasswordResetEmail(toEmail: string, resetUrl: string) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.warn("[email] RESEND_API_KEY not set — password reset email skipped.");
    return;
  }

  const resend = new Resend(resendKey);
  const { error } = await resend.emails.send({
    from: "CH Furniture House <onboarding@resend.dev>",
    to: toEmail,
    subject: "Reset your admin password — CH Furniture House",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#FAF7F4;border-radius:12px">
        <div style="text-align:center;margin-bottom:24px">
          <div style="display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;background:#1C1A18;border-radius:10px">
            <span style="color:#E76A2F;font-size:22px;font-weight:800">CH</span>
          </div>
        </div>
        <h2 style="color:#1C1A18;text-align:center;margin:0 0 8px">Password Reset</h2>
        <p style="color:#6B6560;text-align:center;margin:0 0 28px;font-size:14px">
          You requested a password reset for the CH Furniture House admin panel.<br/>
          This link expires in <strong>30 minutes</strong>.
        </p>
        <div style="text-align:center;margin-bottom:32px">
          <a href="${resetUrl}"
            style="display:inline-block;background:#B5471B;color:#fff;padding:13px 36px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;letter-spacing:.3px">
            Reset Password
          </a>
        </div>
        <p style="color:#6B6560;font-size:12px;text-align:center">
          If you didn't request this, ignore this email — your password won't change.
        </p>
        <hr style="border:none;border-top:1px solid #E5DDD5;margin:24px 0"/>
        <p style="color:#B0A99F;font-size:11px;text-align:center;margin:0">
          CH Furniture House &middot; Sialkot, Pakistan
        </p>
      </div>
    `,
    text: `Reset your CH Furniture House admin password.\n\nLink (expires in 30 minutes):\n${resetUrl}\n\nIf you didn't request this, ignore this email.`,
  });

  if (error) throw new Error(error.message);
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: (process.env.SMTP_PASS ?? "").replace(/\s/g, ""),
  },
  tls: { rejectUnauthorized: false },
});

export async function sendContactNotification(data: {
  name: string;
  email?: string | null;
  phone?: string | null;
  message: string;
}) {
  const to = process.env.OWNER_EMAIL;
  if (!to || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("[email] SMTP not configured — contact notification skipped. Set SMTP_HOST, SMTP_USER, SMTP_PASS, and OWNER_EMAIL in .env.");
    return;
  }

  await transporter.sendMail({
    from: `"CH Furniture Website" <${process.env.SMTP_USER}>`,
    to,
    subject: `New enquiry from ${data.name} — CH Furniture`,
    text: [
      `Name: ${data.name}`,
      data.email ? `Email: ${data.email}` : "",
      data.phone ? `Phone: ${data.phone}` : "",
      `\nMessage:\n${data.message}`,
    ]
      .filter(Boolean)
      .join("\n"),
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#141210">
        <h2 style="margin-bottom:20px">New enquiry — CH Furniture House</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr>
            <td style="padding:8px 16px 8px 0;color:#888;white-space:nowrap;vertical-align:top">Name</td>
            <td style="padding:8px 0;font-weight:600">${data.name}</td>
          </tr>
          ${data.email ? `<tr><td style="padding:8px 16px 8px 0;color:#888;vertical-align:top">Email</td><td style="padding:8px 0"><a href="mailto:${esc(data.email)}" style="color:#b8924f">${esc(data.email)}</a></td></tr>` : ""}
          ${data.phone ? `<tr><td style="padding:8px 16px 8px 0;color:#888;vertical-align:top">Phone</td><td style="padding:8px 0"><a href="tel:${esc(data.phone)}" style="color:#b8924f">${esc(data.phone)}</a></td></tr>` : ""}
        </table>
        <div style="margin-top:20px;padding:16px 20px;background:#f5f1ea;border-radius:8px;font-size:14px;line-height:1.6">
          <p style="margin:0;white-space:pre-wrap">${data.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
        </div>
        <hr style="margin:28px 0;border:none;border-top:1px solid #e5dfd5">
        <p style="color:#aaa;font-size:12px;margin:0">Sent from chfurniturehouse.com contact form</p>
      </div>
    `,
  });
}
