import {
  CognitoIdentityProviderClient,
  UpdateUserAttributesCommand,
  GetUserAttributeVerificationCodeCommand
} from "@aws-sdk/client-cognito-identity-provider";

const cognito = new CognitoIdentityProviderClient({
  region: "us-east-1",
  endpoint: "http://localhost:9229", 
  credentials: {
    accessKeyId: "dummy",            
    secretAccessKey: "dummy"     
  }
});

export const handler = async (event) => {
  const body = JSON.parse(event.body || "{}");
  const authHeader = event.headers?.authorization;
  const phoneNumber = body.phoneNumber;

  if (!authHeader) {
    return { statusCode: 401, body: JSON.stringify({ message: "Missing Authorization header" }) };
  }

  const accessToken = authHeader.split(" ")[1];

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