import React from "react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className='bg-blue-700 dark:bg-purple-900 py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold text-white sm:text-5xl md:text-6xl'>
            Find The Perfect Rental
          </h1>
          <p className='my-4 text-xl text-white'>
            Discover the perfect property that suits your needs.
          </p>
        </div>
        <Link
          href='/properties'
          className='inline-block bg-white text-blue-700 dark:bg-purple-700 dark:text-white font-bold rounded-lg px-6 py-3 mt-4 hover:bg-gray-100 dark:hover:bg-purple-600'>
          Browse Properties
        </Link>
      </div>
    </section>
  );
};

export default Hero;
