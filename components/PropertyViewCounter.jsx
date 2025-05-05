"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const PropertyViewCounter = ({ propertyId }) => {
  const router = useRouter();

  useEffect(() => {
    // Only run on the client side
    if (typeof window === "undefined") return;

    const incrementView = async () => {
      try {
        // Create a unique key for this property in this session
        const viewKey = `property_viewed_${propertyId}`;

        // Check if we've already viewed this property in this session
        if (sessionStorage.getItem(viewKey)) {
          return;
        }

        // Mark as viewed before making the request to prevent multiple attempts
        sessionStorage.setItem(viewKey, "true");

        const res = await fetch(
          `/api/properties/${propertyId}/increment-views`,
          {
            method: "POST",
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
          }
        );

        if (res.ok) {
          const data = await res.json();

          // Store the updated view count in localStorage so it can be displayed
          const viewCount = data.viewCount > 0 ? data.viewCount : 1;
          localStorage.setItem(
            `property_views_${propertyId}`,
            viewCount.toString()
          );

          // Refresh the page to show the updated view count
          router.refresh();
        } else {
          // If the request failed, remove the viewed flag so it can be tried again
          sessionStorage.removeItem(viewKey);
        }
      } catch (error) {
        console.error("Error incrementing view count:", error);
      }
    };

    incrementView();
  }, [propertyId, router]);

  // This component doesn't render anything
  return null;
};

export default PropertyViewCounter;
