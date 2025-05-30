interface Question {
  _id: string;
  level: number;
  text: string;
  options: string[];
  correctOptionIndex: number;
  createdAt: string;
  __v?: number;
}

export interface UserData {
  id: string;
  walletAddress: string;
  createdAt: string;
  questionLevel: number;
  isBlocked: boolean;
  blockedUntil: string | null;
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

      throw new Error(errorData.message ?? `HTTP ${response.status}`);
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

export const fetchRewards = async (): Promise<any[]> => {
  const API_URL = import.meta.env.VITE_API_URL;

  if (!API_URL) {
    throw new Error("MISSING_API_URL");
  }

  try {
    const response = await fetch(`${API_URL}/nft/rewards`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    console.debug("API Request:", {
      url: `${API_URL}/nft/rewards`,
      method: "GET",
      status: response.status,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(async () => ({
        message: await response.text(),
      }));

      throw new Error(errorData.message ?? `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data ?? [];
  } catch (error) {
    console.error("API Error:", {
      endpoint: "/nft/rewards",
      error: error instanceof Error ? error.message : "Unknown error",
    });
    
    return [];
  }
};

export const updateLastLevel = async (
  level: number,
): Promise<{ questionLevel: number }> => {
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

      throw new Error(errorData.message ?? `HTTP ${response.status}`);
    }

    const data: { questionLevel: number } = await response.json();
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

export const mintNFT = async (level: number): Promise<any> => {
  const API_URL = import.meta.env.VITE_API_URL;

  if (!API_URL) {
    throw new Error("MISSING_API_URL");
  }

  try {
    const response = await fetch(`${API_URL}/nft/redeem?level=${level}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    console.debug("API Request:", {
      url: `${API_URL}/nft/redeem?level=${level}`,
      method: "POST",
      status: response.status,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(async () => ({
        message: await response.text(),
      }));

      throw new Error(errorData.message ?? `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", {
      endpoint: "/nft/redeem",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });

    throw error;
  }
};

export const fetchUserData = async (): Promise<UserData> => {
  const API_URL = import.meta.env.VITE_API_URL;

  if (!API_URL) {
    throw new Error("MISSING_API_URL");
  }

  try {
    const response = await fetch(`${API_URL}/questions/user-data`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    console.debug("API Request:", {
      url: `${API_URL}/questions/user-data`,
      method: "GET",
      status: response.status,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(async () => ({
        message: await response.text(),
      }));

      throw new Error(errorData.message ?? `HTTP ${response.status}`);
    }

    const data: UserData = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", {
      endpoint: "/questions/user-data",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });

    throw error;
  }
};

export const reportWrongAnswer = async (): Promise<any> => {
  const API_URL = import.meta.env.VITE_API_URL;

  if (!API_URL) {
    throw new Error("MISSING_API_URL");
  }

  try {
    const response = await fetch(`${API_URL}/questions/wrong-answer`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(async () => ({
        message: await response.text(),
      }));

      throw new Error(errorData.message ?? `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export async function fetchRecentPlayers(): Promise<any[]> {
  const API_URL = import.meta.env.VITE_API_URL;

  if (!API_URL) {
    throw new Error("MISSING_API_URL");
  }

  try {
    const response = await fetch(`${API_URL}/users/recent`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(async () => ({
        message: await response.text(),
      }));

      throw new Error(errorData.message ?? `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", {
      endpoint: "/users/recent",
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return [];
  }
}

export async function fetchRecentActivity(): Promise<any[]> {
  const API_URL = import.meta.env.VITE_API_URL;

  if (!API_URL) {
    throw new Error("MISSING_API_URL");
  }

  try {
    const response = await fetch(`${API_URL}/activity/recent`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(async () => ({
        message: await response.text(),
      }));

      throw new Error(errorData.message ?? `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", {
      endpoint: "/activity/recent",
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return [];
  }
}