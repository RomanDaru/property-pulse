"use server";

import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

async function getUnreadMessageCount() {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    return { error: "Please login to bookmark this property." };
  }

  const { userId } = sessionUser;

  const count = await Message.countDocuments({
    recipient: userId,
    read: false,
  });

  return { count };
}

export default getUnreadMessageCount;
