import { faker } from "@faker-js/faker";
import { User } from "../models/userModel.js";

export const createDemoUsers = async (numUsers) => {
  try {
    const users = [];
    for (let i = 0; i < numUsers; i++) {
      const user = User.create({
        name: faker.person.fullName(),
        username: faker.internet.userName(),
        bio: faker.lorem.sentence(10, 15),
        password: "123",
        avatar: {
          url: faker.image.avatar(),
          public_id: faker.system.fileName(),
        },
      });
      users.push(user);
    }
    await Promise.all(users);
    console.log("Users Created", numUsers);
    process.exit(1);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
 