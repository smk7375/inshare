const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4: uuidv4 } = require('uuid');


// storing the files in folder --> uploads
let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName)
  },
});

let upload = multer({ storage, limits: { fileSize: 1000000 * 100 }, }).single('myfile'); //100mb

router.post('/', (req, res) => {
  upload(req, res, async (err) => {

    // if (!req.file) {
    //   return res.json({ error: 'all fields are required' })
    // }

    if (err) {
      return res.status(500).send({ error: err.message });
    }

    // storing in database
    const file = new File({
      filename: req.file.filename,
      uuid: uuidv4(),
      path: req.file.path,
      size: req.file.size
    });
    const response = await file.save();
    // download page ki link hai
    res.json({ file: `${process.env.APP_BASE_URL}/file/${response.uuid}` });
    //http://localhost:3000/files/sdchsihfwehkcb ---> download link 
  });
});


router.post('/send', async (req, res) => {
  const { uuid, emailTo, emailFrom, expiresIn } = req.body;

  //validate request
  if (!uuid || !emailTo || !emailFrom) {
    return res.status(422).send({ error: 'All fields are required except expiry.' });
  }

  // get data from database

  const file = await File.findOne({ uuid: uuid });
  if (file.sender) {
    return res.status(422).send({ error: 'Email already sent' });
  }

  file.sender = emailFrom;
  file.receiver = emailTo;

  const response = await file.save();

  //send mail

  const sendmail = require('../services/emailService');

  sendmail({
    from: emailFrom,
    to: emailTo,
    subject: 'inshare file sharing',
    text: '${emailFrom} shared a file with you',
    html: require('../services/emailTemplate')({
      emailFrom: emailFrom,
      downloadLink: `${process.env.APP_BASE_URL}/file/${file.uuid}?source=email`,
      size: parseInt(file.size / 1000) + ' KB',
      expires: '24 hours'
    })
  });

  return res.send({success : "true"});

});

module.exports = router;