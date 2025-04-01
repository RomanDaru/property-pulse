import { getSessionUser } from "@/utils/getSessionUser";
import connectDB from "@/config/database";
import User from "@/models/User";
import Property from "@/models/Property";
import Link from "next/link";
import Image from "next/image";

async function SavedBookmarks({ propertyId }) {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    return (
      <section className='bg-blue-50'>
        <div className='container m-auto max-w-2xl py-24'>
          <div className='bg-white px-6 py-8 mb-4 shadow-md rounded md border m-4 md:m-0'>
            Please login to view your bookmarks.
          </div>
        </div>
      </section>
    );
  }

  const { userId } = sessionUser;

  // Find user with populated bookmarks
  const user = await User.findById(userId).populate("bookmarks");

  const isCurrentPropertyBookmarked = propertyId
    ? user.bookmarks.some((bookmark) => bookmark._id.toString() === propertyId)
    : false;

  return (
    <section className='bg-blue-50'>
      <div className='container m-auto max-w-2xl py-24'>
        <div className='bg-white px-6 py-8 mb-4 shadow-md rounded md border m-4 md:m-0'>
          <h1 className='text-2xl text-center font-bold mb-6'>
            Saved Bookmarks
          </h1>

          {propertyId && (
            <div className='mb-4'>
              {isCurrentPropertyBookmarked
                ? "This property is in your bookmarks"
                : "This property is not bookmarked"}
            </div>
          )}

          {user.bookmarks.length === 0 ? (
            <p>You have no saved bookmarks yet.</p>
          ) : (
            <div className='space-y-4'>
              <h2 className='text-xl font-semibold'>
                Your Bookmarked Properties ({user.bookmarks.length})
              </h2>
              {user.bookmarks.map((property) => (
                <div
                  key={property._id}
                  className='mb-10 border px-4 py-6 rounded-md shadow-md'>
                  <Link href={`/properties/${property._id}`}>
                    <Image
                      className='h-32 w-full rounded-md shadow-md object-cover'
                      src={property.images[0]}
                      alt='Property 1'
                      width={1000}
                      height={200}
                    />
                  </Link>
                  <div className='mt-2'>
                    <p className='text-lg font-semibold'>{property.name}</p>
                    <p className='text-gray-600'>
                      Address: {property.location.street}{" "}
                      {property.location.city} {property.location.state}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default SavedBookmarks;
