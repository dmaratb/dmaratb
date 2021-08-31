/** data access layer */
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_CONNECTION).then(res => {
    console.log('db connected');
}).catch(err => {
    console.error('db connection failed');
});

module.exports.mongoose = mongoose;