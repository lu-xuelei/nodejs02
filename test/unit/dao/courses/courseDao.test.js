const dao = require("../../../../src/dao/courses/courseDao");
const Course = new dao.Course();

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

afterEach(() => {
  // Remove test records created in database after each run
  Course.remove({});
});

describe("addCourse", () => {
  it("should return error while adding course with name less  than 8 characters", async () => {
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
    await dao.addCourse(courseInfo).then(result => {
      expect(result).toMatchObject(courseInfo);
    });
  });
});

describe("getCourses", () => {
  it("should return list of coruses available in database", async () => {
    // Prepare a list of courses
    await dao.addCourse(courseInfo);

    // retrieve course from database
    const result = await dao.getCourses();
    expect(result.length).toBe(1);
  });
});

describe("test", () => {
  it("should return list of coruses available in database", async () => {
    expect({a:"a", b:"b"}).objectContaining({a:"a"})
  });
});

// describe("addCourse", () => {
//   const validCourseInfo = {
//     name: "Test Course",
//     author: "Test Author",
//     category: 'web',
//     tags: ['test'],
//     isPublished: true,
//     price: 15.55
//   }
//   it("should add a valid course", () => {
//     const result = dao.addCourse(validCourseInfo);
//     expect(result._id).toBeDefined();
//   });
// });
