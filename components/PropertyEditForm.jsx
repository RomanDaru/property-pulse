import updateProperty from "@/app/actions/updateproperty";

const PropertyEditForm = ({ property }) => {
  const updatePropertyById = updateProperty.bind(null, property._id);

  return (
    <form action={updatePropertyById}>
      <h2 className='text-3xl text-center font-semibold mb-6 dark:text-black dark:drop-shadow-md'>
        Edit Property
      </h2>

      <div className='mb-4'>
        <label htmlFor='type' className='block text-gray-700 font-bold mb-2'>
          Property Type
        </label>
        <select
          id='type'
          name='type'
          className='border rounded w-full py-2 px-3 dark:bg-white dark:text-black'
          defaultValue={property.type}
          required>
          <option value='Apartment'>Apartment</option>
          <option value='Condo'>Condo</option>
          <option value='House'>House</option>
          <option value='CabinOrCottage'>Cabin or Cottage</option>
          <option value='Room'>Room</option>
          <option value='Studio'>Studio</option>
          <option value='Other'>Other</option>
        </select>
      </div>
      <div className='mb-4'>
        <label className='block text-gray-700 font-bold mb-2'>
          Listing Name
        </label>
        <input
          type='text'
          id='name'
          name='name'
          className='border rounded w-full py-2 px-3 mb-2 dark:text-black'
          placeholder='eg. Beautiful Apartment In Miami'
          defaultValue={property.name}
          required
        />
      </div>
      <div className='mb-4'>
        <label
          htmlFor='description'
          className='block text-gray-700 font-bold mb-2'>
          Description
        </label>
        <textarea
          id='description'
          name='description'
          className='border rounded w-full py-2 px-3 dark:text-black'
          rows='4'
          defaultValue={property.description}
          placeholder='Add an optional description of your property'></textarea>
      </div>

      <div className='mb-4 bg-blue-50 dark:bg-purple-50 rounded p-4'>
        <label className='block text-gray-700 font-bold mb-2'>Location</label>
        <input
          type='text'
          id='street'
          name='location.street'
          className='border rounded w-full py-2 px-3 mb-2 dark:text-black'
          defaultValue={property.location.street}
          placeholder='Street'
        />
        <input
          type='text'
          id='city'
          name='location.city'
          className='border rounded w-full py-2 px-3 mb-2 dark:text-black'
          placeholder='City'
          defaultValue={property.location.city}
          required
        />
        <input
          type='text'
          id='state'
          name='location.state'
          className='border rounded w-full py-2 px-3 mb-2 dark:text-black'
          placeholder='State'
          defaultValue={property.location.state}
          required
        />
        <input
          type='text'
          id='zipcode'
          name='location.zipcode'
          className='border rounded w-full py-2 px-3 mb-2 dark:text-black'
          defaultValue={property.location.zipcode}
          placeholder='Zipcode'
        />
      </div>

      <div className='mb-4 flex flex-wrap'>
        <div className='w-full sm:w-1/3 pr-2'>
          <label htmlFor='beds' className='block text-gray-700 font-bold mb-2'>
            Beds
          </label>
          <input
            type='number'
            id='beds'
            name='beds'
            className='border rounded w-full py-2 px-3 dark:text-black'
            defaultValue={property.beds}
            required
          />
        </div>
        <div className='w-full sm:w-1/3 px-2'>
          <label htmlFor='baths' className='block text-gray-700 font-bold mb-2'>
            Baths
          </label>
          <input
            type='number'
            id='baths'
            name='baths'
            className='border rounded w-full py-2 px-3 dark:text-black'
            defaultValue={property.baths}
            required
          />
        </div>
        <div className='w-full sm:w-1/3 pl-2'>
          <label
            htmlFor='square_feet'
            className='block text-gray-700 font-bold mb-2'>
            Square Feet
          </label>
          <input
            type='number'
            id='square_feet'
            name='square_feet'
            className='border rounded w-full py-2 px-3 dark:text-black'
            defaultValue={property.square_feet}
            required
          />
        </div>
      </div>

      <div className='mb-4'>
        <label className='block text-gray-700 font-bold mb-2'>Amenities</label>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
          <div>
            <input
              type='checkbox'
              id='amenity_wifi'
              name='amenities'
              value='Wifi'
              className='mr-2 dark:accent-purple-700'
              defaultChecked={property.amenities.includes("Wifi")}
            />
            <label htmlFor='amenity_wifi' className='dark:text-black'>
              Wifi
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_kitchen'
              name='amenities'
              value='Full kitchen'
              className='mr-2 dark:accent-purple-700'
              defaultChecked={property.amenities.includes("Full kitchen")}
            />
            <label htmlFor='amenity_kitchen' className='dark:text-black'>
              Full kitchen
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_washer_dryer'
              name='amenities'
              value='Washer & Dryer'
              className='mr-2 dark:accent-purple-700'
              defaultChecked={property.amenities.includes("Washer & Dryer")}
            />
            <label htmlFor='amenity_washer_dryer' className='dark:text-black'>
              Washer & Dryer
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_free_parking'
              name='amenities'
              value='Free Parking'
              className='mr-2 dark:accent-purple-700'
              defaultChecked={property.amenities.includes("Free Parking")}
            />
            <label htmlFor='amenity_free_parking' className='dark:text-black'>
              Free Parking
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_pool'
              name='amenities'
              value='Swimming Pool'
              className='mr-2 dark:accent-purple-700'
              defaultChecked={property.amenities.includes("Swimming Pool")}
            />
            <label htmlFor='amenity_pool' className='dark:text-black'>
              Swimming Pool
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_hot_tub'
              name='amenities'
              value='Hot Tub'
              className='mr-2 dark:accent-purple-700'
              defaultChecked={property.amenities.includes("Hot Tub")}
            />
            <label htmlFor='amenity_hot_tub' className='dark:text-black'>
              Hot Tub
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_24_7_security'
              name='amenities'
              value='24/7 Security'
              className='mr-2 dark:accent-purple-700'
              defaultChecked={property.amenities.includes("24/7 Security")}
            />
            <label htmlFor='amenity_24_7_security' className='dark:text-black'>
              24/7 Security
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_wheelchair_accessible'
              name='amenities'
              value='Wheelchair Accessible'
              className='mr-2 dark:accent-purple-700'
              defaultChecked={property.amenities.includes(
                "Wheelchair Accessible"
              )}
            />
            <label
              htmlFor='amenity_wheelchair_accessible'
              className='dark:text-black'>
              Wheelchair Access
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_elevator_access'
              name='amenities'
              value='Elevator Access'
              className='mr-2 dark:accent-purple-700'
              defaultChecked={property.amenities.includes("Elevator Access")}
            />
            <label
              htmlFor='amenity_elevator_access'
              className='dark:text-black'>
              Elevator Access
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_dishwasher'
              name='amenities'
              value='Dishwasher'
              className='mr-2 dark:accent-purple-700'
              defaultChecked={property.amenities.includes("Dishwasher")}
            />
            <label htmlFor='amenity_dishwasher' className='dark:text-black'>
              Dishwasher
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_gym_fitness_center'
              name='amenities'
              value='Gym/Fitness Center'
              className='mr-2 dark:accent-purple-700'
              defaultChecked={property.amenities.includes("Gym/Fitness Center")}
            />
            <label
              htmlFor='amenity_gym_fitness_center'
              className='dark:text-black'>
              Gym/Fitness Center
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_air_conditioning'
              name='amenities'
              value='Air Conditioning'
              className='mr-2 dark:accent-purple-700'
              defaultChecked={property.amenities.includes("Air Conditioning")}
            />
            <label
              htmlFor='amenity_air_conditioning'
              className='dark:text-black'>
              Air Conditioning
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_balcony_patio'
              name='amenities'
              value='Balcony/Patio'
              className='mr-2 dark:accent-purple-700'
              defaultChecked={property.amenities.includes("Balcony/Patio")}
            />
            <label htmlFor='amenity_balcony_patio' className='dark:text-black'>
              Balcony/Patio
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_smart_tv'
              name='amenities'
              value='Smart TV'
              className='mr-2 dark:accent-purple-700'
              defaultChecked={property.amenities.includes("Smart TV")}
            />
            <label htmlFor='amenity_smart_tv' className='dark:text-black'>
              Smart TV
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_coffee_maker'
              name='amenities'
              value='Coffee Maker'
              className='mr-2 dark:accent-purple-700'
              defaultChecked={property.amenities.includes("Coffee Maker")}
            />
            <label htmlFor='amenity_coffee_maker' className='dark:text-black'>
              Coffee Maker
            </label>
          </div>
        </div>
      </div>

      <div className='mb-4 bg-blue-50 dark:bg-purple-50 rounded p-4'>
        <label className='block text-gray-700 font-bold mb-2'>
          Rates (Leave blank if not applicable)
        </label>
        <div className='flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4'>
          <div className='flex items-center'>
            <label htmlFor='weekly_rate' className='mr-2 dark:text-black'>
              Weekly
            </label>
            <input
              type='number'
              id='weekly_rate'
              name='rates.weekly'
              className='border rounded w-full py-2 px-3 dark:text-black'
              defaultValue={property.rates.weekly}
            />
          </div>
          <div className='flex items-center'>
            <label htmlFor='monthly_rate' className='mr-2 dark:text-black'>
              Monthly
            </label>
            <input
              type='number'
              id='monthly_rate'
              name='rates.monthly'
              className='border rounded w-full py-2 px-3 dark:text-black'
              defaultValue={property.rates.monthly}
            />
          </div>
          <div className='flex items-center'>
            <label htmlFor='nightly_rate' className='mr-2 dark:text-black'>
              Nightly
            </label>
            <input
              type='number'
              id='nightly_rate'
              name='rates.nightly'
              className='border rounded w-full py-2 px-3 dark:text-black'
              defaultValue={property.rates.nightly}
            />
          </div>
        </div>
      </div>

      <div className='mb-4'>
        <label
          htmlFor='seller_name'
          className='block text-gray-700 font-bold mb-2'>
          Seller Name
        </label>
        <input
          type='text'
          id='seller_name'
          name='seller_info.name'
          className='border rounded w-full py-2 px-3 dark:text-black'
          placeholder='Name'
          defaultValue={property.seller_info.name}
        />
      </div>
      <div className='mb-4'>
        <label
          htmlFor='seller_email'
          className='block text-gray-700 font-bold mb-2'>
          Seller Email
        </label>
        <input
          type='email'
          id='seller_email'
          name='seller_info.email'
          className='border rounded w-full py-2 px-3 dark:text-black'
          placeholder='Email address'
          required
          defaultValue={property.seller_info.email}
        />
      </div>
      <div className='mb-4'>
        <label
          htmlFor='seller_phone'
          className='block text-gray-700 font-bold mb-2'>
          Seller Phone
        </label>
        <input
          type='tel'
          id='seller_phone'
          name='seller_info.phone'
          className='border rounded w-full py-2 px-3 dark:text-black'
          placeholder='Phone'
          defaultValue={property.seller_info.phone}
        />
      </div>

      <div>
        <button
          className='mt-4 bg-blue-500 hover:bg-blue-600 dark:bg-purple-700 dark:hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline'
          type='submit'>
          Update Property
        </button>
      </div>
    </form>
  );
};

export default PropertyEditForm;
