/* eslint-disable no-unused-vars */
require('dotenv').config();
const express = require('express');

const app = express();
const morgan = require('morgan');
const colors = require('colors');
const cors = require('cors');
const http = require('http').createServer(app);
const socketIo = require('socket.io');
const socketRouter = require('./routers/socketRouter');

const testDbConnection = require('./utils/helper');
const mainRouter = require('./routers/RESTrouter');

const io = socketIo(http, {
  cors: {
    origin: ['https://mern-dating-site-client.vercel.app', 'http://localhost:3000'],
  },
});

const { PORT } = process.env;
// MiddleWare
app.use(morgan('dev'));
app.use(cors({origin: ['https://mern-dating-site-client.vercel.app', 'http://localhost:3000']}));
app.use(express.json());
// TEST DB CONNECTION
testDbConnection();
// ROUTES

app.get('/', (req, res) => res.json({ msg: 'server online' }));

app.use('/api', mainRouter);

// ROUTER FOR MEDIA FILES
app.use('/images', express.static('images'));

app.use((req, res) => {
  res.status(404).json({ msg: 'Not found' });
});

http.listen(PORT, () => console.log(`Server is listening to port: ${PORT}`.cyan.bold));

socketRouter(io);
