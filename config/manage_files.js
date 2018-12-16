let fs = require('fs');

module.exports = {
    /**
     * Deze functie verwijderd de file die overeenkomt met die filename
     * @param fileName => name of file to delete
     * @param folder => location of the file
     */
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