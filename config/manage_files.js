let fs = require('fs');

module.exports = {
    removeFile: function (fileName, folder) {
        let path = `uploads/${folder}/${fileName}`;

        fs.stat(path, function (err, stats) {

            if (err) {
                return console.error(err);
            }

            fs.unlink(path, function (err) {
                if (err) return console.log(err);
            });
        });
    }
};