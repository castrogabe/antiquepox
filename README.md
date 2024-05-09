# First Commit create repository

. create git repository called antiquepox

# antiquepox

# 1st Commit Create React App, Layout

npx create-react-app frontend
FRONTEND
folder:
public > add images for this course

delete some files:
App.css
App.test.css
Delete contents of index.css
logo.svg
setupTests.js

App.js delete contents:
import logo from "./logo.svg";
import "./App.css";

Add in App.js: import React from "react";

CREATE HOME PAGE WITH REACT FUNCTIONAL COMPONENTS:
#########################################

// rfc <= this is the one we are using in the lessons
import react from 'react';

export default function Home () {
Return {

<div>Home</Home>
}
};

##########################################

// rfce:
Import React from ‘react’;

function HomeScreen {
Return (

<div>Home</div>
)
};

// rafc:
Import React from ‘react’;

export const Home = () => {
Return <div>Home</div>;
};

export default Home;

// rafce:
Import React from ‘react’;

const Home = () => {
Return <div>Home</div>;
};

---

BACKEND
(root) npm init -y backend

---

export default Home;

Development tools needed
GOOGLE CHROME: https://www.google.com/chrome/ follow the steps to install on your system
VsCode: https://code.visualstudio.com/ follow the steps to install on your system
Nodejs: https://nodejs.org/en install LTS VERSION follow the steps to install on your system
Git: https://git-scm.com/ follow the steps to install on your system

Accounts needed
Canva: https://www.canva.com/ we will use this to create our logo and jumbotron
Express: https://expressjs.com/ we will use to build our backend API application
Mongodb: https://www.mongodb.com/ to save and retrieve data from the database
Cloudinary: https://cloudinary.com/ to save our images
JWT: https://jwt.io/ for user auth
PayPal Developer: https://developer.paypal.com/home to make payments for PayPal orders
Stripe: https://stripe.com/docs/development/dashboard to make payments using credit cards
Nodemailer: https://nodemailer.com/usage/using-gmail/ to email the customer’s purchase receipt, shipping confirmation, respond to questions from contact form
Git: https://github.com for version control
Render: https://render.com/ to host our application online

.gitignore uncomment node_modules and build

FRONTEND
folder: components
Header.js > added
BottomHeader.js > added
Footer.js > added
BottomFooter.js >added

folder: pages
Home.js > added
About.js > added
Gallery.js > added
Product.js > added

Add Bootstrap and all css

####### GIT COMMIT YOUR REPOSITORY ###########

1. git init
2. git add .
3. git commit -m "First Commit"
4. git branch -M master
5. git remote add origin https://github.com/(yourname)/antiquepox.git
6. git push -u origin master

# 2nd Commit add static data and steps for second commit

npm install --save-dev @babel/plugin-proposal-private-property-in-object (fix frontend error)

FRONTEND
folder: components
Header.js > updated with font awesome and text for navbar name
Font Awesome Icons: https://fontawesome.com/icons you can find lots of free icons for your application

folder: pages
AboutUs.js > updated with boiler plate and images // replace with your own content

data.js > added (root)

---

steps for second commit, ect:
Open new terminal or command prompt in VSCode

1. git add . (space between add .)
2. git status (shows staged files ready to commit in green)
3. git commit -m "2nd Commit add static data and steps for second commit" (I copy and paste this)
4. git status (tells us that everything is committed "working tree clean" on main branch)
5. git push

Now you can check repository for updated code.

# Third Commit create backend and show products (Lesson 3)

Terminal: mkdir backend (Root of antiquepox)
cd backend > npm init (enter thru the prompts) creates {}package.json

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

# Fourth Commit by Reducer Hook, Helmet, Rating (Lesson 4)

BACKEND
server.js > update to get to products/slug

FRONTEND
index.js > update with HelmetProvider
{}package.json > update DevDependencies with: "@babel/plugin-proposal-private-property-in-object": "^1.0.0"

folder: components
LoadingBox.js (spinner) > added
MessageBox.js > added
Product.js > added
Rating.js > added

folder: pages
AboutUs.js > updated
Home.js > updated
Product.js > updated
Rating.js > added

. define reducer
. update fetch data, get state from useReducer in Home
. create product and rating components
. Use rating in product component
. Add Helmet to pages and index.js
. Jumbotron with typewriter effect in Home and components add Jumbotron.js
. Create Product details
. Create loading component
. Create message component
. Add React spinner in LoadingBox
. utils.js to define error function
. update server.js in backend

# Fifth Commit, Jumbotron, Cart, Signin,.env, JWT, MongoDB (Lesson 5)

BACKEND
server.js > updated with MongoDB, routes, models
.env > add JWT_SECRET, MongoDB connection (create mongodb connection string)
.env.example > added
utils.js > added for jsonwebtoken

folder: models added
productModel.js > added
userModel.js > added

folder: routes added
productRoutes.js > added
seedRoutes.js > added
userRoutes.js > added

FRONTEND
folder: components
Product.js > updated to ProductCard.js, css for Card.Title var(--dark)
Header.js > updated with Cart, Signin User dropdown
Jumbotron > added with typewriter effect

folder: pages
Cart.js > added
Signin.js > added
Home.js > updated for 6 col and Jumbotron
App.js > updated with Signin and Cart pages
index.js > updated with StoreProvider
index.css > uncomment css lines 65, and 522
Store.js > added
.gitignore > updated with .env (line 4) so we don't push our .env to github

git 5th commit

# Sixth Commit-Checkout (Lesson 6)

BACKEND
folder: routes
userRoutes.js > updated

FRONTEND
folder: components
CheckoutSteps.js > added
Header.js > added about us dropdown, re-arranged cart, SignoutHandler
ProductCard.js > added toast notification with image

folder: pages
PaymentMethod.js > added
ShippingAddress.js added  
Signup.js > added

Store.js > updated to SAVE_SHIPPING_ADDRESS

App.js > updated added 3 pages, ToastContainer

Git 6th commit

# Seventh Commit-OrderHistory (Lesson 7)

BACKEND
folder: models
orderModel.js > added

folder: routes
orderRoutes.js > added
userRoutes.js > updated with profile

server.js > updated with api/orders
utils.js > updated with isAuth

FRONTEND
folder: pages
Profile.js > added,
PlaceOrder.js > added,
OrderDetails.js > added,
OrderHistory.js > added,

App.js > updated added 4 pages

Git 7th commit

# Eighth Commit-Admin, Part 1 of 4 (lesson 8)

BACKEND
folder: routes
orderRoutes.js > updated
productRoutes.js > updated

config.js > added
server.js > updated with config
utils.js > updated

FRONTEND
folder: components
Footer.js > updated
ProtectedRoute.js > added
AdminRoute.js > added
Header.js > updated
Searchbox.js > added
BottomHeader.js > updated (Categories)
Pagination.js > added
Rating.js > updated

folder: pages
AskedQuestions.js > added
Design.js > added
Dashboard.js > added
ProductList.js > added
Search.js > added
Home.js > updated with pagination component

App.js > updated with 5 pages, AdminRoute, ProtectedRoute

Git 8th commit

# Ninth Commit-Admin, Part 2 of 4 (lesson 9)

BACKEND
folder: models
productModel.js > updated for images

folder: routes
orderRoutes.js > updated
productRoutes.js > updated product count in database/images
uploadRoutes.js > added - Cloudinary

server.js > updated with uploadRoutes
.env > update with Cloudinary
{}package.json > updated

FRONTEND
folders: components
Header.js > logo fix remove .

folders: pages
ProductList > update to show count in database h4
ProductEdit.js > added
OrderList.js > added
UserList.js > added
UserEdit.js > added
ProductMag.js > updated

App.js > updated with 4 pages
signup to Cloudinary

Git 9th commit

# Tenth Commit-Admin, Part 3 of 4 Nodemailer, Stripe, Password (lesson 10)

BACKEND
folders: models
orderModel > updated with deliveryDays, carrierName, trackingNumber
productModel > updated with name, comment, rating
userModel > updated with resetToken

folders: routes
orderRoutes.js > updated with count in stock, deliveryDays, carrierName, trackingNumber
productRoutes.js > updated with reviews
stripeRoutes.js > added
userRoutes.js > updated with forget and reset password

env > updated with stripe, email, nodemailer
server.js > updated with stripe
utils.js > updated with nodemailer confirmation emails

FRONTEND
folders: components
StripeCheckout.js
AdminPagination.js > added, this separates pagination with protected routes

folders: pages
ProductEdit.js > updated to fix error line 74
ForgetPassword.js > added
ResetPassword.js > added
SignIn.js > updated with ResetPassword Link
Signup.js > updated with Regex
Profile.js > updated to show password
PaymentMethod.js > updated with stripe
OrderDetails.js > updated with deliveryDays, carrierName, trackingNumber
OrderList.js > updated with Form for deliveryDays, carrierName, trackingNumber

App.js > updated
{}package.json > added stripe (npm install --force)

Git 10th commit

# Eleventh Commit-Admin Part 4 of 4 Contact/Messages (lesson 11)

BACKEND
folders: models
messageModel.js > added

folders: routes
messageRoutes.js > added
userRoutes.js > updated with pagination and totalUsers
orderRoutes.js > updated with pagination and totalOrders

server.js > updated for /api/messages

FRONTEND
folders: components
Header.js > updated for pills (Orders, Messages)
Footer.js > updated for email and contact
AdminPagination.js > added (ProductList, UserList, OrderList, Messages)

folders: pages
Dashboard.js > updated to show messages count
Contact.js > added
Messages.js > added
ProductList.js > updated with AdminPagination
UserList.js > updated with count in h4 and AdminPagination
OrderList.js > updates with count in h4, moved the product name under the image and AdminPagination
Signup.js > updated for 8 digits

Store.js > update with Messages
App.js > updated for Contact and Messages

Git 11th commit

# Twelfth Commit-ProductMag, Sidebar, Skeletons

FRONTEND  
folders: components
Sidebar.js > added for Home.js
ProductCard.js > updated with sidebar turnery operator and low Quantity alert
Skeleton (folder)
Skeleton.css > added
Skeleton.js > Added
SkeletonAboutUs.js > added
SkeletonAskedQuestions.js > added
SkeletonCart.js > added
SkeltonContact.js > added
SkeletonDashboard.js > added
SkeletonDesign.js > added
SkeletonForgetPassword.js > added
SkeletonGallery.js > added
SkeletonHome.js > added
SkeletonMessage.js > added
SkeletonOrderDetails.js > added
SkeletonOrderHistory.js > added
SkeletonOrderList.js > added
SkeletonPaymentMethod.js > added
SkeletonPlaceOrder.js > added
SkeletonProductEdit.js > added
SkeletonProductList.js > added
SkeletonProductMag.js > added
SkeletonProfile.js > added
SkeletonResetPassword.js > added
SkeletonShippingAddress.js > added
SkeletonUserEdit.js > added
SkeletonUserList.js > added

folders: pages
Home.js > updated with Skeleton and SideBar
ProductMag.js > updated with imageMagnify, lightbox, Skeleton
Signin.js > updated img with className='image-fluid', no Skelton
Signup.js > updated img with className='image-fluid', no Skelton
AboutUs.js > updated with Skeleton
AskedQuestions.js > updated with Skeleton
Cart.js > updated with Skeleton
Contact.js > updated with Skeleton
Dashboard.js > updated with Skeleton
Design.js > updated with Skeleton
ForgetPassword.js > updated with Skelton
Gallery.js > updated with Skeleton
Messages.js > updated with Skeleton
OrderDetails.js > updated with Skeleton
OrderHistory.js > updated with Skeleton
OrderList.js > updated with Skeleton
PaymentMethod.js > updated with Skeleton
PlaceOrder.js > updated with Skeleton
ProductEdit.js > updated with Skeleton
ProductList.js > updated with Skeleton
Profile.js > updated with Skeleton
ResetPassword.js > updated with Skeleton
ShippingAddress.js > updated with Skeleton
UserEdit.js > updated with Skeleton
UserList.js > updated with Skeleton

App.js > removed comments, no pages added

Git 12th commit

# Thirteenth Commit-Deployment, Render ** Final **

FRONTEND
cd root > npm init (this creates a {}package.json in the root)
. add your projects name "antiquepox"
. enter through the questions
. make sure it says deployment
. edit "scripts"
. PayPal - switch to live
. Stripe - switch from test to live
. push code to github before next step
. https://render.com - create account / Connect to GitHub for repository
. https://www.gabewd.com - Deployment dropdown > MernRender

# Fourteenth Commit-Deployment, Render ** Final **

. edit {}package.json in root, adding --force
