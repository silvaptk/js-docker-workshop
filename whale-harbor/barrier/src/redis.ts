const { createClient } = require("redis");

class Redis {
  static instance = null;

  static async getInstance() {
    if (!this.instance) {
      this.instance = await createClient({
        url: `redis://${process.env.DB_HOST}:${process.env.DB_PORT}`,
      })
        .on("error", (err) => {
          console.error("Redis Client Error", err);

          process.exit(1);
        })
        .connect();
    }

    return this.instance;
  }

  static async get(key) {
    const instance = await this.getInstance();
    return instance.get(key);
  }

  static async set(key, value) {
    const instance = await this.getInstance();
    return instance.set(key, value);
  }
}

module.exports = Redis;
