import React from "react";
import Link from "next/link";

const HomePage = () => {
  return (
    <div>
      <h1 className="text-3xl">Welcome</h1>
      <Link href="/properties">Show properties</Link>
    </div>
  );
};

export default HomePage;
