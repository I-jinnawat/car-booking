const path = require('path'); // Import the path module
const PDFDocument = require('pdfkit');
const fs = require('fs');
const Book = require('../Models/booking');

exports.list = async (req, res) => {
  try {
    const id = req.params.id;
    const booking = await Book.findById(id);
    const doc = new PDFDocument();
    const imagePath = path.join(
      __dirname,
      '../public/image/Mae-Fah-Luang-University-2.png'
    );

    doc.moveDown().image(imagePath, {
      width: 100,
      align: 'center',
    });
    doc
      .save()
      .moveTo(100, 150)
      .lineTo(100, 250)
      .lineTo(200, 250)
      .fill('#FF3300');

    doc.circle(280, 200, 50).fill('#6600FF');

    // an SVG path
    doc
      .scale(0.6)
      .translate(470, 130)
      .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
      .fill('red', 'even-odd')
      .restore();

    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);
    doc.end();
    res.on('finish', () => {
      console.log('PDF generation completed');
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};
