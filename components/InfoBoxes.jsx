import React from "react";
import InfoBox from "@/components/InfoBox";

const InfoBoxes = () => {
  return (
    <section>
      <div className="container-xl lg:container m-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
          <InfoBox
            heading="For Renters"
            infoBoxText="Find your dream rental property. Bookmark properties and contact owners."
            infoButtonText="Browse Properties"
            buttonColor="bg-black"
          />
          <InfoBox
            heading="For Property Owners"
            infoBoxText="List your properties and reach potential tenants. Rent as an
            airbnb or long term."
            infoButtonText="Add Property"
            buttonColor="bg-blue-700"
            backgroundColor="bg-blue-100"
          />
        </div>
      </div>
    </section>
  );
};

export default InfoBoxes;
