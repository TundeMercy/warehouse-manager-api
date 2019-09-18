import { writeFile, readFile } from './utils';
const debug = require('debug')('app:products');
import chalk from 'chalk';

let products = [];
let currentCount;

async function loadCount(){
    try {
      await readFile(`${__dirname}/../data/productsCount.json`, data => currentCount = data.currentCount);
    } catch (error) {
      debug(chalk.red.bold("Error reading count file"));
    }
  }
  
  async function writeCount(){
    try {
      await writeFile(`${__dirname}/../data/productsCount.json`, {currentCount: currentCount});
    } catch (error) {
      debug(chalk.red.bold("Error Writing count file"));
    }
  }
  
  async function loadProducts(){
    try {
      await readFile(`${__dirname}/../data/products.json`, data => products = data);
    } catch (error) {
      debug(chalk.red.bold("Error reading products file"));
    }
  }
  
  async function writeProducts(){
    try {
      await writeFile(`${__dirname}/../data/products.json`, products);
    } catch (error) {
      debug(chalk.red.bold("Error writing products file"));
    }
  }

class Products{
    constructor(){
        (async () => {
            await loadCount();
            await loadProducts();
        })();
    }

    async getAll(){
        await loadProducts();
        return products;
    }

    async addProduct(product){
        products.push(product);
        await writeProducts();
        currentCount++;
        await writeCount();
        return await this.getProduct(product.id);
    }

    async getProduct(productID){
        await loadProducts();
        const product = products.find((item) => item.id == productID);
        if(!product) return undefined;
        return product;
    }

    async updateProduct(productID, newProduct){
        await loadProducts();
        try {
            const product = await this.getProduct(productID);
            const index = products.indexOf(product);
            products[index] = newProduct;
            await writeProducts();
            return await this.getProduct(productID);
        } catch (error) {
            throw error
        }
    }

    async getLastID(){
        await loadCount();
        return currentCount || products.length;
    }
}

export default new Products();