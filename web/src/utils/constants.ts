const devBackendEndpoint = new URL("http://localhost:8090");
const prodBackendEndpoint = new URL("https://api.example.com"); // Not real

export const backendEndpoint =
  process.env.NODE_ENV === "development"
    ? devBackendEndpoint
    : prodBackendEndpoint;
