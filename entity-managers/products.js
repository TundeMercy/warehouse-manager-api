import { writeFile, readFile } from './utils';

let products = [];
let currentCount;

async function loadCount(){
  await readFile(`${__dirname}/../../data/productsCount.json`, data => currentCount = data.currentCount);
}

async function writeCount(){
await writeFile(`${__dirname}/../../data/productsCount.json`, {currentCount: currentCount});
}

async function loadProducts(){
await readFile(`${__dirname}/../../data/products.json`, data => products = data);
}

async function writeProducts(){
await writeFile(`${__dirname}/../../data/products.json`, products);
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
        if(!product) throw new Error("Product not found");
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
        return currentCount;
    }
}

export default new Products();