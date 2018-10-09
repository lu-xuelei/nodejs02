// const logger = require('./src/util/logger');
// const config = require('config');

// logger.error(`[test.js] process.env.NODE_ENV is ${process.env.NODE_ENV}`, process.env.NODE_ENV);
// logger.error(`[test.js] db.url is ${config.get('database.url')}`);
// logger.error("[test.js] email is", config.get('email'));
// logger.error(`[test.js] process.env.NODE_ENV is ${process.env.NODE_ENV}`);

describe("Jest experiment place", () => {
  it("should pass the test", () => {
    const result = {
      name: "name1",
      author: "author1",
      _id: "id value"
    };
    expect(result).toEqual(expect.objectContaining({
      name:result.name
    }));
  });
});
