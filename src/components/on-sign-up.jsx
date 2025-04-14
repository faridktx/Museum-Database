import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { apiFetch } from "./utils";

export function OnSignUp() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      apiFetch("/api/register-user", "POST");
    }
  }, [user]);

  return null;
}
