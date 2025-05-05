import Link from "next/link";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import PropertyCard from "@/components/PropertyCard";
import PropertySearchForm from "@/components/PropertySearchForm";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { convertToSerializeableObject } from "@/utils/convertToSerializeableObject";

// NOTE: This component has been changed to a server component where we can
// query the database directly.
// This will also be a dynamically rendered component as searchParams are not
// known at build time.
// Moving this component to a server component means we can remove our app/api/properties/search/route.js
// route handler as it's no longer used.

const SearchResultsPage = async ({
  searchParams: { location, propertyType, sortBy = "" },
}) => {
  await connectDB();

  const locationPattern = new RegExp(location, "i");

  // Match location pattern against database fields
  let query = {
    $or: [
      { name: locationPattern },
      { description: locationPattern },
      { "location.street": locationPattern },
      { "location.city": locationPattern },
      { "location.state": locationPattern },
      { "location.zipcode": locationPattern },
    ],
  };

  // Only check for property if its not 'All'
  if (propertyType && propertyType !== "All") {
    const typePattern = new RegExp(propertyType, "i");
    query.type = typePattern;
  }

  // Build sort options based on sortBy parameter
  let sortOptions = {};

  switch (sortBy) {
    case "price_asc":
      sortOptions = {
        "rates.monthly": 1,
        "rates.weekly": 1,
        "rates.nightly": 1,
      };
      break;
    case "price_desc":
      sortOptions = {
        "rates.monthly": -1,
        "rates.weekly": -1,
        "rates.nightly": -1,
      };
      break;
    case "beds_desc":
      sortOptions = { beds: -1 };
      break;
    case "baths_desc":
      sortOptions = { baths: -1 };
      break;
    default:
      sortOptions = { createdAt: -1 }; // Default sort by newest
  }

  // Handle special case for rating sort
  let propertiesQueryResults;

  if (sortBy === "rating_desc") {
    // Use aggregation to get average ratings
    propertiesQueryResults = await Property.aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "property",
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: { $avg: "$reviews.rating" },
        },
      },
      {
        $sort: { averageRating: -1 },
      },
    ]);
  } else {
    // Normal sort
    propertiesQueryResults = await Property.find(query)
      .sort(sortOptions)
      .lean();
  }

  const properties = propertiesQueryResults.map(convertToSerializeableObject);

  return (
    <>
      <section className='bg-blue-700 py-4'>
        <div className='max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8'>
          <PropertySearchForm includeSort={true} />
        </div>
      </section>
      <section className='px-4 py-6'>
        <div className='container-xl lg:container m-auto px-4 py-6'>
          <Link
            href='/properties'
            className='flex items-center text-blue-500 hover:underline mb-3'>
            <FaArrowAltCircleLeft className='mr-2 mb-1' /> Back To Properties
          </Link>
          <h1 className='text-2xl mb-4'>Search Results</h1>
          {properties.length === 0 ? (
            <p>No search results found</p>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
export default SearchResultsPage;
