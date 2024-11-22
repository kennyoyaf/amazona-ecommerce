const express = require('express');
const app = express();
const dotenv = require('dotenv');
const { readdirSync } = require('fs');
const morgan = require('morgan');
const mongoose = require('mongoose');
const corsOption = require('./utils/corsOption');

dotenv.config();

//Import Routes
// const authRoute = require('./routes/auth');
// const postRoute = require('./routes/post');
// const productRoutes = require('./routes/productRoutes');

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

//Route Middlewares
// app.use('/api/user', authRoute);
// app.use('/api/post', postRoute);
// app.use('/product', productRoutes);
// all routes are immediately loaded when created
readdirSync('./routes').map(route => {
  app.use('/product', require(`./routes/${route}`));
});

async function startServer() {
  await connectToDB();
  app.listen(4000, () => console.log('Server Up and running'));
}

startServer();
