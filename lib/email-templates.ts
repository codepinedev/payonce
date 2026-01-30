const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://payonce.tools";

export interface ApprovalEmailParams {
  toolName: string;
  toolSlug: string;
}

export function generateApprovalEmailHtml({
  toolName,
  toolSlug,
}: ApprovalEmailParams): string {
  const toolUrl = `${APP_URL}/tools/${toolSlug}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your submission has been approved!</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; background-color: #fafafa; margin: 0; padding: 40px 20px;">
  <div style="max-width: 520px; margin: 0 auto;">

    <!-- Header -->
    <div style="padding: 24px 0; border-bottom: 1px solid #e5e5e5;">
      <div style="display: inline-flex; align-items: center;">
        <span style="display: inline-block; width: 12px; height: 12px; background: #E85A4F; border-radius: 50%; margin-right: 8px;"></span>
        <span style="font-size: 18px; font-weight: 700; color: #1a1a1a;">PayOnce</span>
      </div>
    </div>

    <!-- Content -->
    <div style="padding: 40px 0;">
      <p style="font-size: 14px; color: #666; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px;">Submission Approved</p>

      <h1 style="font-size: 28px; font-weight: 700; color: #1a1a1a; margin: 0 0 24px 0; line-height: 1.3;">
        ${toolName} is now live
      </h1>

      <p style="font-size: 16px; color: #444; margin: 0 0 16px 0;">
        Your submission has been reviewed and approved. It's now listed on PayOnce and ready for the community to discover.
      </p>

      <p style="font-size: 16px; color: #444; margin: 0 0 32px 0;">
        Thank you for contributing to the pay-once software movement.
      </p>

      <a href="${toolUrl}" style="display: inline-block; background: #1a1a1a; color: #ffffff; padding: 14px 32px; text-decoration: none; font-size: 14px; font-weight: 600;">
        View your listing →
      </a>
    </div>

    <!-- Footer -->
    <div style="padding: 24px 0; border-top: 1px solid #e5e5e5;">
      <p style="font-size: 13px; color: #999; margin: 0;">
        Software you buy once and own forever.
      </p>
      <p style="font-size: 12px; color: #bbb; margin: 16px 0 0 0;">
        You received this email because you submitted a tool to PayOnce.
      </p>
    </div>

  </div>
</body>
</html>
  `.trim();
}

export function generateApprovalEmailText({
  toolName,
  toolSlug,
}: ApprovalEmailParams): string {
  const toolUrl = `${APP_URL}/tools/${toolSlug}`;

  return `
SUBMISSION APPROVED

${toolName} is now live

Your submission has been reviewed and approved. It's now listed on PayOnce and ready for the community to discover.

Thank you for contributing to the pay-once software movement.

View your listing: ${toolUrl}

—
PayOnce
Software you buy once and own forever.
  `.trim();
}

export type ContributionType = "edit" | "pricing";

export interface ContributionThankYouParams {
  toolName: string;
  toolSlug: string;
  contributionType: ContributionType;
}

export function generateContributionThankYouHtml({
  toolName,
  toolSlug,
  contributionType,
}: ContributionThankYouParams): string {
  const toolUrl = `${APP_URL}/tools/${toolSlug}`;
  const typeLabel = contributionType === "edit" ? "edit suggestion" : "pricing update";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank you for your contribution!</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; background-color: #fafafa; margin: 0; padding: 40px 20px;">
  <div style="max-width: 520px; margin: 0 auto;">

    <!-- Header -->
    <div style="padding: 24px 0; border-bottom: 1px solid #e5e5e5;">
      <div style="display: inline-flex; align-items: center;">
        <span style="display: inline-block; width: 12px; height: 12px; background: #E85A4F; border-radius: 50%; margin-right: 8px;"></span>
        <span style="font-size: 18px; font-weight: 700; color: #1a1a1a;">PayOnce</span>
      </div>
    </div>

    <!-- Content -->
    <div style="padding: 40px 0;">
      <p style="font-size: 14px; color: #666; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px;">Contribution Accepted</p>

      <h1 style="font-size: 28px; font-weight: 700; color: #1a1a1a; margin: 0 0 24px 0; line-height: 1.3;">
        Thank you for helping improve PayOnce!
      </h1>

      <p style="font-size: 16px; color: #444; margin: 0 0 16px 0;">
        Your ${typeLabel} for <strong>${toolName}</strong> has been reviewed and applied. The listing is now updated with your contribution.
      </p>

      <p style="font-size: 16px; color: #444; margin: 0 0 32px 0;">
        Community contributions like yours help keep PayOnce accurate and up-to-date. We truly appreciate your help!
      </p>

      <a href="${toolUrl}" style="display: inline-block; background: #1a1a1a; color: #ffffff; padding: 14px 32px; text-decoration: none; font-size: 14px; font-weight: 600;">
        View updated listing →
      </a>
    </div>

    <!-- Footer -->
    <div style="padding: 24px 0; border-top: 1px solid #e5e5e5;">
      <p style="font-size: 13px; color: #999; margin: 0;">
        Software you buy once and own forever.
      </p>
      <p style="font-size: 12px; color: #bbb; margin: 16px 0 0 0;">
        You received this email because you submitted a contribution to PayOnce.
      </p>
    </div>

  </div>
</body>
</html>
  `.trim();
}

export function generateContributionThankYouText({
  toolName,
  toolSlug,
  contributionType,
}: ContributionThankYouParams): string {
  const toolUrl = `${APP_URL}/tools/${toolSlug}`;
  const typeLabel = contributionType === "edit" ? "edit suggestion" : "pricing update";

  return `
CONTRIBUTION ACCEPTED

Thank you for helping improve PayOnce!

Your ${typeLabel} for ${toolName} has been reviewed and applied. The listing is now updated with your contribution.

Community contributions like yours help keep PayOnce accurate and up-to-date. We truly appreciate your help!

View updated listing: ${toolUrl}

—
PayOnce
Software you buy once and own forever.
  `.trim();
}
