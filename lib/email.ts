import { Resend } from "resend";
import {
  generateApprovalEmailHtml,
  generateApprovalEmailText,
  generateContributionThankYouHtml,
  generateContributionThankYouText,
  type ApprovalEmailParams,
  type ContributionThankYouParams,
} from "./email-templates";

const resendApiKey = process.env.RESEND_API_KEY;

// Lazy initialization to avoid issues during build
let _resend: Resend | null = null;

function getResendClient(): Resend | null {
  if (!resendApiKey) {
    console.warn("RESEND_API_KEY is not set - email sending disabled");
    return null;
  }
  if (!_resend) {
    _resend = new Resend(resendApiKey);
  }
  return _resend;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<EmailResult> {
  const resend = getResendClient();

  if (!resend) {
    console.log("Email sending skipped - Resend not configured");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "PayOnce <hello@payonce.tools>",
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    console.log(data)

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Email send error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function sendApprovalNotification(
  email: string,
  params: ApprovalEmailParams
): Promise<EmailResult> {
  return sendEmail({
    to: email,
    subject: `Your submission "${params.toolName}" has been approved!`,
    html: generateApprovalEmailHtml(params),
    text: generateApprovalEmailText(params),
  });
}

export async function sendContributionThankYou(
  email: string,
  params: ContributionThankYouParams
): Promise<EmailResult> {
  const typeLabel = params.contributionType === "edit" ? "edit suggestion" : "pricing update";
  return sendEmail({
    to: email,
    subject: `Thank you! Your ${typeLabel} for "${params.toolName}" has been applied`,
    html: generateContributionThankYouHtml(params),
    text: generateContributionThankYouText(params),
  });
}
