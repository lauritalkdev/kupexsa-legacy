type RegistrationEmailOptions = {
  fullName: string;
  email: string;
};

export function buildRegistrationEmail({
  fullName,
  email,
}: RegistrationEmailOptions) {
  const loginUrl = "https://www.kupexsa.org/login";

  return {
    subject: "Welcome to KUPEXSA Connect — Complete Your Member Profile",
    text: `
Dear ${fullName},

Your registration on the global KUPEXSA Connect platform has been received successfully.

Your account is currently awaiting administrative verification, but you can already log in to your member account and complete your profile from the dashboard.

Completing your KUPEXSA profile with accurate information, including your Class/Badge Year, Chapter, contact details and other relevant member information, is one of the fastest ways to help the KUPEXSA administration identify and verify your account.

Registered Email: ${email}
Membership Status: Pending Approval

Login to KUPEXSA Connect:
${loginUrl}

We encourage you to complete your profile as soon as possible so you can fully benefit from the global KUPEXSA member network.

KUPEXSA Administration
Kupexsan: Proud to Belong
www.kupexsa.org
info@kupexsa.org
    `.trim(),

    html: `
      <div style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
        <div style="max-width:640px;margin:0 auto;padding:32px 16px;">
          
          <div style="background:#071A3D;border-radius:18px 18px 0 0;padding:28px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:28px;">
              KUPEXSA Connect
            </h1>

            <p style="margin:8px 0 0;color:#D4AF37;font-size:14px;font-weight:700;">
              Kupexsan: Proud to Belong
            </p>
          </div>

          <div style="background:#ffffff;padding:32px;border-radius:0 0 18px 18px;">
            <h2 style="margin:0 0 20px;color:#071A3D;font-size:24px;">
              Welcome to KUPEXSA Connect
            </h2>

            <p style="font-size:16px;line-height:1.7;color:#333333;">
              Dear ${fullName},
            </p>

            <p style="font-size:16px;line-height:1.7;color:#333333;">
              Your registration on the global KUPEXSA Connect platform has been
              received successfully.
            </p>

            <p style="font-size:16px;line-height:1.7;color:#333333;">
              Your account is currently awaiting administrative verification,
              but you can already log in to your member account and complete
              your profile from the dashboard.
            </p>

            <div style="margin:24px 0;padding:18px;background:#fff8e1;border-left:4px solid #D4AF37;border-radius:8px;">
              <p style="margin:0;font-size:15px;line-height:1.7;color:#333333;">
                Completing your KUPEXSA profile with accurate information,
                including your Class/Badge Year, Chapter, contact details and
                other relevant member information, is one of the fastest ways
                to help the KUPEXSA administration identify and verify your account.
              </p>
            </div>

            <div style="margin:24px 0;padding:18px;background:#f4f6f8;border-radius:10px;">
              <p style="margin:0 0 8px;color:#555555;font-size:14px;">
                <strong>Registered Email:</strong> ${email}
              </p>

              <p style="margin:0;color:#555555;font-size:14px;">
                <strong>Membership Status:</strong> Pending Approval
              </p>
            </div>

            <div style="text-align:center;margin:30px 0;">
              <a
                href="${loginUrl}"
                style="display:inline-block;background:#071A3D;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:10px;font-size:15px;font-weight:700;"
              >
                Login to KUPEXSA Connect
              </a>
            </div>

            <p style="font-size:15px;line-height:1.7;color:#555555;">
              We encourage you to complete your profile as soon as possible so
              you can fully benefit from the global KUPEXSA member network.
            </p>

            <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;" />

            <p style="margin:0;color:#071A3D;font-size:14px;font-weight:700;">
              KUPEXSA Administration
            </p>

            <p style="margin:6px 0 0;color:#777777;font-size:13px;">
              Kupexsan: Proud to Belong
            </p>

            <p style="margin:8px 0 0;color:#777777;font-size:13px;">
              www.kupexsa.org · info@kupexsa.org
            </p>
          </div>

        </div>
      </div>
    `,
  };
}