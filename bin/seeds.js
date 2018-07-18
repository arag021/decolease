const mongoose = require('mongoose');


const dbName = 'DecoLease'
mongoose.connect(process.env.MONGODB_URI);