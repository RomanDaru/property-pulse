import React from 'react';
import InfoBox from '@/components/InfoBox';

const InfoBoxes = () => {
  return (
    <section>
      <div className='container-xl lg:container m-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg'>
          <InfoBox
            heading='For Renters'
            buttonInfo={{
              text: 'Browse Properties',
              backgroundColor: 'bg-black',
              link: '/properties',
            }}>
            <p>
              Find your dream rental property. Bookmark properties and contact
              owners.
            </p>
          </InfoBox>
          <InfoBox
            heading='For Property Owners'
            backgroundColor='bg-blue-100'
            buttonInfo={{
              text: 'Add Property',
              backgroundColor: 'bg-blue-700',
              link: '/properties/add',
            }}>
            <p>
              List your properties and reach potential tenants. Rent as an
              airbnb or long term.
            </p>
          </InfoBox>
        </div>
      </div>
    </section>
  );
};

export default InfoBoxes;
