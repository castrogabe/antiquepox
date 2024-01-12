# MERN Antiquepox eCommerce antique website

. create git repository called antiquepox

# 1st Commit-Antiquepox Layout components and pages

. Create React App
. Add Bootstrap and all css

FRONTEND
.folder: components
Header.js > added
BottomHeader.js > added
Footer.js > added
BottomFooter.js >added

.folder: pages
Home.js > added
About.js > added
Gallery.js > added

. Create Git Repository

# Second Commit add static data

FRONTEND
.folder: pages
Product.js > added

data.js > added (root)

#### How to Add second commit

from terminal > cd project root

1. git add .
2. git status (shows stages files ready to commit in green)
3. git commit -m "commit message"
4. git status (tells us that everything is committed "working tree clean" on main branch)
5. git push

# Third Commit create backend and show products (Lesson 3)

Terminal: mkdir backend
cd backend
npm init (enter thru the prompts) creates {}package.json

BACKEND
data.js > added
.gitiginore > added
server.js > added
. create route for api/products
. update and fetch products from backend using axios
. get state from useReducer
. update HomeScreen.js

FRONTEND
.folder: pages
Gallery.js > updated
Home.js > updated
Product.js > updated
