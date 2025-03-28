export const buildDoctorAggregationPipeline = (
  filter: Record<string, any>,
  options: { sort?: Record<string, 1 | -1>; limit?: number; page?: number },
  searchQuery?: string,
  showAll?: boolean,
  useFuzzy = true // 👈 Allow switching between autocomplete and fuzzy
) => {
  const pipeline: any[] = [];

  if (searchQuery) {
    pipeline.push({
      $search: useFuzzy
        ? {
            index: "fuzzy", // Fuzzy Index
            text: {
              query: searchQuery,
              path: [
                "name",
                "languages",
                "doctorInfo.specialities",
                "doctorInfo.certifications",
              ],
              fuzzy: {
                maxEdits: 2,
                prefixLength: 1,
              },
            },
          }
        : {
            index: "default", // Autocomplete Index
            compound: {
              should: [
                {
                  autocomplete: {
                    query: searchQuery,
                    path: "name",
                  },
                },
                {
                  autocomplete: {
                    query: searchQuery,
                    path: "languages",
                  },
                },
                {
                  autocomplete: {
                    query: searchQuery,
                    path: "doctorInfo.specialities",
                  },
                },
                {
                  autocomplete: {
                    query: searchQuery,
                    path: "doctorInfo.certifications",
                  },
                },
              ],
              minimumShouldMatch: 1,
            },
          },
    });
  }

  // Apply filter
  pipeline.push({ $match: filter });

  // Lookup availabilities
  pipeline.push(
    {
      $lookup: {
        from: "availabilities",
        localField: "_id",
        foreignField: "doctorId",
        as: "availability",
      },
    },
    {
      $unwind: {
        path: "$availability",
        preserveNullAndEmptyArrays: true,
      },
    }
  );

  // Availability filter
  if (!showAll) {
    pipeline.push({
      $match: {
        $or: [
          { "availability.date": { $gte: new Date() } },
          { "availability.timeSlots": { $exists: true, $ne: [] } },
        ],
      },
    });
  }

  // Grouping
  pipeline.push({
    $group: {
      _id: "$_id",
      name: { $first: "$name" },
      thumbnail: { $first: "$thumbnail" },
      doctorInfo: { $first: "$doctorInfo" },
      availability: { $push: "$availability" },
    },
  });

  // Projection
  pipeline.push({
    $project: {
      name: 1,
      thumbnail: 1,
      doctorInfo: 1,
      availability: 1,
    },
  });

  // Sorting
  if (options.sort) {
    pipeline.push({ $sort: options.sort });
  }

  return pipeline;
};
