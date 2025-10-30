import {
  CognitoIdentityProviderClient,
  UpdateUserAttributesCommand,
  GetUserAttributeVerificationCodeCommand
} from "@aws-sdk/client-cognito-identity-provider";


const isLocal = process.env.NODE_ENV !== "production";

const cognito = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-1",
  endpoint: isLocal ? "http://localhost:9229" : undefined, 
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "fake",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "fake"
  }
});

export const handler = async (event) => {
  const body = JSON.parse(event.body || "{}");
  const authHeader = event.headers?.authorization;
  const phoneNumber = body.phoneNumber;

  if (!authHeader) {
    return { statusCode: 401, body: JSON.stringify({ message: "Missing Authorization header" }) };
  }

  const accessToken = authHeader.split(" ")[1];  //To get bearer token form the header 

  if (!accessToken || !phoneNumber) {
    return { statusCode: 400, body: JSON.stringify({ message: "Access token and phone number required" }) };
  }

  try {
    await cognito.send(new UpdateUserAttributesCommand({               
      AccessToken: accessToken,
      UserAttributes: [{ Name: "phone_number", Value: phoneNumber }]
    }));

    await cognito.send(new GetUserAttributeVerificationCodeCommand({
      AccessToken: accessToken,
      AttributeName: "phone_number"
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "OTP sent to new phone number." })
    };

  } catch (err) {
    console.error("Error:", err);
    return { statusCode: 500, body: JSON.stringify({ message: "Failed to send OTP", error: err.message }) };
  }
};