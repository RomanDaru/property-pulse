import React from "react";
import PropertyCard from "@/components/PropertyCard";
import connectDB from "@/config/database.js";
import { fetchProperties } from "@/utils/requests";
import Property from "@/models/Property";
import Pagination from "@/components/Pagination";

const PropertiesPage = async ({ searchParams: { page = 1, pageSize = 9 } }) => {
  await connectDB();
  const skip = (page - 1) * pageSize;

  const total = await Property.countDocuments({});
  const properties = await Property.find({}).skip(skip).limit(pageSize);

  const showPagination = total > pageSize;

  //Sort properties by date
  properties.sort((a, b) => new Date(b.creatredAt) - new Date(a.creatredAt));

  return (
    <section className='px-4 py-6'>
      <div className='container-xl lg:container m-auto px-4 py-6'>
        {properties.length === 0 ? (
          <p>No properties found!</p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
      {showPagination && (
        <Pagination
          page={parseInt(page)}
          pageSize={parseInt(pageSize)}
          totalItems={total}
        />
      )}
    </section>
  );
};

export default PropertiesPage;
