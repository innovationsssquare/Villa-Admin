export const BaseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.NEXT_PUBLIC_PRODUCTION_URL ||
  "http://localhost:8086/api/v1";

export const SocketUrl =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  "http://localhost:8086";