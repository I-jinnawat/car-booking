const path = require('path');
const PDFDocument = require('pdfkit');
const fs = require('fs');
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

    const user = await User.findById(booking.user_id);
    const {approverName, adminName, driver} = booking;
    const Title = 'แบบฟอร์มการข้อใช้รถ';
    const MCH = 'ศูนย์การแพทย์มหาลัยแม่ฟ้าหลวง โทร';
    const MCH_Tel = '053-914-023';
    const Email = 'medical-center@mfu.ac.th';

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

    const doc = new PDFDocument();
    const FontThai = path.join(
      __dirname,
      '../public/font/Kanit/Kanit-Regular.ttf'
    );
    const FontThaiBold = path.join(
      __dirname,
      '../public/font/Kanit/Kanit-ExtraBold.ttf'
    );
    const FontThaiSemiBold = path.join(
      __dirname,
      '../public/font/Kanit/Kanit-SemiBold.ttf'
    );
    const imagePath = path.join(
      __dirname,
      '../public/image/Mae-Fah-Luang-University-2.png'
    );
    const pageWidth = doc.page.width;

    // Set up response headers
    res.setHeader('Content-Type', 'application/pdf');

    doc.pipe(res);

    // Set document metadata

    // Adjust image size here
    const imageWidth = 60;
    const imageHeight = 60;
    const imageX = (pageWidth - imageWidth) / 2;
    const imageY = 10;
    const lineWidth = pageWidth - 50;
    const opacity = 0.2;

    const mobile_number_user = user.mobile_number || '-';
    const mobile_number_approver = approverInfo?.mobile_number || '-';
    const mobile_number_admin = adminInfo?.mobile_number || '-';
    const mobile_number_driver = driverInfo?.mobile_number || '-';

    const formatDate = date => formatDateThai(moment(date).tz('Asia/Bangkok'));

    const bookingDate = formatDate(booking.createdAt);
    const startDate = formatDate(booking.start);
    const endDate = formatDate(booking.end);

    doc.image(imagePath, imageX, imageY, {
      width: imageWidth,
      height: imageHeight,
    });
    doc.fontSize(12).font(FontThai);
    doc.moveDown(0.1).text(Title, {align: 'center'});
    doc.text(`${MCH} ${MCH_Tel}`, {align: 'center'});
    doc.text(`Email: ${Email}`, {align: 'center'});

    doc.strokeOpacity(opacity);
    doc.moveDown(0.2).moveTo(50, doc.y).lineTo(lineWidth, doc.y).stroke();
    doc.moveDown(0.2);

    const addBookingDetail = (label, value) => {
      doc
        .fontSize(12)
        .font(FontThaiBold)
        .text(`${label} : `, {continued: true})
        .font(FontThai)
        .text(value);
    };

    addBookingDetail('รหัสการจอง', booking.bookingID);
    addBookingDetail('วันที่จองรถ', bookingDate);

    doc.moveDown(0.2).moveTo(50, doc.y).lineTo(lineWidth, doc.y).stroke();

    doc
      .moveDown(0.2)
      .font(FontThaiSemiBold)
      .fontSize(13)
      .text('การขอจองรถ', {align: 'center'})
      .fontSize(12);

    const addSectionDetail = (label, value) => {
      doc
        .moveDown(0.1)
        .font(FontThaiSemiBold)
        .text(label, {continued: true})
        .text('   ', {continued: true})
        .font(FontThai)
        .text(value, {align: 'right'});
    };

    addSectionDetail('ผู้ร้องขอ', booking.userinfo);
    addSectionDetail('เบอร์ติดต่อ', mobile_number_user);
    addSectionDetail('หน่วยงาน', user.organization);
    addSectionDetail('ขอใช้รถเพื่อปฏิบัติภารกิจ', booking.title);
    addSectionDetail('เวลารับ - เวลากลับ', `${startDate} - ${endDate}`);
    addSectionDetail(
      'สถานที่รับ - สถานที่ส่ง',
      `${booking.placestart} - ${booking.placeend}`
    );
    addSectionDetail('จำนวนผู้เดินทาง', `${booking.passengerCount} คน`);

    const passengersString = booking.passengers
      .map((passenger, index) => `${index + 1}. ${passenger}`)
      .join(', ');
    addSectionDetail('ประกอบด้วย', passengersString);

    doc.moveDown(0.2).moveTo(50, doc.y).lineTo(lineWidth, doc.y).stroke();

    doc
      .moveDown(0.2)
      .font(FontThaiSemiBold)
      .fontSize(13)
      .text('การอนุมัติ', {align: 'center'})
      .fontSize(12);

    addSectionDetail('ผู้อนุมัติ', approverName);
    addSectionDetail('เบอร์ติดต่อ', mobile_number_approver);
    addSectionDetail('หน่วยงาน', approverInfo.organization);

    doc.moveDown(0.2).moveTo(50, doc.y).lineTo(lineWidth, doc.y).stroke();

    doc
      .moveDown(0.2)
      .font(FontThaiSemiBold)
      .fontSize(13)
      .text('การจัดเตรียมรถ', {align: 'center'})
      .fontSize(12);

    addSectionDetail('ผู้จัดรถ', adminName);
    addSectionDetail('เบอร์ติดต่อ', mobile_number_admin);
    addSectionDetail('หน่วยงาน', adminInfo.organization);
    addSectionDetail('รถที่ใช้', `เลขทะเบียน ${booking.vehicle}`);

    doc.moveDown(0.2).moveTo(50, doc.y).lineTo(lineWidth, doc.y).stroke();

    doc
      .moveDown(0.2)
      .font(FontThaiSemiBold)
      .fontSize(13)
      .text('มอบหมายคนขับรถ', {align: 'center'})
      .fontSize(12);

    addSectionDetail('พนักงานขับรถ', driver);
    addSectionDetail('เบอร์ติดต่อ', mobile_number_driver);
    addSectionDetail('หน่วยงาน', driverInfo.organization);

    doc.moveDown(0.2).moveTo(50, doc.y).lineTo(lineWidth, doc.y).stroke();

    doc
      .moveDown(0.2)
      .font(FontThaiSemiBold)
      .fontSize(13)
      .text('ระยะเดินทางรวม', {continued: true})
      .font(FontThai)
      .fontSize(12)
      .text(`${booking.total_kilometer} กิโลเมตร`, {align: 'right'});

    doc.end();
    console.log('Created successfully');
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};
