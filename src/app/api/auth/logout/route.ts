import { apiOk } from "@/lib/api-response";
import { COOKIE_NAME } from "@/lib/auth-server";

export async function POST() {
  const response = apiOk({ success: true });
  response.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return response;
}
