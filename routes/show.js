const router = require('express').Router();

const File = require('../models/file');


router.get('/:uuid' , async (req,res) => {

    try{
        const file = await File.findOne({uuid : req.params.uuid});
        if(!file) {
            return res.render('downloads', { error: 'Link has been expired.'});
        } 

        // creating a real download link
        return res.render('downloads', { 
            uuid: file.uuid, 
            fileName: file.filename, 
            fileSize: file.size, 
            downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}` //download button pr yhi link aayegi
        });
    } catch(err) {
        return res.render('downloads' , {error : 'something went wrong'});
    }

    

});

module.exports = router;