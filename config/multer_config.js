const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/page_audio');
    },
    filename: function (req, file, cb) {
        cb(null, (new Date().toISOString().replace(/[^a-zA-Z0-9]/g, "") + file.originalname).replace(" ", ""));
    }
});

const audioFileFilter = (req, file, cb) => {
    if (
        file.mimetype == 'audio/mpeg' ||
        file.mimetype == 'audio/mp3' ||
        file.mimetype == 'audio/aac' ||
        file.mimetype == 'audio/x-aac' ||
        file.mimetype == 'audio/wav' ||
        file.mimetype == 'audio/wave'
    ) {
        cb(null, true);
    }
    else {
        cb(null, false)
    }
};


const storageParagraph = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/paragraphs_image');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/[^a-zA-Z0-9]/g, "") + file.originalname);
    }
});

const imagefileFilter = (req, file, cb) => {
    if (
        file.mimetype == 'image/jpg' ||
        file.mimetype == 'image/jpeg' ||
        file.mimetype == 'image/png'
    ) {
        cb(null, true);
    }
    else {
        cb(null, false)
    }
};


module.exports = {
    uploadAudio: multer({
        storage: storage,
        limits: {
            files: 1,
            fileSize: 1024 * 1024 * 10
        },
        fileFilter: audioFileFilter
    }),

    uploadImage: multer({
        storage: storageParagraph,
        limits: {
            files: 1,
            fileSize: 1024 * 1024 * 5
        },
        fileFilter: imagefileFilter
    })
};



