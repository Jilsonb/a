require('dotenv').config();
const mongoose = require('mongoose');

const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const dbString = process.env.DB_STRING;

async function dbConnect() {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(dbString, dbOptions);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error(err);
    }
}

dbConnect().catch(err => console.error(err));

const userSchema = new mongoose.Schema({
    googleId: String,
    displayName: String,
    email: String,
    accessToken: String,
    expiryDate: String
});

const User = mongoose.model('googleusers', userSchema);

module.exports = User;