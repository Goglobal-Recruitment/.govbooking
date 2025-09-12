const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Allow CORS (adjust origin as needed)
app.use(cors());

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/', // folder to save files temporarily
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

// Dummy booking number validation function
function isValidBookingNumber(bookingNumber) {
  // Replace this with real validation logic or DB check
  return bookingNumber && bookingNumber.startsWith('BOOK');
}

// POST endpoint to handle visa application form + file uploads
app.post('/api/submit-visa-application', upload.any(), (req, res) => {
  const fields = req.body;
  const files = req.files;

  console.log('Received fields:', fields);
  console.log('Received files:', files);

  // Validate booking number (example)
  if (!isValidBookingNumber(fields.booking_number)) {
    // Delete uploaded files on failure
    files.forEach(file => fs.unlinkSync(file.path));
    return res.json({ success: false, error: 'Invalid booking number' });
  }

  // TODO: Further validation here (file types, required fields, etc.)

  // Optionally rename/move files or keep as is
  // For now, we keep files in 'uploads' folder

  // Respond success
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Visa backend server running on http://localhost:${port}`);
});
