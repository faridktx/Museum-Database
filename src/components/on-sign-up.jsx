import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { apiFetch } from "./utils";

export function OnSignUp() {
  const { user } = useUser();

  useEffect(() => {
    const registerUser = async () => {
      if (user) {
        apiFetch("/api/register-user", "POST", user.id);
      }
    };
    registerUser();
  }, [user]);

  return null;
}
