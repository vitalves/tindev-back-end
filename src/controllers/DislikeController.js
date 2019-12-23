const Dev = require('../models/Dev');

module.exports = {
  async store(req, res) {
    const { user } = req.headers;
    const { devId } = req.params;

    const loggedDev = await Dev.findById(user);
    const targetDev = await Dev.findById(devId);

    if (!targetDev) {
      return res.status(400).json({ error: 'Dev not exists'});
    }

    const nofollowed = loggedDev.likes.findIndex(f => f == devId);

    if (nofollowed >= 0) {
      return res.status(400).json({ error: 'User already nofollowed'})
    }

    if (targetDev.dislikes.includes(loggedDev._id)) {

      console.log('DEU MATCH')

    }

    loggedDev.likes.push(targetDev._id);

    await loggedDev.save();

    return res.json(loggedDev);
  }
}
