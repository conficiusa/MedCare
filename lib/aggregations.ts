export const buildDoctorAggregationPipeline = (
  filter: Record<string, any>,
  options: { sort?: Record<string, 1 | -1>; limit?: number; page?: number },
  searchQuery?: string,
  showAll?: boolean // Add showAll parameter
) => {
  const pipeline: any[] = [];

  // Add $search stage if searchQuery exists
  if (searchQuery) {
    pipeline.push({
      $search: {
        index: "default", // Replace with your search index name
        text: {
          query: searchQuery,
          path: [
            "doctorInfo.specialities",
            "doctorInfo.certifications",
            "name",
            "city",
            "languages",
          ], // Searches all fields, or specify fields like ['name', 'specialty']
        },
      },
    });
  }

  // Always apply the basic filter
  pipeline.push({ $match: filter });

  // Lookup and unwind availabilities
  pipeline.push(
    {
      $lookup: {
        from: "availabilities", // Collection name for availabilities
        localField: "_id",
        foreignField: "doctorId",
        as: "availability",
      },
    },
    { $unwind: { path: "$availability", preserveNullAndEmptyArrays: true } } // Preserve doctors without availabilities
  );

  // Conditionally filter doctors based on availability if showAll is false
  if (!showAll) {
    pipeline.push({
      $match: {
        $or: [
          { "availability.date": { $gte: new Date() } }, // Future dates
          { "availability.timeSlots": { $exists: true, $ne: [] } }, // Non-empty time slots
        ],
      },
    });
  }

  // Group the results
  pipeline.push({
    $group: {
      _id: "$_id",
      name: { $first: "$name" },
      thumbnail: { $first: "$thumbnail" },
      doctorInfo: { $first: "$doctorInfo" },
      availability: { $push: "$availability" },
    },
  });

  // Project the desired fields
  pipeline.push({
    $project: {
      name: 1,
      thumbnail: 1,
      doctorInfo: 1,
      availability: 1,
    },
  });

  // Apply sorting if provided
  if (options.sort) {
    pipeline.push({ $sort: options.sort });
  }

  // Apply pagination if limit and page are provided
  if (options.limit) {
    const skip = options.page ? (options.page - 1) * options.limit : 0;
    pipeline.push({ $skip: skip }, { $limit: options.limit });
  }

  return pipeline;
};
