const { mongoose } = require('./dal');
const User = mongoose.model('User', {
    name: String,
    password: String
});


/** users model */
const Users = {
    /** pulls user with give name and password, I saved it plain, in real application it should be ecrypted similar to auth.js */
    login: async (username, password) => {
        return await User.findOne({ name: username, password: password }).exec();
    },

    /** get user by id, for internal use only */
    get: async (id) => {
        return await User.findOne({ id: id }).exec();
    }
}


module.exports.Users = Users;