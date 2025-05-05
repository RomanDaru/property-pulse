"use client";
import React, { useState, useEffect } from "react";

const PropertyViewsDisplay = ({ views, propertyId }) => {
  const [displayViews, setDisplayViews] = useState(
    typeof views === "number" ? views : 0
  );

  useEffect(() => {
    // Only run on the client side
    if (typeof window === "undefined") return;

    // Use the server value if it's a valid number and greater than 0
    if (typeof views === "number" && views > 0) {
      setDisplayViews(views);

      // Update localStorage with the server value
      if (propertyId) {
        localStorage.setItem(`property_views_${propertyId}`, views.toString());
      }
    }
    // Otherwise, try to get the view count from localStorage
    else if (propertyId) {
      const storedViews = localStorage.getItem(`property_views_${propertyId}`);
      if (storedViews) {
        const parsedViews = parseInt(storedViews, 10);
        if (!isNaN(parsedViews) && parsedViews > 0) {
          setDisplayViews(parsedViews);
        }
      }
    }
  }, [propertyId, views]);

  return (
    <div className='text-gray-500 dark:text-white text-sm'>
      Views: {displayViews}
    </div>
  );
};

export default PropertyViewsDisplay;
