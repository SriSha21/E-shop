const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cartItem');
const Order = require('./models/order');
const OrderItem = require('./models/orderItem');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next) =>{   //it is a middleware for incoming request
User.findByPk(1)
.then(user=>{
req.user = user;  //its not a js object it is sequelize object          
next();
})
.catch(err=>console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);
Product.belongsTo(User,{constraints:true,onDelete:'CASCADE'}); //adding relationships using sequelize
User.hasMany(Product); //this line state that user can have many product like one to many
User.hasOne(Cart);
Cart.belongsTo(User);//its inverse of above association -optional
Cart.belongsToMany(Product,{through:CartItem});//it means connection storing through the cart Item
Product.belongsToMany(Cart,{through:CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product,{through:OrderItem});//it means connection storing through the Order Item
//Product.belongsToMany(Order,{through:OrderItem});




sequelize
// .sync({force:true})    //we can use force =true  then it will drop the existing table 
.sync()
.then(result=>{
    return User.findByPk(1);//instead of id here we need to use pk
})
.then(user=>{
    return(user|| User.create({name:'Sri',email:'try@cmail.com'})); //it serve the same if statment line shortcut
    // if(!user){
    //     return User.create({name:'Sri',email:'try@amail.com'});
    // }
    // return user;
})
.then(user=>{
    return user.createCart();
})

.then(user=>{
    app.listen(5000);
})
.catch(err=>{
console.log(err);
});
