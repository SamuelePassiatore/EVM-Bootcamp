import { INFTReward } from "../shared/interface";

interface Question {
  _id: string;
  level: number;
  text: string;
  options: string[];
  correctOptionIndex: number;
  createdAt: string;
  __v?: number;
}

export const fetchQuestions = async (): Promise<Question[]> => {
  const API_URL = import.meta.env.VITE_API_URL;

  if (!API_URL) {
    throw new Error("MISSING_API_URL");
  }

  try {
    const response = await fetch(`${API_URL}/questions`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    console.debug("API Request:", {
      url: `${API_URL}/questions`,
      method: "GET",
      status: response.status,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(async () => ({
        message: await response.text(),
      }));

      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const data: Question[] = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", {
      endpoint: "/questions",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });

    throw error;
  }
};
export const fetchRewards = async (): Promise<INFTReward[]> => {
  const API_URL = import.meta.env.VITE_API_URL;

  if (!API_URL) {
    throw new Error("MISSING_API_URL");
  }

  try {
    const url = `${API_URL}/nft/rewards`;
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    console.debug("API Request:", {
      url,
      method: "GET",
      status: response.status,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(async () => ({
        message: await response.text(),
      }));

      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const data: INFTReward[] = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", {
      endpoint: "/questions",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });

    throw error;
  }
};

export const updateLastLevel = async (
  level: number,
): Promise<{ lastCompletedLevel: number }> => {
  const API_URL = import.meta.env.VITE_API_URL;

  if (!API_URL) {
    throw new Error("MISSING_API_URL");
  }

  try {
    const response = await fetch(`${API_URL}/questions/update-level`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ level }),
    });

    console.debug("API Request:", {
      url: `${API_URL}/questions/update-level`,
      method: "POST",
      status: response.status,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(async () => ({
        message: await response.text(),
      }));

      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const data: { lastCompletedLevel: number } = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", {
      endpoint: "/questions/update-level",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });

    throw error;
  }
};
