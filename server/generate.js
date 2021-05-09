var faker = require('faker');

var database = {products: []};

for(let i=0; i <= 500; i++) {
    database.products.push({
        id: i,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        img: faker.image.fashion(),
        quantity: faker.datatype.number()
    });
}


console.log(JSON.stringify(database));
