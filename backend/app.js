require('dotenv').config({ path: `.${process.env.NODE_ENV}.env` })

const express = require('express');
const cookies = require('cookie-parser')
const cors = require('cors');
const routes = require('./Routes/');
const app = express();
const port = process.env.PORT || 3000;


/* disable cors, for dev only */
if (process.env.NODE_ENV == 'dev') {
    const corsOptions = {
        credentials: true,
        origin: (_origin, callback) => {
            /* here can be origin check */
            callback(null, true);
        }
    }
    app.use(cors(corsOptions));
}


app.use(cookies());
app.use(express.json());
app.use('/', routes);



app.listen(port, () => {
    console.log('listening on port:' + port)
});