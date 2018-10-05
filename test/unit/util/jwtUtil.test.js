const jwt = require("../../../src/util/jwtUtil");

describe("jwtUtil.sign", () => {
  it("should generate a token for input user object", () => {
    // "_id", "email", "name", "roles"
    const user = { _id: 1, email: "test", name: "name", roles: ["abc"] };
    const token = jwt.sign(user);
    const result = jwt.verify(token);
    expect(result).toMatchObject(user);
  });
});

describe("jwtUtil.verify", () => {
  it ("should return null if a invalid token is received.", () => {
    const result1 = jwt.verify(null);
    expect(result1).toBeNull();

    const result2 = jwt.verify('a');
    expect(result2).toBeNull();
  })

  it("should return decoded information if a valid token is received", () => {
    // "_id", "email", "name", "roles"
    const user = { _id: 1, email: "test", name: "name", roles: ["abc"] };
    const token = jwt.sign(user);
    const result = jwt.verify(token);
    expect(result).toMatchObject(user);
  });
});