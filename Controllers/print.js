const Book = require('../Models/booking');
const Vehicle = require('../Models/vehicles');
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

const getOrganizationName = org => {
  switch (org) {
    case 'สำนักงานเลขานุการศูนย์การแพทย์มหาวิทยาลัยแม่ฟ้าหลวง':
      return 'สำนักงานเลขานุการศูนย์การแพทย์ฯ';
    case 'ศูนย์บริการสุขภาพแบบครบวงจรแห่งภาคเหนือ และอนุภูมิภาคลุ่มแม่น้ำโขง':
      return 'ศูนย์บริการสุขภาพฯ';
    case 'โรงพยาบาลศูนย์การแพทย์มหาวิทยาลัยแม่ฟ้าหลวง':
      return 'โรงพยาบาลศูนย์การแพทย์ฯ';
    case 'โรงพยาบาลมหาวิทยาลัยแม่ฟ้าหลวง เชียงราย':
      return 'โรงพยาบาลมหาวิทยาลัยแม่ฟ้าหลวงฯ';
    default:
      return '-';
  }
};
let lastApproverInfo = null; // เก็บข้อมูลผู้อนุมัติล่าสุด
let lastAdminInfo = null; // เก็บข้อมูล Admin ล่าสุด
let lastDriverInfo = null; // เก็บข้อมูล Driver ล่าสุด

const getUserInfo = async (name, lastInfo) => {
  if (name) {
    const nameParts = name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''; // Handle multiple words as last name

    const user = await User.findOne({firstname: firstName, lastname: lastName});

    if (user) {
      return user; // ถ้าพบข้อมูลผู้ใช้งาน ก็ส่งคืนข้อมูลผู้ใช้งาน
    }
    return lastInfo; // ถ้าไม่พบข้อมูล ให้ส่งข้อมูลล่าสุดที่บันทึกไว้แทน
  }
  return lastInfo; // ถ้าไม่มีชื่อให้ค้นหา ก็ส่งคืนข้อมูลล่าสุดที่บันทึกไว้
};

exports.list = async (req, res) => {
  try {
    const id = req.params.id;
    const booking = await Book.findById(id);
    const vehicle = await Vehicle.findById(booking.vehicle_id);

    if (!booking) {
      return res.status(404).json({error: 'Booking not found'});
    }

    const userInfo = await User.findById(booking.user_id);
    const {approverName, adminName, driver} = booking;

    // ใช้ข้อมูลที่บันทึกไว้ล่าสุด หากค้นหาไม่เจอ
    const approverInfo = await getUserInfo(approverName, lastApproverInfo);
    const adminInfo = await getUserInfo(adminName, lastAdminInfo);
    const driverInfo = await getUserInfo(driver, lastDriverInfo);

    // เก็บข้อมูลล่าสุดที่ค้นพบไว้ในตัวแปร
    if (approverInfo) lastApproverInfo = approverInfo;
    if (adminInfo) lastAdminInfo = adminInfo;
    if (driverInfo) lastDriverInfo = driverInfo;

    // แสดงเบอร์โทร ถ้าไม่พบข้อมูลจะใช้ข้อมูลล่าสุดแทน
    const mobile_number_approver = approverInfo?.mobile_number || '-';
    const mobile_number_admin = adminInfo?.mobile_number || '-';
    const mobile_number_driver = driverInfo?.mobile_number || '-';

    const org_Approver = approverInfo
      ? getOrganizationName(approverInfo.organization)
      : '-';
    const org_Admin = adminInfo
      ? getOrganizationName(adminInfo.organization)
      : '-';
    const org_driver = driverInfo
      ? getOrganizationName(driverInfo.organization)
      : '-';

    const formatDate = date => formatDateThai(moment(date).tz('Asia/Bangkok'));

    const bookingDate = formatDate(booking.createdAt);
    const startDate = formatDate(booking.start);
    const endDate = formatDate(booking.end);
    const approvalTime = booking.approve_Time
      ? formatDate(booking.approve_Time)
      : '-';
    const carArrangeTime = booking.carArrange_Time
      ? formatDate(booking.carArrange_Time)
      : '-';

    res.render('print', {
      user: req.session.user,
      booking,
      bookingDate,
      startDate,
      endDate,
      approverInfo,
      adminInfo,
      driverInfo,
      vehicle,
      mobile_number_user: userInfo?.mobile_number || '-',
      mobile_number_approver,
      mobile_number_admin,
      mobile_number_driver,
      approvalTime,
      carArrangeTime,
      org_user: getOrganizationName(
        userInfo?.organization || booking.organization
      ),
      org_Approver,
      org_Admin,
      org_driver,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({error: `Error: ${e.message}`});
  }
};
