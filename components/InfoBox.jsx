import React from "react";
import Link from "next/link";

const InfoBox = ({
  heading,
  backgroundColor = "bg-gray-100",
  buttonColor,
  infoBoxText,
  infoButtonText,
}) => {
  return (
    <div className={`${backgroundColor} p-6 rounded-lg shadow-md`}>
      <h2 className="text-2xl font-bold">{heading}</h2>
      <p className="mt-2 mb-4">{infoBoxText}</p>
      <Link
        href="/properties"
        className={`${buttonColor} inline-block text-white rounded-lg px-4 py-2 hover:bg-gray-700`}>
        {infoButtonText}
      </Link>
    </div>
  );
};

export default InfoBox;
