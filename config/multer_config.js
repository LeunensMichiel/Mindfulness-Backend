const multer = require('multer');

/**
 * Functie voor naam in te stellen van een file
 * @param req
 * @param file
 * @param cb
 */
const filename = function (req, file, cb) {
    cb(null, (new Date().toISOString().replace(/[^a-zA-Z0-9]/g, "") + file.originalname).replace(" ", ""));
};

/**
 * Config van page_audio
 * @type {DiskStorage}
 */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/page_audio');
    },
    filename: filename
});

/**
 * storage config van paragraph image
 * @type {DiskStorage}
 */
const storageParagraph = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/paragraphs_image');
    },
    filename: filename
});

/**
 * Storage config van session_image
 * @type {DiskStorage}
 */
const storageSession = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/session_image');
    },
    filename: filename
});

/**
 * storage config van post image
 * @type {DiskStorage}
 */
const storagePost = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/post_image');
    },
    filename: filename
});

/**
 * storage config van profile pic
 * @type {DiskStorage}
 */
const storageUser = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/profile_image');
    },
    filename: filename
});

/**
 * File filter voor audio
 * Dit laat enkel audio bestanden door die support worden door android mediaplayer
 * @param req
 * @param file
 * @param cb
 */
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

/**
 * File filter voor images
 * @param req
 * @param file
 * @param cb
 */
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
            fileSize: 1024 * 1024 * 10 // max 10mb
        },
        fileFilter: audioFileFilter
    }),

    uploadParagraphImage: multer({
        storage: storageParagraph,
        limits: {
            files: 1,
            fileSize: 1024 * 1024 * 5 // max 5mb
        },
        fileFilter: imagefileFilter
    }),

    uploadSessionImage: multer({
        storage: storageSession,
        limits: {
            files: 1,
            fileSize: 1024 * 1024 * 5 // max 5mb
        },
        fileFilter: imagefileFilter
    }),

    uploadPostImage: multer({
        storage: storagePost,
        limits: {
            files: 1,
            fileSize: 1024 * 1024 * 5 // max 5mb
        },
        fileFilter: imagefileFilter
    }),

    uploadProfileImage: multer({
        storage: storageUser,
        limits: {
            files: 1,
            fileSize: 1024 * 1024 * 5 // max 5mb
        },
        fileFilter: imagefileFilter
    })
};



