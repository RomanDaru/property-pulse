import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

export const getSessionUser = async () => {
  try {
    const session = await getServerSession(authOptions);
    console.log("DEBUG - Full session:", JSON.stringify(session, null, 2)); // 👈 Log the session

    if (!session || !session.user) {
      console.log("DEBUG - No session or user found");
      return null;
    }

    console.log("DEBUG - User object:", session.user); // 👈 Log the user object
    console.log("DEBUG - User ID:", session.user.id); // 👈 Log the ID

    return {
      user: session.user,
      userId: session.user.id,
    };
  } catch (error) {
    console.error("DEBUG - Error in getSessionUser:", error);
    return null;
  }
};
