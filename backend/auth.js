const { randomBytes, createDecipheriv, createCipheriv } = require('crypto');
const algorithm = 'aes-256-ctr';
const key = "very very secret key         ..."
const iv = randomBytes(16);
const { Users } = require('./Models/users.model');


async function authorise(cookies) {
    const token = cookies.authorization;
    if (!token) {
        return;
    }

    let userId = '';
    try {
        let hash = token.split('.');
        if (hash.length < 2) return;

        const decipher = createDecipheriv(algorithm, key, Buffer.from(hash[0], 'hex'));
        userId = Buffer.concat([decipher.update(Buffer.from(hash[1], 'hex')), decipher.final()]);
    } catch { /* illegal content or iv values */
        return;
    }

    return await Users.get(userId.toString());
}

const Auth = {
    login: async ({ username, password }) => {

        const user = await Users.login(username, password);
        if (user) {
            const cipher = createCipheriv(algorithm, key, iv);
            const encrypted = Buffer.concat([cipher.update(user.id), cipher.final()]);

            return { token: iv.toString('hex') + '.' + encrypted.toString('hex'), name: username };
        } else {
            throw { status: 400, message: 'bad credentials' };
        }
    },

    logout: async (cookies) => {
        const user = await authorise(cookies);
        if (!user) {
            throw { status: 401, message: 'unauthorized' };
        }

        return user.name;
    },

    guard: () => {
        return async (req, res, next) => {

            const user = await authorise(req.cookies);

            if (!user) {
                res.status(401).json({ message: 'unauthorized' });
                return;
            }

            next();
        }
    }
}


module.exports.Auth = Auth;