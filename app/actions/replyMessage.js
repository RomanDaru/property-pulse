"use server";
import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

async function replyMessage(previousState, formData) {
  await connectDB();
  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User ID is required");
  }

  const { userId } = sessionUser;
  const { name, email } = sessionUser.user || {};

  console.log("Session User ID:", sessionUser);
  const originalMessageId = formData.get("originalMessageId");

  if (!originalMessageId) {
    return { error: "Original message ID is required" };
  }

  // Find the original message to know who to reply to
  const originalMessage = await Message.findById(originalMessageId);

  if (!originalMessage) {
    return { error: "Original message not found" };
  }

  if (userId === originalMessage.sender.toString()) {
    return { error: "You cannot reply to yourself" };
  }

  const reply = new Message({
    sender: userId, // The one replying (current user)
    recipient: originalMessage.sender, // The original sender
    property: originalMessage.property, // Same property
    name: name || "Property Owner", // Use form data or session data
    email: email || "No email provided", // Use form data or session data
    phone: sessionUser.user?.Phone || "No phone provided",
    body: formData.get("body"), // The reply text
    isReply: true,
    replyTo: originalMessageId,
  });

  try {
    await reply.save();

    // Update the original message to indicate it has been replied to
    await Message.findByIdAndUpdate(originalMessageId, {
      hasReply: true,
      read: true,
    });

    return { success: true, message: "Reply sent successfully" };
  } catch (error) {
    console.error("Error saving reply:", error);
    return { error: error.message || "Failed to send reply", success: false };
  }
}

export default replyMessage;
