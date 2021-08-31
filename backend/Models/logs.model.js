const { mongoose } = require('./dal');
const Log = mongoose.model('Log', {
    user: String,
    event: String,
    timestamp: Date
});


/** logs collection, used instead of log file */
const Logs = {
    addLog: (user, event) => {
        const added = new Log({ user: user, event: event, timestamp: Date.now });
        added.save();
    },

    getLog: async (user) => {
        return await Log.find({ user: user });
    },

    getAllLogs: async () => {
        return await Log.find({});
    },
}

module.exports.Logs = Logs;