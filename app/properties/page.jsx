import PropertySearchForm from "@/components/PropertySearchForm";
import Properties from "@/components/Properties";
import Property from "@/models/Property";
import connectDB from "@/config/database";

// NOTE: this is a server component so we can use the url search parameters here
// to query our database directly and then pass the properties to our Properties
// component. This then means the Properties component can be rendered server
// side and no longer needs to make a fetch request to an API route handler.

const PropertiesPage = async ({
  searchParams: { pageSize = 6, page = 1, sortBy = "" },
}) => {
  await connectDB();

  const skip = (page - 1) * pageSize;

  // Build sort options based on sortBy parameter
  let sortOptions = {};

  switch (sortBy) {
    case "price_asc":
      sortOptions = {
        "rates.monthly": 1,
        "rates.weekly": 1,
        "rates.nightly": 1,
      };
      break;
    case "price_desc":
      sortOptions = {
        "rates.monthly": -1,
        "rates.weekly": -1,
        "rates.nightly": -1,
      };
      break;
    case "beds_desc":
      sortOptions = { beds: -1 };
      break;
    case "baths_desc":
      sortOptions = { baths: -1 };
      break;
    default:
      sortOptions = { createdAt: -1 }; // Default sort by newest
  }

  const total = await Property.countDocuments({});

  // Handle special case for rating sort
  let properties;

  if (sortBy === "rating_desc") {
    // Use aggregation to get average ratings
    properties = await Property.aggregate([
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "property",
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: { $avg: "$reviews.rating" },
        },
      },
      {
        $sort: { averageRating: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: parseInt(pageSize),
      },
    ]);
  } else {
    // Normal sort
    properties = await Property.find({})
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(pageSize));
  }

  return (
    <>
      <section className='bg-blue-700 dark:bg-purple-800 py-6'>
        <div className='max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8'>
          <PropertySearchForm includeSort={true} />
        </div>
      </section>
      <Properties
        properties={properties}
        total={total}
        page={parseInt(page)}
        pageSize={parseInt(pageSize)}
        initialSortBy={sortBy}
      />
    </>
  );
};
export default PropertiesPage;
