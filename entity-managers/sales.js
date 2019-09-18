import { writeFile, readFile } from './utils';
import products from './products';
import users from './users';
import chalk from 'chalk';

const debug = require('debug')('app:sales')

let sales = [];
let currentCount;

async function loadCount(){
  try {
    await readFile(`${__dirname}/../data/salesCount.json`, data => currentCount = data.currentCount);
  } catch (error) {
    debug(chalk.red.bold("Error reading count file"));
  }
}

async function writeCount(){
  try {
    await writeFile(`${__dirname}/../data/salesCount.json`, {currentCount: currentCount});
  } catch (error) {
    debug(chalk.red.bold("Error Writing count file"));
  }
}

async function loadSales(){
  try {
    await readFile(`${__dirname}/../data/sales.json`, data => sales = data);
  } catch (error) {
    debug(chalk.red.bold("Error reading sale file"));
  }
}

async function writeSales(){
  try {
    await writeFile(`${__dirname}/../data/sales.json`, sales);
  } catch (error) {
    debug(chalk.red.bold("Error writing sales file"));
  }
}


class Sales {
  constructor() {
    (async () => {
      await loadCount();
      await loadSales();
    })();
  }

  async getAll() {
    await loadSales();
    return sales;
  }

  async addSale(sale) {
    await loadSales();
    sales.push(sale);
    await writeSales();

    currentCount++;
    await writeCount();

    const seller = await users.getUser(sale.seller_id);
    seller.sale += sale.quantity_sold;
    await users.updateUser(seller.id, seller);

    const product = await products.getProduct(sale.product_id);
    product.quantity -= sale.quantity_sold;
    await products.updateProduct(product.id, product);

    return await this.getSale(sale.id);
  }

  async getSale(saleID) {
    await loadSales();
    const sale = sales.find(item => item.id == saleID);
    if(!sale) return undefined;
    return sale;
  }

  async getLastID() {
    await loadCount();
    return currentCount || sales.length;
  }
}

export default new Sales();
