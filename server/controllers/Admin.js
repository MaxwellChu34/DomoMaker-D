const models = require('../models');

const { Account } = models;

const getAccounts = async (req, res) => {
  try {
    const docs = await Account.find({}).lean().exec();
    return res.json(docs);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Failed to find users' });
  }
};

module.exports = {
  getAccounts,
};
