import { twilioClient, verifyServiceSid } from "../services/twilioCLient.js";

export const handler = async (event) => {
  const { phoneNumber } = JSON.parse(event.body || "{}");

  if (!phoneNumber) {
    return { statusCode: 400, body: JSON.stringify({ message: "Phone number required" }) };
  }

  await twilioClient.verify.v2.services(verifyServiceSid).verifications.create({
    to: phoneNumber,
    channel: "sms"
  });

  return { statusCode: 200, body: JSON.stringify({ message: "OTP sent successfully" }) };
};