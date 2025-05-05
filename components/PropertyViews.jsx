"use client";
import React, { useEffect, useState } from "react";

const PropertyViews = ({ property }) => {
  // Initialize view count, ensuring it's a number
  const initialCount = typeof property.views === "number" ? property.views : 0;
  const [viewCount, setViewCount] = useState(initialCount);

  useEffect(() => {
    const updateViews = async () => {
      console.log(
        "PropertyViews component mounted for property:",
        property._id
      );

      // Create a unique key for this property in this session
      const viewKey = `property_viewed_${property._id}`;

      // Check if we've already viewed this property in this session
      if (!sessionStorage.getItem(viewKey)) {
        console.log(
          "Property not viewed in this session, incrementing view count"
        );

        try {
          console.log(
            "Calling API endpoint:",
            `/api/properties/${property._id}/increment-views`
          );

          const res = await fetch(
            `/api/properties/${property._id}/increment-views`,
            {
              method: "POST",
              headers: {
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
              },
            }
          );

          console.log("API response status:", res.status);

          if (res.ok) {
            const updatedViews = await res.json();
            console.log("Views updated successfully. New count:", updatedViews);

            // Update the view count in the UI, ensuring it's a number
            const newCount =
              typeof updatedViews === "number" ? updatedViews : viewCount + 1;
            setViewCount(newCount);

            // Mark this property as viewed in this session
            sessionStorage.setItem(viewKey, "true");
          } else {
            const errorText = await res.text();
            console.error(
              "Failed to update views. Server response:",
              errorText
            );
          }
        } catch (error) {
          console.error("Error updating views:", error);
        }
      } else {
        console.log(
          "Property already viewed in this session, not incrementing view count"
        );
      }
    };

    updateViews();
  }, [property._id]);

  return (
    <div className='text-gray-500 dark:text-white text-sm'>
      Views: {viewCount}
    </div>
  );
};

export default PropertyViews;
