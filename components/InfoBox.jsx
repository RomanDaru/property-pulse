import React from "react";
import Link from "next/link";

const InfoBox = ({
  heading,
  backgroundColor = "bg-gray-100",
  buttonInfo = {},
  children,
}) => {
  return (
    <div className={`${backgroundColor} p-6 rounded-lg shadow-md`}>
      <h2 className='text-2xl font-bold'>{heading}</h2>
      <p className='mt-2 mb-4'>{children}</p>
      <Link
        href={`${buttonInfo.link}`}
        className={`${buttonInfo.backgroundColor} inline-block text-white rounded-lg px-4 py-2 hover:opacity-80`}>
        {buttonInfo.text}
      </Link>
    </div>
  );
};

export default InfoBox;
