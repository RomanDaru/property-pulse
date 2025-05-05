"use client";
import { useState, useEffect } from "react";
import PropertyCard from "@/components/PropertyCard";
import Spinner from "@/components/Spinner";
import Pagination from "@/components/Pagination";

const Properties = ({
  properties: initialProperties = [],
  total: initialTotal = 0,
  page: initialPage = 1,
  pageSize: initialPageSize = 6,
  initialSortBy = "",
}) => {
  const [properties, setProperties] = useState(initialProperties);
  const [loading, setLoading] = useState(!initialProperties.length);
  const [page, setPage] = useState(initialPage);
  const [pageSize] = useState(initialPageSize);
  const [totalItems, setTotalItems] = useState(initialTotal);
  const [sortBy] = useState(initialSortBy);

  // Update properties when initialProperties or initialSortBy changes
  useEffect(() => {
    if (initialProperties.length > 0) {
      setProperties(initialProperties);
      setLoading(false);
    }
  }, [initialProperties]);

  // Fetch properties when page changes or when we need to load more
  useEffect(() => {
    // Only fetch if we don't have initial properties or if the page has changed
    if (initialProperties.length === 0 || page !== initialPage) {
      const fetchProperties = async () => {
        try {
          setLoading(true);
          const res = await fetch(
            `/api/properties?page=${page}&pageSize=${pageSize}${
              sortBy ? `&sortBy=${sortBy}` : ""
            }`
          );

          if (!res.ok) {
            throw new Error("Failed to fetch data");
          }

          const data = await res.json();
          setProperties(data.properties);
          setTotalItems(data.total);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

      fetchProperties();
    }
  }, [page, pageSize, sortBy, initialProperties.length, initialPage]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return loading ? (
    <Spinner />
  ) : (
    <section className='px-4 py-6'>
      <div className='container-xl lg:container m-auto px-4 py-6'>
        {properties.length === 0 ? (
          <p>No properties found</p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
        <Pagination
          page={page}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
};
export default Properties;
