const config = {
    db: {
      /* don't expose password or any sensitive info, done only for demo */
      host: "db.bluejackbot.jex.ink",
      user: "root",
      password: "Root123!",
      database: "bluejackbot",
      connectTimeout: 60000
    },
  };
  module.exports = config;