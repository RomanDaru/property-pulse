"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const PropertySearchForm = ({ includeSort = true }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current URL parameters
  const locationParam = searchParams.get("location") || "";
  const propertyTypeParam = searchParams.get("propertyType") || "All";
  const sortByParam = searchParams.get("sortBy") || "";

  const [location, setLocation] = useState(locationParam);
  const [propertyType, setPropertyType] = useState(propertyTypeParam);
  const [sortBy, setSortBy] = useState(sortByParam);

  // Update form values when URL parameters change
  useEffect(() => {
    setLocation(locationParam);
    setPropertyType(propertyTypeParam);
    setSortBy(sortByParam);
  }, [locationParam, propertyTypeParam, sortByParam]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    let query = "";
    let params = new URLSearchParams();

    // Add location and propertyType to query if they're set
    if (location !== "") {
      params.append("location", location);
    }

    if (propertyType !== "All") {
      params.append("propertyType", propertyType);
    }

    // Add sortBy to query if it's set
    if (sortBy !== "") {
      params.append("sortBy", sortBy);
    }

    // Build the query string
    query = params.toString() ? `?${params.toString()}` : "";

    // Determine which page to navigate to
    if (location !== "" || propertyType !== "All") {
      router.push(`/properties/search-results${query}`);
    } else {
      router.push(`/properties${query}`);
    }
  };

  // Handle sort change separately to allow immediate sorting without search
  const handleSortChange = (e) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);

    // Build the query with current parameters
    let params = new URLSearchParams(searchParams);

    if (newSortBy) {
      params.set("sortBy", newSortBy);
    } else {
      params.delete("sortBy");
    }

    // Navigate to the same page with updated sort parameter
    const path = window.location.pathname;
    router.push(`${path}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className='mx-auto max-w-2xl w-full'>
      <h2 className='text-2xl font-bold text-center mb-4 text-white'>
        Search:
      </h2>
      <div className='flex flex-col md:flex-row items-center'>
        <div className='w-full md:w-2/4 md:pr-2 mb-4 md:mb-0'>
          <label htmlFor='location' className='sr-only'>
            Search:
          </label>
          <input
            type='text'
            id='location'
            placeholder='Enter Keywords or Location'
            className='w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring focus:ring-blue-500'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className='w-full md:w-2/4 md:pl-2 mb-4 md:mb-0'>
          <label htmlFor='property-type' className='sr-only'>
            Property Type
          </label>
          <select
            id='property-type'
            className='w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring focus:ring-blue-500'
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}>
            <option value='All'>All</option>
            <option value='Apartment'>Apartment</option>
            <option value='Studio'>Studio</option>
            <option value='Condo'>Condo</option>
            <option value='House'>House</option>
            <option value='Cabin Or Cottage'>Cabin or Cottage</option>
            <option value='Loft'>Loft</option>
            <option value='Room'>Room</option>
            <option value='Other'>Other</option>
          </select>
        </div>
        <button
          type='submit'
          className='md:ml-4 mt-4 md:mt-0 w-full md:w-auto px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500 dark:bg-purple-700 dark:hover:bg-purple-600'>
          Search
        </button>
      </div>

      {/* Sort Options */}
      {includeSort && (
        <div className='mt-4 w-full'>
          <label
            htmlFor='sort-by'
            className='text-2xl block text-white font-bold text-center mb-2'>
            Sort By:
          </label>
          <select
            id='sort-by'
            className='w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring focus:ring-blue-500'
            value={sortBy}
            onChange={handleSortChange}>
            <option value=''>Default (Newest)</option>
            <option value='price_asc'>Price (Low to High)</option>
            <option value='price_desc'>Price (High to Low)</option>
            <option value='rating_desc'>Rating (High to Low)</option>
            <option value='beds_desc'>Beds (Most to Least)</option>
            <option value='baths_desc'>Baths (Most to Least)</option>
          </select>
        </div>
      )}
    </form>
  );
};
export default PropertySearchForm;
