import { writeFile, readFile } from './utils';
import products from './products';
import users from './users';

let sales = [];
let currentCount;

async function loadCount(){
  await readFile(`${__dirname}/../../data/salesCount.json`, data => currentCount = data.currentCount);
}

async function writeCount(){
await writeFile(`${__dirname}/../../data/salesCount.json`, {currentCount: currentCount});
}

async function loadSales(){
await readFile(`${__dirname}/../../data/sales.json`, data => sales = data);
}

async function writeSales(){
await writeFile(`${__dirname}/../../data/sales.json`, sales);
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
    const sale = sales.find(({ obj: sale } = item) => sale.id === saleID);
    if(!sale) throw new Error("Sale not found");
    return sale;
  }

  async getLastID() {
    await loadCount();
    return currentCount;
  }
}

export default new Sales();
