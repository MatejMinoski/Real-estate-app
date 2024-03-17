import listing from "../model/listingModel.js"

export const createListing = async (req, res, next) => {
  try {
   
    const newListing = await listing.create(req.body);

    return res.status(201).json(newListing);
  } catch (error) {
    
    next(error);
  }
};
