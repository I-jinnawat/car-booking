const Vehicle = require('../Models/vehicles');
exports.list = async (req, res) => {
  const vehicles = await Vehicle.find().lean();
  try {
    req.session.user
      ? res.render('car', {
          userLoggedIn: true,
          user: req.session.user,
          vehicles,
        })
      : res.redirect('/');
  } catch (error) {
    console.log(error);
    res.status(500).render('error', {message: 'Internal Server Error'});
  }
};
exports.create = async (req, res) => {
  try {
    const {register, type, seat, available} = req.body;
    const event = await Vehicle.create({
      register,
      type,
      seat,
      available,
    });

    res.status(201).redirect('/setting/car');
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};
exports.update = async (req, res) => {
  const {id} = req.params;
  try {
    const {register, type, seat, available} = req.body;

    const event = await Vehicle.findByIdAndUpdate(id, {
      register,
      type,
      seat,
      available,
    });

    res.status(201).redirect('/setting/car');
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

exports.remove = async (req, res) => {
  const {id} = req.params;

  try {
    await Vehicle.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting Vehicle:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};
