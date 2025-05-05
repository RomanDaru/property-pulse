import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import connectDB from "@/config/database";
import Property from "@/models/Property";

const HomeProperties = async () => {
  // NOTE: Here we can query the DB directly if we use a server
  // component, so no need to make a request to a API route.
  // Making a fetch request from a server component to a API route is an
  // unnecessary additional step and you also need a full URL, i.e.
  // localhost:3000 in dev or the site URL in production.

  await connectDB();

  // Get the 3 latest properties
  const recentProperties = await Property.find({})
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  return (
    <>
      <section className='px-4 py-6 dark:bg-black'>
        <div className='container-xl lg:container m-auto'>
          <h2 className='text-3xl font-bold dark:text-white mb-6 text-center'>
            Recent Properties
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {recentProperties.length === 0 ? (
              <p>No Properties Found</p>
            ) : (
              recentProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))
            )}
          </div>
        </div>
      </section>

      <section className='m-auto max-w-lg px-6 pb-6 dark:bg-black'>
        <Link
          href='/properties'
          className='block bg-blue-500 text-white dark:bg-purple-800 dark:hover:bg-purple-700 text-center py-4 px-6 rounded-xl hover:bg-blue-600'>
          View All Properties
        </Link>
      </section>
    </>
  );
};
export default HomeProperties;
