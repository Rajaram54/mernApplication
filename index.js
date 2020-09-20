const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const connectDb = require('./config/db');

// connect DB
connectDb();

//INIT middle-ware

app.use(express.json());

app.use('/api/user', require('./routes/api/user'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/auth', require('./routes/api/auth'));

app.listen(port, () => {
    console.log(`App is listing in port ${port}`)
})