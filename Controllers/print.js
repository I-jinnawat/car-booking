const Book = require('../Models/booking');
const User = require('../Models/Auth');
const moment = require('moment-timezone');

const formatDateThai = date => {
  const monthsThai = [
    'ม.ค.',
    'ก.พ.',
    'มี.ค.',
    'เม.ย.',
    'พ.ค.',
    'มิ.ย.',
    'ก.ค.',
    'ส.ค.',
    'ก.ย.',
    'ต.ค.',
    'พ.ย.',
    'ธ.ค.',
  ];
  const yearBuddhist = date.year() + 543;
  return `${date.date().toString().padStart(2, '0')} ${
    monthsThai[date.month()]
  } ${yearBuddhist} เวลา ${date.format('HH:mm:ss')}`;
};

exports.list = async (req, res) => {
  try {
    const id = req.params.id;
    const booking = await Book.findById(id);
    if (!booking) {
      return res.status(404).json({error: 'Booking not found'});
    }
    const userInfo = await User.findById(booking.user_id);
    const {approverName, adminName, driver} = booking;

    const getUserInfo = async name => {
      if (name) {
        const firstName = name.split(' ')[0];
        return await User.findOne({firstname: firstName});
      }
      return {};
    };

    const approverInfo = await getUserInfo(approverName);
    const adminInfo = await getUserInfo(adminName);
    const driverInfo = await getUserInfo(driver);

    const mobile_number_user = userInfo?.mobile_number || '-';
    const mobile_number_approver = approverInfo?.mobile_number || '-';
    const mobile_number_admin = adminInfo?.mobile_number || '-';
    const mobile_number_driver = driverInfo?.mobile_number || '-';

    const getOrganizationName = org => {
      switch (org) {
        case 'สำนักงานเลขานุการศูนย์การแพทย์มหาวิทยาลัยแม่ฟ้าหลวง':
          return 'สำนักงานเลขานุการศูนย์การแพทย์ฯ';
        case 'ศูนย์บริการสุขภาพแบบครบวงจรแห่งภาคเหนือ และอนุภูมิภาคลุ่มแม่น้ำโขง':
          return 'ศูนย์บริการสุขภาพฯ';
        case 'โรงพยาบาลศูนย์การแพทย์มหาวิทยาลัยแม่ฟ้าหลวง':
          return 'โรงพยาบาลมหาวิทยาลัยแม่ฟ้าหลวงฯ';
        case 'โรงพยาบาลมหาวิทยาลัยแม่ฟ้าหลวง เชียงราย':
          return 'โรงพยาบาลศูนย์การแพทย์ฯ';
        default:
          return '-';
      }
    };

    const org_user = getOrganizationName(userInfo?.organization);
    const org_Approver = getOrganizationName(approverInfo?.organization);
    const org_Admin = getOrganizationName(adminInfo?.organization);
    const org_driver = getOrganizationName(driverInfo?.organization);

    const formatDate = date => formatDateThai(moment(date).tz('Asia/Bangkok'));
    const start = new Date(
      new Date(booking.start).getTime() - 7 * 60 * 60 * 1000
    );
    const end = new Date(new Date(booking.end).getTime() - 7 * 60 * 60 * 1000);

    const bookingDate = formatDate(booking.createdAt);
    const startDate = formatDate(start);
    const endDate = formatDate(end);
    const approvalTime = booking.approve_Time
      ? formatDate(booking.approve_Time)
      : '-';
    const carArrangeTime = booking.carArrange_Time
      ? formatDate(booking.carArrange_Time)
      : '-';

    res.render('print', {
      booking,
      bookingDate,
      startDate,
      endDate,
      approverInfo,
      adminInfo,
      driverInfo,
      mobile_number_user: booking.mobile_number,
      mobile_number_approver,
      mobile_number_admin,
      mobile_number_driver,
      approvalTime,
      carArrangeTime,
      org_user,
      org_Approver,
      org_Admin,
      org_driver,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({error: `Error: ${e.message}`});
  }
};
