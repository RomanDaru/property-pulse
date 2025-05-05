"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMoneyBill,
  FaMapMarker,
  FaStar,
} from "react-icons/fa";

const PropertyCard = ({ property }) => {
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  // Fetch property ratings
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await fetch(`/api/properties/${property._id}/ratings`);
        if (res.ok) {
          const data = await res.json();
          setAverageRating(data.averageRating || 0);
          setReviewCount(data.reviewCount || 0);
        }
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    };

    fetchRatings();
  }, [property._id]);

  const getRateDisplay = () => {
    const { rates } = property;

    if (rates.monthly) {
      return `${rates.monthly.toLocaleString()}/mo`;
    } else if (rates.weekly) {
      return `${rates.weekly.toLocaleString()}/wk`;
    } else if (rates.nightly) {
      return `${rates.nightly.toLocaleString()}/night`;
    }
  };

  // Render stars for rating
  const renderStars = (rating) => {
    return (
      <div className='flex'>
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={
              star <= Math.round(rating) ? "text-yellow-500" : "text-gray-300"
            }
            size={16}
          />
        ))}
      </div>
    );
  };

  return (
    <div className='rounded-xl shadow-md relative'>
      <Link href={`/properties/${property._id}`}>
        <Image
          src={property.images[0]}
          alt=''
          width={0}
          height={0}
          sizes='100vw'
          className='w-full h-auto rounded-t-xl'
        />
      </Link>

      <div className='p-4 dark:bg-purple-300 rounded-b-xl'>
        <div className='text-left md:text-center lg:text-left mb-6'>
          <div className='text-gray-600'>{property.type}</div>
          <h3 className='text-xl font-bold dark:text-black'>{property.name}</h3>
          {/* Rating display */}
          <div className='flex items-center mt-2 justify-start md:justify-center lg:justify-start'>
            {averageRating > 0 ? (
              <>
                {renderStars(averageRating)}
                <span className='text-gray-600 ml-2 text-sm'>
                  ({averageRating.toFixed(1)}) · {reviewCount} review
                  {reviewCount !== 1 ? "s" : ""}
                </span>
              </>
            ) : (
              <span className='text-gray-500 text-sm'>No reviews yet</span>
            )}
          </div>
        </div>
        <h3 className='absolute top-[10px] right-[10px] bg-white px-4 py-2 rounded-lg text-blue-500 dark:text-purple-700 font-bold text-right md:text-center lg:text-right'>
          ${getRateDisplay()}
        </h3>

        <div className='flex justify-center gap-4 text-gray-500 dark:text-black mb-4'>
          <p>
            <FaBed className='inline mr-2' /> {property.beds} {""}
            <span className='md:hidden lg:inline'>Beds</span>
          </p>
          <p>
            <FaBath className='inline mr-2' /> {property.baths} {""}
            <span className='md:hidden lg:inline'>Baths</span>
          </p>
          <p>
            <FaRulerCombined className='inline mr-2' />
            {property.square_feet}{" "}
            <span className='md:hidden lg:inline'>sqft</span>
          </p>
        </div>

        <div className='flex justify-center gap-4 text-green-900 text-sm mb-4'>
          {property.rates.nightly && (
            <p>
              <FaMoneyBill className='inline mr-2' />
              Nightly
            </p>
          )}
          {property.rates.weekly && (
            <p>
              <FaMoneyBill className='inline mr-2' />
              Weekly
            </p>
          )}
          {property.rates.monthly && (
            <p>
              <FaMoneyBill className='inline mr-2' />
              Monthly
            </p>
          )}
        </div>

        <div className='border border-gray-100 mb-5'></div>

        <div className='flex flex-col lg:flex-row justify-between mb-4'>
          <div className='flex align-middle gap-2 mb-4 lg:mb-0'>
            <FaMapMarker className='text-orange-700 mt-1' />
            <span className='text-orange-700'>
              {" "}
              {property.location.city} {property.location.state}{" "}
            </span>
          </div>
          <Link
            href={`/properties/${property._id}`}
            className='h-[36px] bg-blue-500 hover:bg-blue-600 dark:bg-purple-700 dark:hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-center text-sm'>
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
