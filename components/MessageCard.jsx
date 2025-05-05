"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import markMessageAsRead from "@/app/actions/markMessageAsRead";
import deleteMessage from "@/app/actions/deleteMessage";
import { useGlobalContext } from "@/context/GlobalContext";

const MessageCard = ({ message }) => {
  const [isRead, setIsRead] = useState(message.read);
  const [isDeleted, setIsDeleted] = useState(false);

  const { setUnreadCount } = useGlobalContext();

  const handleReadClick = async () => {
    const read = await markMessageAsRead(message._id);

    setIsRead(read);
    setUnreadCount((prev) => (read ? prev - 1 : prev + 1));
    toast.success(`Marked as ${read ? "read" : "new"}`);
  };

  const handleDeleteClick = async () => {
    const deleted = await deleteMessage(message._id);
    setIsDeleted(true);
    setUnreadCount((prev) => (isRead ? prev : prev - 1));
    toast.success("Message deleted successfully!");
  };

  const formattedDate = new Date(message.createdAt).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isDeleted) {
    return <p>Deleted Message</p>;
  }

  return (
    <div className='relative bg-white p-4 rounded-md shadow-md border border-gray-200'>
      <div className='absolute top-2 right-2 w-20 text-right'>
        {!isRead && !message.hasReply && (
          <div className='inline-block bg-yellow-500 text-white px-2 py-1 rounded-md'>
            New
          </div>
        )}
        {message.hasReply && (
          <div className='inline-block bg-green-500 text-white px-2 py-1 rounded-md'>
            Replied
          </div>
        )}
      </div>
      <h2 className='text-xl mb-4'>
        <span className='font-bold'>Property Inquiry:</span>{" "}
        {message.property.name}
      </h2>
      <p className='text-gray-700'>{message.body}</p>

      <ul className='mt-4'>
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
          <strong>Received:</strong> {formattedDate}
        </li>
      </ul>
      <div className='flex gap-4 mt-4'>
        <button
          onClick={handleReadClick}
          className=' bg-blue-500 text-white py-1 px-3 rounded-md'>
          {isRead ? "Mark As New" : "Mark As Read"}
        </button>
        <button
          onClick={handleDeleteClick}
          className=' bg-red-500 text-white py-1 px-3 rounded-md'>
          Delete
        </button>
      </div>
    </div>
  );
};

export default MessageCard;
