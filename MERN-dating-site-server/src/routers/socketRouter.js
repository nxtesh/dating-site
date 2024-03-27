/* eslint-disable no-underscore-dangle */
const MessageSchema = require('../schemas/messageSchema');
const UserSchema = require('../schemas/userSchema');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('join', async (secret) => {
      const user = await UserSchema.findOne({ secret });
      if (!user) {
        return socket.emit('unauthorized');
      }
      console.log('joining room ===', user.username);
      socket.join(user.username);
    });

    socket.on('addImage', async (secret, photo) => {
      const user = await UserSchema.findOne({ secret });
      if (!user) {
        return socket.emit('unauthorized');
      }
      user.photos.push(photo);
      await user.save();
      socket.emit('user', { ...user._doc, password: '' });
    });

    socket.on('deleteImg', async (secret, photo) => {
      const user = await UserSchema.findOne({ secret });
      if (!user) {
        return socket.emit('unauthorized');
      }
      const index = user.photos.indexOf(photo);
      user.photos.splice(index, 1);
      await user.save();
      socket.emit('user', { ...user._doc, password: '' });
    });

    socket.on('users', async () => {
      const users = await UserSchema.find();
      socket.emit('users', users);
    });

    socket.on('like', async (likedId, secret) => {
      const sendingUser = await UserSchema.findOne({ secret });
      if (!sendingUser) {
        return socket.emit('unauthorized');
      }
      sendingUser.liked.push(likedId);
      await sendingUser.save();
      const likedUser = await UserSchema.findById(likedId);
      likedUser.likedBy.push(sendingUser._id);
      await likedUser.save();

      const users = await UserSchema.find();
      socket.emit('user', { ...sendingUser._doc, password: '' });
      socket.emit('users', users);
      console.log('Sending like to ===', likedUser.username);
      io.to(likedUser.username).emit('newLike', sendingUser._id);
    });

    socket.on('dislike', async (dislikedId, secret) => {
      const sendingUser = await UserSchema.findOne({ secret });
      if (!sendingUser) {
        return socket.emit('unauthorized');
      }
      sendingUser.disliked.push(dislikedId);
      await sendingUser.save();
      socket.emit('user', { ...sendingUser._doc, password: '' });
    });

    socket.on('sendMessage', async (secret, message) => {
      const sendingUser = await UserSchema.findOne({ secret });
      if (!sendingUser) {
        return socket.emit('unauthorized');
      }
      const NewMessage = new MessageSchema(message);
      await NewMessage.save();
      io.to(message.receiver).emit('newMsg', NewMessage);
      const messages = await MessageSchema.find({
        $or: [{ sendingUser: sendingUser.username }, { receiver: sendingUser.username }],
      });
      socket.emit('messages', messages);
    });

    socket.on('messages', async (secret) => {
      const user = await UserSchema.findOne({ secret });
      const messages = await MessageSchema.find({
        $or: [{ sendingUser: user.username }, { receiver: user.username }],
      });
      socket.emit('messages', messages);
    });
  });
};
