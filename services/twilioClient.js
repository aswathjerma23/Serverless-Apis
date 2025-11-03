import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_API_SID,
  TWILIO_API_SECRET,
  TWILIO_VERIFY_SID,
} = process.env;

// twilio client using API Key + Secret
export const twilioClient = twilio(TWILIO_API_SID, TWILIO_API_SECRET, {
  accountSid: TWILIO_ACCOUNT_SID,
});

// Verify Service ID
export const verifyServiceSid = TWILIO_VERIFY_SID;