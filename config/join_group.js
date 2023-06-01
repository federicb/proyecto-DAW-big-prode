const pool = require('../connection');

async function insertUserInGroup(userId, groupId) {
  const membership = {
    id_user: userId,
    id_group: groupId
  };

  await pool.query('INSERT INTO users_groups SET ?', [membership]);
}

module.exports = { insertUserInGroup };

