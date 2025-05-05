"use client";
import { useState, useEffect } from "react";

const PropertySortOptions = ({ onSort }) => {
  const [sortBy, setSortBy] = useState("");

  // When sort option changes, call the parent's onSort function
  useEffect(() => {
    if (sortBy) {
      onSort(sortBy);
    }
  }, [sortBy, onSort]);

  return (
    <div className='mb-4'>
      <label htmlFor='sort' className='block text-white mb-2'>
        Sort By:
      </label>
      <select
        id='sort'
        className='p-2 w-full md:w-auto rounded-md'
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}>
        <option value=''>Default</option>
        <option value='price_asc'>Price (Low to High)</option>
        <option value='price_desc'>Price (High to Low)</option>
        <option value='rating_desc'>Rating (High to Low)</option>
        <option value='beds_desc'>Beds (Most to Least)</option>
        <option value='baths_desc'>Baths (Most to Least)</option>
      </select>
    </div>
  );
};

export default PropertySortOptions;
