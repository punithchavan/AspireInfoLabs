import nodemailer from "nodemailer";

const sendVerificationEmail = async (email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const verificationURL = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    const mailOptions = {
      from: `"NewsX" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Verify your NewsX Account",
      html: `
        <h2>Welcome to NewsX</h2>
        <p>Please click the button below to verify your email:</p>
        <a href="${verificationURL}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>This link will expire in ${process.env.EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS} hour(s).</p>
        <br />
        <p>If you did not request this, please ignore this email.</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent: ", info.messageId);

    } catch (error){
        console.error("🔴 Nodemailer error details:");
        console.error("Message:", error.message);
        console.error("Response:", error.response);
        console.error("Stack:", error.stack);
        throw new Error("Email could not be sent");
    }
};

export {
    sendVerificationEmail
}