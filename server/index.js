const express = require('express');
const app = express();
const dotenv = require('dotenv');
const { readdirSync } = require('fs');
const morgan = require('morgan');
const mongoose = require('mongoose');
const corsOption = require('./utils/corsOption');

dotenv.config();

//Connect to DB
async function connectToDB() {
  try {
    await mongoose.connect(process.env.DB_CONNECT);
    console.log('Connected to DB');
  } catch (error) {
    console.error('Error connecting to DB:', error);
  }
}
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsOption);

readdirSync('./routes').map(route => {
  app.use('/product', require(`./routes/${route}`));
});

async function startServer() {
  await connectToDB();
  app.listen(4000, () => console.log('Server Up and running'));
}

startServer();
