"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import markMessageAsRead from "@/app/actions/markMessageAsRead";
import deleteMessage from "@/app/actions/deleteMessage";
import { useGlobalContext } from "@/context/GlobalContext";
import { set } from "mongoose";

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

  if (isDeleted) {
    return <p>Deleted Message</p>;
  }

  return (
    <div className='relative bg-white p-4 rounded-md shadow-md border border-gray-200'>
      {!isRead && (
        <div className='absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md'>
          New
        </div>
      )}
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
          <strong>Recieved:</strong>{" "}
          {new Date(message.createdAt).toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </li>
      </ul>
      <button
        onClick={handleReadClick}
        className='mt-4 mr-3 bg-blue-500 text-white py-1 px-3 rounded-md'>
        {isRead ? "Mark As New" : "Mark As Read"}
      </button>
      <button
        onClick={handleDeleteClick}
        className='mt-4 bg-red-500 text-white py-1 px-3 rounded-md'>
        Delete
      </button>
    </div>
  );
};

export default MessageCard;
