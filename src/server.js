const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();
const { DB_HOST } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() =>
    app.listen(3000, () => {
      console.log('Database connection successful. Server running. Use our API on port: 3000');
    }),
  )
  .catch((err) => {
    console.log(`Database connected with error: ${err}`);
    process.exit(1);
  });
