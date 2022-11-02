const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  //we can use sequel method to render id automatically-associations
  //it will take model name Product abd create CreateProduct() automatically i.e
  req.user.createProduct({
    title:title,
    price:price,
    imageUrl:imageUrl,
    description:description
  })

  //it is manual way
  // Product.create({
  //   title:title,
  //   price:price,
  //   imageUrl:imageUrl,
  //   description:description,
  //   userId:req.user.id //it is manual way of render or assign userId
  // })
  
  .then(result=>{
    console.log(result);
    res.redirect('/admin/products');

  }).catch(err=>{
    console.log(err);
  });

};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  req.user.getProducts({where: {id: prodId }})
 // Product.findByPk(prodId)
  .then(products =>{
  const   product = products[0];
    if(!product){
      return res.redirect("/");
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: products
    });
  }).catch(err=> console.log(err));
  //res.redirect('/admin/products');

  // Product.findById(prodId, product => {
  //   if (!product) {
  //     return res.redirect('/');
  //   }
  //   res.render('admin/edit-product', {
  //     pageTitle: 'Edit Product',
  //     path: '/admin/edit-product',
  //     editing: editMode,
  //     product: product
  //   });
  // });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findByPk(prodId)
  .then(product=>{
    product.title=updatedTitle;
    product.price=updatedPrice;
    product.imageUrl=updatedImageUrl;
    product.description=updatedDesc;
    return product.save();
  })
  .then(result=>{
    console.log("updated sucesfully");
  })
  .catch(err=>console.log(err));
  res.redirect('/admin/products');
  // const updatedProduct = new Product(
  //   prodId,
  //   updatedTitle,
  //   updatedImageUrl,
  //   updatedDesc,
  //   updatedPrice
  // );
  // updatedProduct.save();
  // res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
//sequelize method
req.user.getProducts()
  //Product.findAll()-instead we are using sequelize getProduct()
  .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => {
    console.log(err);
  });
  // Product.fetchAll(products => {
  //   res.render('admin/products', {
  //     prods: products,
  //     pageTitle: 'Admin Products',
  //     path: '/admin/products'
  //   });
  // });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
  .then(products=>{
    return products.destroy();
  })
  .then(product=>{
    console.log("deleted!");
    res.redirect('/admin/products');

  })
  .catch(err => {
    console.log(err);
  });
};
