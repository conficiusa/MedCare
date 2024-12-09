export const buildDoctorAggregationPipeline = (
  filter: Record<string, any>,
  options: { sort?: Record<string, 1 | -1>; limit?: number; page?: number }
) => {
  const pipeline: any[] = [
    { $match: filter }, // Apply the initial filter
    {
      $lookup: {
        from: "availabilities", // Collection name for availabilities
        localField: "_id",
        foreignField: "doctorId",
        as: "availability",
      },
    },
    { $unwind: "$availability" }, // Unwind the availability array
    {
      $match: {
        "availability.date": { $gte: new Date() }, // Only future dates
        "availability.timeSlots": { $exists: true, $ne: [] }, // Non-empty time slots
      },
    },
    {
      $group: {
        _id: "$_id", // Regroup by doctor ID
        name: { $first: "$name" },
        image: { $first: "$image" },
        doctorInfo: { $first: "$doctorInfo" },
        availability: { $push: "$availability" },
      },
    },
    {
      $project: {
        name: 1,
        image: 1,
        doctorInfo: 1,
        availability: 1, // Include grouped availability if needed
      },
    },
  ];

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
