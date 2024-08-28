const Booking = require('../Models/booking');
exports.list = async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = 8;
  const skip = (page - 1) * limit;
  const searchQuery = req.query.search ? req.query.search.toLowerCase() : '';
  const selectedStatus = req.query.status || 'all';
  const selectedOrg = req.query.organization || 'all';

  const user = req.session.user;

  // ฟิลเตอร์สำหรับการค้นหาและสถานะ
  const filter = {
    $and: [
      {
        $or: [
          {title: {$regex: searchQuery, $options: 'i'}},
          {userinfo: {$regex: searchQuery, $options: 'i'}},
          {adminName: {$regex: searchQuery, $options: 'i'}},
          {vehicle: {$regex: searchQuery, $options: 'i'}},
          {driver: {$regex: searchQuery, $options: 'i'}},
        ],
      },
      selectedStatus !== 'all'
        ? {
            status:
              selectedStatus === 'comPlition'
                ? 4
                : selectedStatus === 'inProgress'
                  ? {$lte: 3}
                  : selectedStatus === 'cancel'
                    ? 5
                    : parseInt(selectedStatus),
          }
        : {status: {$lte: 5}},
      selectedOrg !== 'all'
        ? {
            $expr: {
              $eq: [
                {
                  $trim: {
                    input: {
                      $replaceAll: {
                        input: '$organization',
                        find: ' ',
                        replacement: '',
                      },
                    },
                  },
                },
                {$replaceAll: {input: selectedOrg, find: ' ', replacement: ''}},
              ],
            },
          }
        : {},
    ],
  };

  if (user.role === 'user') {
    filter['$or'] = [{user_id: user.id}, {'driver.id': user.id}];
  } else if (user.role === 'driver') {
    // ให้ driver เห็นการจองของตนเองทั้งหมด ไม่ว่าจะอยู่ในสถานะใด
    filter['$or'] = [
      {user_id: user.id},
      {'driver.id': user.id},
      {driver_id: user.id}, // เพิ่มเงื่อนไขเพื่อให้ driver เห็นการจองของตัวเอง
    ];
  } else if (user.role === 'approver') {
    // ให้ approver เห็นการจองเฉพาะใน organization ของตนเอง
    filter['organization'] = user.organization;
  }

  try {
    // การนับจำนวนตามสถานะต่างๆ
    const statusCounts = await Booking.aggregate([
      {
        $match: {
          $and: [
            {
              $or: [
                {title: {$regex: searchQuery, $options: 'i'}},
                {userinfo: {$regex: searchQuery, $options: 'i'}},
                {adminName: {$regex: searchQuery, $options: 'i'}},
                {vehicle: {$regex: searchQuery, $options: 'i'}},
                {driver: {$regex: searchQuery, $options: 'i'}},
              ],
            },
            {status: {$lte: 6}}, // Filter by status
            ...(user.role === 'user'
              ? [{user_id: user.id}]
              : user.role === 'driver'
                ? [{$or: [{user_id: user.id}, {driver_id: user.id}]}]
                : user.role === 'approver'
                  ? [{organization: user.organization}] // Filter by organization if approver
                  : []),
          ],
        },
      },
      {$group: {_id: '$status', count: {$sum: 1}}},
    ]);

    const statusCountMap = statusCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    // การดึงข้อมูลการจองตามฟิลเตอร์และการแบ่งหน้า
    const totalBookings = await Booking.countDocuments(filter);
    const totalPages = Math.ceil(totalBookings / limit);
    const sortOrder =
      user.role === 'admin'
        ? [
            {case: {$eq: ['$status', 2]}, then: 0},
            {case: {$eq: ['$status', 3]}, then: 1},
            {case: {$eq: ['$status', 1]}, then: 2},
            {case: {$eq: ['$status', 4]}, then: 3},
            {case: {$eq: ['$status', 5]}, then: 4},
          ]
        : [
            {case: {$eq: ['$status', 1]}, then: 0},
            {case: {$eq: ['$status', 2]}, then: 1},
            {case: {$eq: ['$status', 3]}, then: 2},
            {case: {$eq: ['$status', 4]}, then: 3},
            {case: {$eq: ['$status', 5]}, then: 4},
          ];
    const bookings = await Booking.aggregate([
      {$match: filter},
      {
        $addFields: {
          sortOrder: {
            $switch: {
              branches: sortOrder,
              default: 4,
            },
          },
        },
      },
      {$sort: {sortOrder: 1, createdAt: -1}},
      {$skip: skip},
      {$limit: limit},
    ]);

    // ส่งข้อมูลไปยังเทมเพลต
    res.render('manage', {
      userLoggedIn: !!user,
      user: user || null,
      bookings,
      totalPages,
      currentPage: page,
      searchQuery,
      selectedStatus,
      selectedOrg,
      statusCountMap, // ส่งจำนวนการจองตามสถานะไปยังเทมเพลต
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res
      .status(500)
      .json({error: 'Failed to load bookings. Please try again later.'});
  }
};
