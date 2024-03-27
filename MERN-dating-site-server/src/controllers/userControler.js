/* eslint-disable no-underscore-dangle */
const { uid } = require('uid');
const { hashString, compareHash } = require('../middleware/hash');
const UserSchema = require('../schemas/userSchema');

async function saveUser(req, res) {
  const { username, password, gender, date, city } = req.body;
  const hashedPass = await hashString(password);
  const secret = await uid();
  const user = new UserSchema({
    username,
    password: hashedPass,
    secret,
    gender,
    date,
    city,
    liked: [],
    likedBy: [],
    disliked: [],
    photos: [],
  });
  try {
    const ifTaken = await UserSchema.findOne({ username });
    if (ifTaken) throw new Error('Username taken');
    await user.save();
    res.status(201).json({ error: false, message: 'Now you can log in.' });
  } catch (error) {
    console.log('error ===', error);
    res.status(400).json({
      error: true,
      message: error.message,
    });
  }
}

async function getUser(req, res) {
  const { secret } = req.params;
  try {
    const user = await UserSchema.findOne({ secret });
    // this line makes sure, password data is not sent to front-end
    res.json({ error: false, user: { ...user._doc, password: '' } });
  } catch (error) {
    res.status(404).json({ error: true, message: 'user not found' });
  }
}

async function loginUser(req, res) {
  const { username, password } = req.body;
  try {
    const user = await UserSchema.findOne({ username });
    if (!user) throw new Error('User not found');
    const hashedpass = user.password;
    const result = await compareHash(password, hashedpass);
    console.log('result ===', result);
    if (!result) throw new Error('Bad credentials');
    res.send({ secret: user.secret });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
}

module.exports = {
  saveUser,
  loginUser,
  getUser,
};
