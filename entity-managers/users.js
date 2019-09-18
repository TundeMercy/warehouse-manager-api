import { writeFile, readFile } from './utils';
const debug = require('debug')('app:users');
import chalk from 'chalk';

let users = [];
let currentCount;

async function loadCount(){
  try {
    await readFile(`${__dirname}/../data/usersCount.json`, data => currentCount = data.currentCount);
  } catch (error) {
    debug(chalk.red.bold("Error reading count file"));
  }
}

async function writeCount(){
  try {
    await writeFile(`${__dirname}/../data/usersCount.json`, {currentCount: currentCount});
  } catch (error) {
    debug(chalk.red.bold("Error Writing count file"));
  }
}

async function loadUsers(){
  try {
    await readFile(`${__dirname}/../data/users.json`, data => users = data);
  } catch (error) {
    debug(chalk.red.bold("Error reading users file"));
  }
}

async function writeUsers(){
  try {
    await writeFile(`${__dirname}/../data/users.json`, users);
  } catch (error) {
    debug(chalk.red.bold("Error writing users file"));
  }
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
    const user = users.find(item => item.id == userID);
    if(!user) return undefined;
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
    return currentCount || users.length;
  }
}

export default new Users();
