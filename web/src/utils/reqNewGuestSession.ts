import { backendEndpoint } from "./constants";

type NewGuestSessionResponse = {
  guestSessionId: string;
};

export const reqNewGuestSession = async () => {
  const result = await fetch(backendEndpoint + "api/chat/guest/new", {
    method: "POST",
  });

  if (!result.ok) {
    return null;
  }

  const data: NewGuestSessionResponse = await result.json();
  return data.guestSessionId;
};
