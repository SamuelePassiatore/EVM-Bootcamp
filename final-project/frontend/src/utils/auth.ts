import {
  type SIWESession,
  type SIWEVerifyMessageArgs,
} from "@reown/appkit-siwe";
import { apiUrl } from "../constants";
import { API } from "../shared/endpoints";

export const signOut = async () => {
  const res = await fetch(
    `${apiUrl}${API.auth.prefix}${API.auth.routes.SIGNOUT}`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await res.json();
  return data == "{}";
};

export const getNonce = async (): Promise<string> => {
  const res = await fetch(
    `${apiUrl}${API.auth.prefix}${API.auth.routes.GET_NONCE}`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  const nonce = await res.text();
  console.log("Nonce:", nonce);
  return nonce;
};

/* Function that returns the user's session - this should come from your SIWE backend */
export async function getSession() {
  const res = await fetch(
    `${apiUrl}${API.auth.prefix}${API.auth.routes.GET_SESSION}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );
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
    const response = await fetch(
      `${apiUrl}${API.auth.prefix}${API.auth.routes.VERIFY}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({ message, signature }),
        credentials: "include",
      },
    );

    if (!response.ok) {
      return false;
    }

    const result = await response.json();
    return result === true;
  } catch (error) {
    return false;
  }
};
