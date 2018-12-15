let mongoose = require('mongoose');
let crypto = require('crypto');
let jwt = require('jsonwebtoken');

let UserSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: {type: String, lowercase: true, unique: true},
    hash: String,
    salt: String,
    validation_code: String,
    roles: {
        admin: Boolean,
        super_admin: Boolean,
        client: Boolean,
        nv_admin: Boolean
    },
    admin_active: Boolean,
    unlocked_sessions: [String],
    current_session_id: mongoose.Types.ObjectId,
    current_exercise_id: mongoose.Types.ObjectId,
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'group'
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }],
    feedbackSubscribed: Boolean,
    image_file_name: String
});

/**
 * Create Index'en
 */

UserSchema.index({email: 1});

UserSchema.index({group: 1});

UserSchema.index({group: 1, "roles.client": 1});

// UserSchema.set("autoIndex", false);

/**
 * Generate hash and salt for password encryption
 * @param password
 */
UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(32).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('hex')
};

/**
 * Checks if password is valid
 * @param password
 * @returns {boolean}
 */
UserSchema.methods.validPassword = function (password) {
    let hash = crypto.pbkdf2Sync(password, this.salt,
        10000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

/**
 * This generate a token
 * @returns {*}
 */
UserSchema.methods.generateJWT = function () {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    return jwt.sign({
        _id: this._id,
        email: this.email,
        exp: parseInt(exp.getTime() / 1000),
        firstname: this.firstname,
        lastname: this.lastname,
        roles: this.roles,
        admin_active: this.admin_active || false

    }, process.env.MINDFULNESS_BACKEND_SECRET);
};

mongoose.model('user', UserSchema);