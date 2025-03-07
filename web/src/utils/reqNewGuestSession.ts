import { backendEndpoint } from "./constants";

type NewGuestSessionResponse = {
  guestSessionId: string;
};

const newGuestSessionEndpoint = backendEndpoint + "api/guest/new";

export const reqNewGuestSession = async () => {
  const result = await fetch(newGuestSessionEndpoint, {
    method: "POST",
  });

  if (!result.ok) {
    return null;
  }

  const data: NewGuestSessionResponse = await result.json();
  return data.guestSessionId;
};
