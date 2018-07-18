const mongoose = require('mongoose');


const dbName = 'artleasingapp'
mongoose.connect(`mongodb://localhost/${dbName}`);