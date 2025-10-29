import {
  CognitoIdentityProviderClient,
  VerifyUserAttributeCommand
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
  const otp = body.otp;

  if (!authHeader) {
    return { statusCode: 401, body: JSON.stringify({ message: "Missing Authorization header" }) };
  }

  const accessToken = authHeader.split(" ")[1];

  if (!accessToken || !otp) {
    return { statusCode: 400, body: JSON.stringify({ message: "Access token and otp required" }) };
  }

  try {
    await cognito.send(new VerifyUserAttributeCommand({
      AccessToken: accessToken,
      AttributeName: "phone_number",
      Code: otp
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Phone number verified successfully." })
    };

  } catch (err) {
    console.error("Verification Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Verification failed", error: err.message })
    };
  }
};