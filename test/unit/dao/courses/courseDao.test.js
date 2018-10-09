const dao = require("../../../../src/dao/courses/courseDao");
const logger = require("../../../../src/util/logger");

let courseInfo = null;

beforeEach(() => {
  courseInfo = {
    name: "CS12345678",
    author: "Author",
    category: "web",
    tags: ["tag1", "tag2"],
    isPublished: true,
    price: 15
  };
});

afterEach(async () => {
  // Remove test records created in database after each run
  await dao.Course.remove({});
});

describe("addCourse", () => {
  it("should return error while adding course with name less than 8 characters", async () => {
    courseInfo.name = "1234567";
    await dao.addCourse(courseInfo).catch(err => {
      expect(err).toHaveProperty("errors.name");
    });
  });

  it("should return error while adding course with name more than 64 characters", async () => {
    courseInfo.name = new Array(66).join("A");
    await dao.addCourse(courseInfo).catch(err => {
      expect(err).toHaveProperty("errors.name");
    });
  });

  it("should return error while adding course with invalid category value", async () => {
    courseInfo.category = "c";
    await dao.addCourse(courseInfo).catch(err => {
      expect(err).toHaveProperty("errors.category");
    });
  });

  it("should return error while adding course with invalid tags", async () => {
    courseInfo.tags = null;
    await dao.addCourse(courseInfo).catch(err => {
      expect(err).toHaveProperty("errors.tags");
    });
  });

  it("should return error while adding course with invalid isPublished", async () => {
    courseInfo.isPublished = "invalid";
    await dao.addCourse(courseInfo).catch(err => {
      expect(err).toHaveProperty("errors.isPublished");
    });
  });

  it("should return error while adding course with invalid price", async () => {
    courseInfo.price = "invalid";
    await dao.addCourse(courseInfo).catch(err => {
      expect(err).toHaveProperty("errors.price");
    });
  });

  it("should successfully add a course with valid inputs", async () => {
    const result = await dao.addCourse(courseInfo);
    expect(result).toHaveProperty("_id");
    expect(result).toHaveProperty("name", courseInfo.name);
  });
});

describe("getCourses", () => {
  it("should return list of coruses available in database", async () => {
    // Prepare a list of courses
    await dao.addCourse(courseInfo);

    // retrieve course from database
    const result = await dao.getCourses();
    expect(result.length).toBe(1);
    expect(result[0]).toHaveProperty("_id");
    expect(result[0]).toHaveProperty("name", courseInfo.name);
  });

  it("should return all coruses available in database", async () => {
    // Prepare a list of courses
    const loops = new Array(4);
    // To run async loop, use for (... of ...)
    for (v of loops) {
      await dao.addCourse(courseInfo);
    }

    // retrieve course from database
    const result = await dao.getCourses();
    expect(result.length).toBe(loops.length);
    expect(result[0]).toHaveProperty("_id");
    expect(result[0]).toHaveProperty("name", courseInfo.name);
  });
});

describe("selectCourses", () => {
  it("should return list of courses matching the filter", async () => {
    // Prepare a list of courses
    const prices = [1, 10, 21, 33];
    for (v of prices) {
      courseInfo.price = v;
      await dao.addCourse(courseInfo);
    }
    // retrieve course from database
    const result = await dao.selectCourses({ price: { $gt: 20 } }, {}, {});
    expect(result.length).toBe(2);
    expect(result[0].price).toBeGreaterThan(20);
  });

  it("should return list of courses with selected properties", async () => {
    // Prepare a list of courses
    const loops = new Array(4);
    for (v of loops) {
      await dao.addCourse(courseInfo);
    }
    // retrieve course from database
    const result = await dao.selectCourses({}, { name: 1, author: 1 }, {});
    expect(result.length).toBe(loops.length);
    expect(result[0]).toEqual(
      expect.objectContaining({
        name: courseInfo.name,
        author: courseInfo.author
      })
    );
    expect(result[0]).toEqual(
      expect.not.objectContaining({
        price: courseInfo.price,
        tags: courseInfo.tags
      })
    );
  });

  it("should return list of courses in expected order", async () => {
    // Prepare a list of courses
    const prices = [1, 11, 2, 12, 3, 13, 4, 14];
    for (v of prices) {
      courseInfo.price = v;
      await dao.addCourse(courseInfo);
    }
    // retrieve course from database
    const result = await dao.selectCourses({}, {}, { price: -1 });
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].price).toBeGreaterThan(result[i + 1].price);
    }
  });
});

describe("updateCourse", () => {
  let id = null;
  beforeEach(async () => {
    await dao.addCourse(courseInfo).then(course => {
      id = course._id;
    });
  });

  it("should return error if new course is having invalid name", async () => {
    const values = [null, "a", new Array(66).join("a")];
    for (v of values) {
      courseInfo.name = v;
      await dao.updateCourse(id, courseInfo).catch(err => {
        expect(err).toHaveProperty("errors.name");
      });
    }
  });

  it("should return error if new course is having invalid category", async () => {
    const values = [null, "a", "test"];
    for (v of values) {
      courseInfo.category = v;
      await dao.updateCourse(id, courseInfo).catch(err => {
        expect(err).toHaveProperty("errors.category");
      });
    }
  });

  it("should return error if new course is having invalid tags", async () => {
    const values = [null, [], "test"];
    for (v of values) {
      courseInfo.tags = v;
      await dao.updateCourse(id, courseInfo).catch(err => {
        expect(err).toHaveProperty("errors.tags");
      });
    }
  });

  it("should return error if new course is having invalid price", async () => {
    const values = [null, [], "test"];
    for (v of values) {
      courseInfo.price = v;
      await dao.updateCourse(id, courseInfo).catch(err => {
        expect(err).toHaveProperty("errors.price");
      });
    }
  });

  it("should update course info if new info is valid", async () => {
    const newInfo = {
      name: "Updated Name",
      author: "Updated Author",
      category: "java",
      isPublished: false,
      price: 10
    };
    await dao.updateCourse(id, newInfo).then(result => {
      expect(result).toEqual(expect.objectContaining(newInfo));
      expect(result).toEqual(
        expect.not.objectContaining({
          name: courseInfo.name,
          author: courseInfo.author
        })
      );
    });
  });
});
