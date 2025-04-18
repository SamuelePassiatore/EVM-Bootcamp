import {
  type SIWESession,
  type SIWEVerifyMessageArgs,
} from "@reown/appkit-siwe";

const API_URL = process.env.API_URL;

/* Function that returns the user's session - this should come from your SIWE backend */
export async function getSession() {
  const res = await fetch(API_URL + "/session", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await res.json();

  const isValidData =
    typeof data === "object" &&
    typeof data.address === "string" &&
    typeof data.chainId === "number";

  return isValidData ? (data as SIWESession) : null;
}

/* Use your SIWE server to verify if the message and the signature are valid */
export const verifyMessage = async ({
  message,
  signature,
}: SIWEVerifyMessageArgs) => {
  try {
    const response = await fetch(API_URL + "/verify", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({ message, signature }),
      credentials: "include",
    });

    if (!response.ok) {
      return false;
    }

    const result = await response.json();
    return result === true;
  } catch (error) {
    return false;
  }
};
