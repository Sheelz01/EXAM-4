const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer');
const {
  uploadSingle,
  uploadArray,
  uploadMultipleFields
} = require('../controllers/fileController');

router.post('/single', upload.single('file'), uploadSingle);
router.post('/array', upload.array('files', 5), uploadArray);
router.post('/multi-fields',
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'documents', maxCount: 3 }
  ]),
  uploadMultipleFields
);

module.exports = router;
