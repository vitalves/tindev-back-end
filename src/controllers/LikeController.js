const Dev = require('../models/Dev');

module.exports = {
  async store(req, res) {
    // console.log(req.io, req.connectedUsers); /* socket.io */

    const { user } = req.headers;
    const { devId } = req.params;

    const loggedDev = await Dev.findById(user);
    const targetDev = await Dev.findById(devId);

    if (!targetDev) {
      return res.status(400).json({ error: 'Dev not exists'});
    }

    const followed = loggedDev.likes.findIndex(f => f == devId);

    if (followed >= 0) {
      return res.status(400).json({ error: 'User already followed'})
    }

    if (targetDev.likes.includes(loggedDev._id)) {
      // console.log('DEU MATCH')
      const loggedSocket = req.connectedUsers[user]; // user logado
      const targetSocket = req.connectedUsers[devId]; // user q recebeu o like

      if (loggedSocket) {
        // avisando ao user logado (loggedSocket) q deu match em targetDev:
        req.io.to(loggedSocket).emit('match', targetDev);
      }

      if (targetSocket) {
        // avisando ao user que recebeu o match
        req.io.to(targetSocket).emit('match', loggedDev);
      }
    }

    loggedDev.likes.push(targetDev._id);

    await loggedDev.save();

    return res.json(loggedDev);
  }
}
