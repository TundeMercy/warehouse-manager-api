import { writeFile, readFile } from './utils';

let users;
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
    users[user.id] = user;
    await writeUsers();
    currentCount++;
    await writeCount();
    return this.getUser(user.id);
  }

  async getUser(userID) {
    await loadUsers();
    return users[userID];
  }

  async updateUser(userID, newUser){
    await loadUsers();
    users[userID] = newUser;
    await writeUsers();
    return this.getUser(userID);
  }

  async getLastID() {
    await loadCount();
    return currentCount;
  }
}

export default new Users();
