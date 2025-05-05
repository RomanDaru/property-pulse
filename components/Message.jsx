"use client";
// Import necessary hooks: useEffect, useRef
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useGlobalContext } from "@/context/GlobalContext";
import replyMessage from "@/app/actions/replyMessage";
// Import useFormState and useFormStatus
import { useFormState, useFormStatus } from "react-dom";

// --- Submit Button Component (uses useFormStatus) ---
// This isolates the useFormStatus hook as required
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type='submit'
      className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md ${
        pending ? "opacity-50 cursor-not-allowed" : "" // Style for pending
      }`}
      disabled={pending} // Disable button when pending
    >
      {pending ? "Sending..." : "Send Reply"}
    </button>
  );
}
// --- End Submit Button Component ---

const Message = ({ message }) => {
  const [isRead, setIsRead] = useState(message.read);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  // Add state to track if reply was just sent for immediate UI update
  const [hasBeenReplied, setHasBeenReplied] = useState(message.hasReply);
  const { setUnreadCount } = useGlobalContext();
  // Add a ref for the form element
  const formRef = useRef(null);

  // Initial state for the form action - adjust if your action returns different fields
  const initialState = { message: null, error: null, success: false };
  const [state, formAction] = useFormState(replyMessage, initialState);

  // --- useEffect to handle side effects from form submission ---
  useEffect(
    () => {
      // Check if the 'success' flag is true in the state returned by the action
      if (state.success === true) {
        // Check if there's a message to display
        if (state.message) {
          toast.success(state.message);
        }
        setHasBeenReplied(true); // Update UI immediately
        setIsReplyOpen(false); // Close modal
        formRef.current?.reset(); // Reset the form's fields (specifically the textarea)
        // Check if the message wasn't already read BEFORE the reply was sent
        if (!isRead && !hasBeenReplied) {
          // Add condition to not mark as "new" if already replied
          setIsRead(true); // Update local UI state to show "Mark As New" button
          // Decrement global unread count because it just became read
          setUnreadCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
        }
      }

      // Check if the 'error' field exists in the state returned by the action
      if (state.error) {
        toast.error(state.error);
      }
    },
    [state],
    hasBeenReplied
  ); // Reacting to the whole state object is often simplest

  // --- Your existing handleReadClick (unchanged) ---
  const handleReadClick = async () => {
    try {
      const res = await fetch(`/api/messages/${message._id}`, {
        method: "PUT",
      });

      if (res.status === 200) {
        const { read } = await res.json();
        setIsRead(read);
        setUnreadCount((prevCount) => (read ? prevCount - 1 : prevCount + 1));
        if (read) {
          toast.success("Marked as read");
        } else {
          toast.success("Marked as new");
        }
      } else {
        // Added else block for better feedback
        toast.error("Failed to update message status.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  // --- Your existing handleDeleteClick (unchanged, maybe add confirmation) ---
  const handleDeleteClick = async () => {
    // Optional: Add confirmation
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }

    try {
      const res = await fetch(`/api/messages/${message._id}`, {
        method: "DELETE",
      });

      if (res.status === 200) {
        setIsDeleted(true);
        // Corrected logic: only adjust count if it was unread
        if (!isRead) {
          setUnreadCount((prevCount) => prevCount - 1);
        }
        toast.success("Message Deleted");
      } else {
        // Added else block for better feedback
        toast.error("Failed to delete message.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error deleting message"); // More specific error
    }
  };

  // --- Your existing handleReplyClick (unchanged) ---
  const handleReplyClick = () => {
    // No need for async here
    setIsReplyOpen(true);
  };

  // --- Your existing deletion check (unchanged) ---
  if (isDeleted) {
    return null;
  }

  // --- Your existing JSX structure ---
  return (
    <div className='relative bg-white p-4 rounded-md shadow-md border border-gray-200'>
      {/* "New" badge (unchanged) */}
      {!isRead && (
        <div className='absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md'>
          New
        </div>
      )}
      {/* "Replied" badge - fix positioning to match MessageCard */}
      {hasBeenReplied && (
        <div className='absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-md'>
          Replied
        </div>
      )}
      {/* Message details (unchanged) */}
      <h2 className='text-xl mb-4'>
        <span className='font-bold'>Property Inquiry:</span>{" "}
        {message.property.name}
      </h2>
      <p className='text-gray-700'>{message.body}</p>

      <ul className='mt-4'>
        <li>
          <strong>Name:</strong> {message.sender.username}
        </li>
        <li>
          <strong>Reply Email:</strong>{" "}
          <a href={`mailto:${message.email}`} className='text-blue-500'>
            {message.email}
          </a>
        </li>
        <li>
          <strong>Reply Phone:</strong>{" "}
          <a href={`tel:${message.phone}`} className='text-blue-500'>
            {message.phone}
          </a>
        </li>
        <li>
          <strong>Received:</strong>{" "}
          {new Date(message.createdAt).toLocaleString()}
        </li>
      </ul>
      {/* Action Buttons (unchanged structure) */}
      <div className='flex gap-2 mt-4'>
        <button
          onClick={handleReadClick}
          className={` ${
            isRead
              ? "bg-gray-300 hover:bg-gray-400"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          } py-1 px-3 rounded-md`}>
          {isRead ? "Mark As New" : "Mark As Read"}
        </button>
        {/* Only show Reply button if message hasn't been replied to */}
        {!hasBeenReplied && (
          <button
            onClick={handleReplyClick}
            className='bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md'>
            Reply
          </button>
        )}
        <button
          onClick={handleDeleteClick}
          className='bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md'>
          Delete
        </button>
      </div>

      {/* --- Reply Modal --- */}
      {isReplyOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-xl w-full max-w-lg'>
            {" "}
            {/* Added shadow */}
            <h3 className='text-xl font-bold mb-4'>
              Reply to {message.sender.username}
            </h3>
            {/* Add the ref to the form */}
            <form action={formAction} ref={formRef}>
              <input
                type='hidden'
                name='originalMessageId'
                value={message._id}
              />
              <div className='mb-4'>
                <label className='block text-gray-700 mb-2' htmlFor='body'>
                  Your Message
                </label>
                <textarea
                  id='body'
                  name='body'
                  className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300'
                  rows='5'
                  placeholder='Type your reply here...'
                  required></textarea>
              </div>
              <div className='flex justify-end gap-3'>
                <button
                  type='button'
                  onClick={() => setIsReplyOpen(false)}
                  className='bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded-md'>
                  Cancel
                </button>
                {/* Use the SubmitButton component here */}
                <SubmitButton />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Message;
