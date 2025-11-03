import { twilioClient, verifyServiceSid } from "../services/twilioCLient.js";

export const handler = async (event) => {
  const { phoneNumber, otp } = JSON.parse(event.body || "{}");

  if (!phoneNumber || !otp) {
    return { statusCode: 400, body: JSON.stringify({ message: "Phone number and OTP required" }) };
  }

  const result = await twilioClient.verify.v2.services(verifyServiceSid)
    .verificationChecks.create({ to: phoneNumber, code: otp });

  if (result.status === "approved") {
    return { statusCode: 200, body: JSON.stringify({ message: "Phone verified successfully" }) };
  }

  return { statusCode: 400, body: JSON.stringify({ message: "Invalid or expired OTP" }) };
};