"""Email sending tool using Gmail SMTP."""
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def send_email(to: str, subject: str, body: str) -> str:
    """Send an email via Gmail SMTP."""
    gmail_address = os.getenv("GMAIL_ADDRESS", "")
    gmail_password = os.getenv("GMAIL_APP_PASSWORD", "")

    if not gmail_address or not gmail_password:
        return f"EMAIL QUEUED (no credentials configured): To={to}, Subject={subject}"

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"Q-Empire Automation <{gmail_address}>"
        msg["To"] = to

        # Create HTML version
        html_body = f"""
        <html>
        <body style="font-family: Inter, sans-serif; background: #0A0A1A; color: white; padding: 40px;">
            <div style="max-width: 600px; margin: 0 auto; background: #1a1a2e; border-radius: 16px; padding: 32px; border: 1px solid rgba(65,105,225,0.2);">
                <div style="text-align: center; margin-bottom: 24px;">
                    <div style="display: inline-block; width: 40px; height: 40px; background: linear-gradient(135deg, #4169E1, #BF00FF); border-radius: 8px; line-height: 40px; font-weight: 900; font-size: 18px; color: white;">Q</div>
                    <h2 style="color: white; margin-top: 12px;">Q-Empire Automation</h2>
                </div>
                <div style="color: rgba(255,255,255,0.8); line-height: 1.6;">
                    {body}
                </div>
                <div style="margin-top: 32px; text-align: center;">
                    <a href="https://qempireai.com" style="display: inline-block; background: linear-gradient(to right, #4169E1, #BF00FF); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Visit Your Dashboard</a>
                </div>
                <p style="color: rgba(255,255,255,0.4); font-size: 12px; text-align: center; margin-top: 32px;">
                    © 2026 Q-Empire Automation Division. Building empires on autopilot.
                </p>
            </div>
        </body>
        </html>
        """

        msg.attach(MIMEText(body, "plain"))
        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(gmail_address, gmail_password)
            server.send_message(msg)

        return f"Email sent to {to}: {subject}"

    except Exception as e:
        return f"ERROR sending email to {to}: {str(e)}"
