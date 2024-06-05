// middleware/loadManuals.js
const Manual = require('../Models/manual'); // Adjust the path to your Manual model

const loadManuals = async (req, res, next) => {
  try {
    const manuals = await Manual.find().lean();
    res.locals.manuals = manuals;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};

module.exports = loadManuals;
