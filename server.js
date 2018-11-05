//Import Libraries
const express = require('express'),//Using Module express for building web application
      next = require('next'),//Using Module next for server-side rendering
      mongoose = require('mongoose'),//Using Module mongoose for Database
      bodyParser = require('body-parser'),//Using Module body-parser for specify the type of the data server use
      cookieParser = require('cookie-parser'),//Using Module cookie-parser for parse the cookie
      session = require('express-session'),//Using Module express-session for create session
      passport = require('passport'),//Using this module for user authentication
      Request  = require('request'),//Using This Module for sending request to server
      Querystring  = require('querystring'),//USing this Module for convert JSON into String
      Guid = require('guid'),//Using this Module for generating GUID (a Web site may generate a GUID and assign it to a user's browser to record and track the session.)
      multer = require('multer'),//Using this Module for upload image's from local path
      stripe = require("stripe")("sk_test_qOTpTPUhYPGyLL9bdR97nqIs");//Using this module for payment gateway
const path = require('path');
const url = require('url');
const cloudinary = require('cloudinary');//Using this module for storing image to cloud 

//Import File's
const User = require('./models/user');//Invoking user.js model
const Admin = require('./models/admin');//Invoking user.js model
const Facebook = require('./models/facebook');//Invoking facebook.js model
const Product = require('./models/product');//Invoking product.js model
const passportConf = require('./config/passport');//Invoking passport.js file
const secret = require('./config/secret');//Invoking secret file


//Cloudinary Configuration
cloudinary.config({
  cloud_name:secret.cloudName,
  api_key:secret.APIKey,
  api_secret:secret.APISecret
})

var csrf_guid = Guid.raw();//Gernerating GUID (global unique identifier) of user browser
const account_kit_api_version = secret.AKVersion;//Facebook Account Kit APP API version 
const app_id = secret.AK_appId;//Facebook Account Kit APP Id
const app_secret = secret.AK_appSecret;//Facebook Account Kit APP secret
const me_endpoint_base_url = secret.AK_userInfo;//URL use to get user information
const token_exchange_base_url = secret.AK_AccessToken;//URL use to get access token  

var information = [];//All User information will be stored in this array

const upload = multer({dest: secret.multerURL})

var productInformation = [];



const dev = process.env.NODE_ENV !== 'production' ;//This means that node environment is in development mode

const port = secret.port;

const app = next({ dir: '.', dev }); //this will call the node pages in developement mode

const handle = app.getRequestHandler();//this will handle request all the pages of next


//Connect to Db
mongoose.connect(secret.database,(err)=>{
    if(err){console.error(err);}
    else{console.log("Database connected");}
})


//When App prepares
app.prepare()//when app prepare do something
.then(() => {
  const server = express(); // Invoke methods of express in server constant

  if (!dev) {
    // Enforce SSL & HSTS in production
    server.use(function(req, res, next) {
      var proto = req.headers["x-forwarded-proto"];
      if (proto === "https") {
        res.set({
          'Strict-Transport-Security': 'max-age=31557600' // one-year
        });
        return next();
      }
      res.redirect("https://" + req.headers.host + req.url);
    });
  }
  
  // Static files
  // https://github.com/zeit/next.js/tree/4.2.3#user-content-static-file-serving-eg-images
  server.use('/static', express.static(path.join(__dirname, 'static'), {
    maxAge: dev ? '0' : '365d'
  }));


   //MIDDLEWARE
  server.use(bodyParser.json())//Calling the data in json format
  server.use(bodyParser.urlencoded({extended: false}))//no url encoded representation
  server.use(cookieParser())//Using Cookie Parser
  server.use(session({//Creating session
    secret: process.env.SESSION_SECRET || secret.key,//this key will use to check user was already logged in 
    resave: false,//Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized:false//Forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified.
  }))
  server.use(passport.initialize())//Initializing Passport.js
  server.use(passport.session())//Using Session in passport.js

  
  server.get('/',(req,res)=>{
      //Check if user is already loggedIn
      if(req.user){
           if(req.user.role=="User")
           {
              return app.render(req,res,'/loggedIn',req.query);//Return loggedIn.js
           }
           else
           {
             return app.render(req,res,'/addProductAdmin',req.query);
           }
      }
      else if(req.session.facebook)
      {
         return app.render(req,res,'/loggedIn',req.query);//Return loggedIn.js
      }
      else{
          return app.render(req,res,'/index',req.query);
      }
  })

  //This API will get facebook account kit information
  server.get('/view',(req,res)=>{
    var view = {
        appId: app_id,
        csrf: csrf_guid,
        version: account_kit_api_version,
      };
      res.send(view);

    })

 //This API will get all the product and after getting it shows to user  
 server.get('/product',(req,res) => {
  Product.find({},(err,product) => {
      if(err){console.error("Error: ",err)}
      else{
        res.json(product);
      }
    })
 })

//This API will get all the product category and after getting it shows to user  
server.get('/category',(req,res) => {
Product.find({},'category',(err,product) => {
    if(err){console.error("Error: ",err)}
    else{
      productInformation = product;
      res.json(product);
    }
  })
})


server.post('/login_success',(req,res) => {
  // CSRF check
  //Cross-Site Request Forgery (CSRF) is an attack that forces an end user to execute unwanted actions on a web application in which they're currently authenticated.
if (req.body.csrf === csrf_guid) {
  
  // Creating session
  req.session.facebook="connect.sid";
  
  var app_access_token = ['AA', app_id, app_secret].join('|');//This kind of access token is needed to modify and read the app settings.. form :- AA|<facebook_app_id>|<app_secret>
  
  var params = {
    grant_type: 'authorization_code',//An authorization code returned from the SDK is intended to be passed to your server, which exchanges it for an access token.
    code: req.body.code,//authorization_code
    access_token: app_access_token
  };
  var token_exchange_url = token_exchange_base_url + '?' + Querystring.stringify(params);//Retrieving User Access Tokens with an Authorization Code.. form:- https://graph.accountkit.com/v1.2/access_token?grant_type=authorization_code&code=<authorization_code>&access_token=AA|<facebook_app_id>|<app_secret>
  Request.get(token_exchange_url, function(err,resp,body) {
    var view = JSON.parse(body);
    var me_endpoint_url = me_endpoint_base_url + '?access_token=' + view.access_token;//Access Token Validation
    Request.get(me_endpoint_url, function(err,resp,body) {
      information = JSON.parse(body);
      Facebook.findOne({userId:information.id},function(err,user){
        if(err){
          console.log('Error');
        }
        if(user){
          res.redirect('/loggedIn');  
        }
        else{
          var user=new Facebook();
          user.userId=information.id;
          user.role='User';
          user.save(function(err){
            if(err){
              throw err;
            }
            else{res.redirect('/signup');}
          });
        }
      })
    });
  }); 

}
else {
  res.send('Sorry Something Went Wrong ');
}
})

//This API will send the information of Facebook User  
server.get('/login_success', (req, res) =>
{
res.send(information);
})

 //This API will post product data  
server.post('/addProduct',upload.single('product'),(req,res) => {
  let url ;
  let str ;
  cloudinary.uploader.upload(req.file.path,function(result)
  {
  var product = new Product();//Call UserModel in var user
  product.name = req.body.name;
  product.price = "Rs."+req.body.price;
  product.category = req.body.select;
  if(req.file==undefined)
  {
    product.image = "./static/No_Image_Available.jpg";
  }
  else
  {
    url = result.url;
    str = url.slice(4);
    product.image = "https"+str;
  } 
  if(req.body.inStock=="on")
    {
    product.inStock = req.body.inStock;
    }
    else
    {
    product.inStock = "off";
    }
    if(req.body.stockItem == "")
    {
    product.stockItem ="undefined";
    }
    else
    {
      product.stockItem = req.body.stockItem;
    }
  product.save((err,user) => {
    if(!err){res.redirect('/editDeleteProduct')}
    else{console.log(err)}
  })
})
})

//This will add admin in database
server.post('/addAdmin',(req,res) => {
  var admin = new Admin();//Call UserModel in var user
  admin.username = req.body.username;
  admin.password = req.body.password;
  admin.role = "Admin";
  admin.save((err,user) => {
      if(err){console.error("Error: ", err)}
      else{res.redirect('/loginAdmin')}
  })
})

//This API will delete the product
server.get('/deleteProduct', function(req, res) {
  Product.findByIdAndRemove(req.query.id, (err, product) => {  if(err){console.error("Error: ", err)}
  else{res.redirect('/editDeleteProduct')} });
});

//This API will update the product
server.post('/productUpdate',upload.single('productImage'), function(req, res) {
  let url ;
  let str ; 
  if(req.file==undefined && req.body.productImageURL != "")
      {
      Product.findOneAndUpdate({_id:req.body.UserId} ,{$set:{name:req.body.name,
        price:"Rs."+req.body.price,category:req.body.select,inStock:req.body.inStock,
        image:req.body.productImageURL,stockItem:req.body.stockItem} }, (err,user) => {
            if(err){console.error("Error: ", err)}
            else{res.redirect('/editDeleteProduct')}
        })
      }
      else if (req.file==undefined && req.body.productImageURL == "")
      {
        Product.findOneAndUpdate({_id:req.body.UserId} ,{$set:{name:req.body.name,
          price:"Rs."+req.body.price,category:req.body.select,inStock:req.body.inStock,
          image:"./static/No_Image_Available.jpg",stockItem:req.body.stockItem} }, (err,user) => {
              if(err){console.error("Error: ", err)}
              else{res.redirect('/editDeleteProduct')}
          })

      }
      else
      {
        cloudinary.uploader.upload(req.file.path,function(result)
        {   
          url = result.url;
          str = url.slice(4);
        Product.findOneAndUpdate({_id:req.body.UserId} ,{$set:{name:req.body.name,
          price:"Rs."+req.body.price,category:req.body.select,inStock:req.body.inStock,
          image:"https"+str,stockItem:req.body.stockItem} }, (err,user) => {
              if(err){console.error("Error: ", err)}
              else{res.redirect('/editDeleteProduct')}
          })
        })
      }
});

//This API will remove the total stock from user input stock item 
server.post('/buyNow', function(req, res) {
  var PriceInRuppees = parseInt(req.body.price.substring(3));
  var PriceInUSD = Math.round((PriceInRuppees/105.41)*100);
  stripe.charges.create({
    amount: PriceInUSD,
    currency: "USD",
    description: req.body.name,
    source:req.body.myToken.id,
  });
  var stockItemAfterTransaction = req.body.totalStockItem - req.body.inputStockItem;
  Product.findOneAndUpdate({_id:req.body.userId} ,{$set:{stockItem:stockItemAfterTransaction} }, (err,user) => {
        if(err){console.error("Error: "+ err)}
        else{
          res.redirect('/loggedIn')}
    })
});

//This API Authenticate user by using passport locale 
  server.post('/loginUser',passport.authenticate('user',{failureRedirect:'/loginUser?status=wrong',failureMessage: "Invalid username or password"}),(req,res) => {
      res.redirect('/loggedIn?username='+req.body.username);
  })

//This API Authenticate admin by using passport locale 
  server.post('/loginAdmin',passport.authenticate('admin',{failureRedirect:'/loginAdmin?status=wrong',failureMessage: "Invalid username or password"}),(req,res) => {
  res.redirect('/addProductAdmin');
})

//This API will create account of users
  server.post('/signup',(req,res) => {
      var user = new User();//Call UserModel in var user
      user.username = req.body.username;
      user.password = req.body.password;
      user.role = "User";
      user.save((err,user) => {
          if(err){res.redirect('/signup?status=wrong')}
          else{res.redirect('/loggedIn?username='+req.body.username)}
      })
  })

        
//This API will delete user session and cookie
   server.post('/logout', (req, res) =>
   {
     res.clearCookie('connect.sid');//Clear The cookie
     req.logout();//delete session of user
     res.redirect('/');
   })

// Default catch-all renders Next app
  server.get('*', (req, res) => {
  // res.set({
  //   'Cache-Control': 'public, max-age=3600'
  // });
  const parsedUrl = url.parse(req.url, true);
  handle(req, res, parsedUrl);
   });

  server.listen(port, (err) => {
  if (err) throw err;
  console.log(`Listening on http://localhost:${port}`);
   });
})