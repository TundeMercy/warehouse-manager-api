import { writeFile, readFile } from './utils';

let users = [];
let currentCount;

async function loadCount(){
    await readFile(`${__dirname}/../../data/usersCount.json`, data => currentCount = data.currentCount);
}

async function writeCount(){
  await writeFile(`${__dirname}/../../data/usersCount.json`, {currentCount: currentCount});
}

async function loadUsers(){
  await readFile(`${__dirname}/../../data/users.json`, data => users = data);
}

async function writeUsers(){
await writeFile(`${__dirname}/../../data/users.json`, users);
}


class Users {
  constructor() {
    (async () => {
    await loadUsers();
    await loadCount();
    })();
  }

  async getAll() {
    await loadUsers();
    return  users;
  }

  async addUser(user) {
    await loadUsers();
    users.push(user);
    await writeUsers();
    currentCount++;
    await writeCount();
    return this.getUser(user.id);
  }

  async getUser(userID) {
    await loadUsers();
    const user = users.find(({ obj: user } = item) => user.id === userID);
    if(!user) throw new Error('User not Found');
    return user;
  }

  async updateUser(userID, newUser){
    await loadUsers();
    try {
    const user = await this.getUser(userID);
    const index = users.indexOf(user);
    users[index] = newUser;
    await writeUsers();
    return await this.getUser(userID);
    } catch (error) {
      throw error;
    }
  }

  async getLastID() {
    await loadCount();
    return currentCount;
  }
}

export default new Users();
