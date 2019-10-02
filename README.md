# food-compare
Food comparison with Open Food Facts Data

## Load Open Food Facts Mongo DB Dump:

### Download the dump 
https://world.openfoodfacts.org/data/openfoodfacts-mongodbdump.tar.gz

### Launch restore:
mongorestore --port <port number>

### Create index for categories
off.products.createIndex({categories_tags: 1})

### food-compare-be
Contains the back end: REST API with mongoose to connect to the MongoDB instance
Run the sever: node server.js
Available methods in the API:
http://localhost:4000/api/categories => Returns distinct categories in DB
http://localhost:4000/api/categoriesTax => returns all FR categories of https://en.wiki.openfoodfacts.org/Global_categories_taxonomy
http://localhost:4000/api/findBestProducts/:category => returns the best products for the given category

### food-compare-fe
Contains the front end: Developed with Vue.js
Run the sever: npm run dev
Launch the app: http://localhost:8081/