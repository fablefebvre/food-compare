# food-compare
Food comparison with Open Food Facts Data

## Load Open Food Facts Mongo DB Dump:

### download docker image
docker pull mongo
### launch docker image with docker_run.sh (set the volume where the dump is located) and then restore
### Download the dump 
curl https://world.openfoodfacts.org/data/openfoodfacts-mongodbdump.tar.gz -o openfoodfacts-mongodbdump.tar.gz
### Extract
tar -xvzf openfoodfacts-mongodbdump.tar.gz
### move the dump in the volume folder using sudo (needed privileges)
sudo mv dump/ foodcompare/
### Restore the dump: in the container under folder containing dump folder
docker exec -it mongodb bash
su mongodb && bash
cd /data/db
mongorestore --port <port number>

### Create index for categories
su mongodb && bash
mongo
use off
db.products.createIndex({categories_tags: 1})

### food-compare-be
Contains the back end: REST API with mongoose to connect to the MongoDB instance
Run the sever: node server.js
Available methods in the API:
http://localhost:4000/api/categories => Returns distinct categories in DB
http://localhost:4000/api/categoriesTax => returns all FR categories of https://en.wiki.openfoodfacts.org/Global_categories_taxonomy
http://localhost:4000/api/findBestProducts/:category => returns the best products for the given category

### food-compare-fe
Contains the front end: Developed with Vue.js
Run the sever: npm run serve
Launch the app: http://localhost:8081/