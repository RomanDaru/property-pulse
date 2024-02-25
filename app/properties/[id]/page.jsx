"use client";
import React from "react";
import { useRouter, useParams } from "next/navigation";

const PropertyPage = () => {
  const router = useRouter();
  const params = useParams();
  return (
    <div className="h-dvh flex justify-center items-center">
      <h1 className="text-4xl text-red-700 font-bold">
        Welcome to PropertyPage {params.id}
      </h1>
    </div>
  );
};

export default PropertyPage;
