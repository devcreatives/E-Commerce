import React from 'react';
import Head from '../components/head';//import head.js component file
import Appbar from 'muicss/lib/react/appbar';//import appbar from muicss library
import Input from 'muicss/lib/react/input';//import input from muicss library
import Form from 'muicss/lib/react/form';//import from from muicss library
import Button from 'muicss/lib/react/button';//import button from muicss library
import { bubble as Menu } from 'react-burger-menu';
import StripeCheckout from 'react-stripe-checkout';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: this.props.url.query, priceInUSD: 0, addToCart: [] }
    this.inStock = this.inStock.bind(this);
    this.stockItem = this.stockItem.bind(this);
    this.addToCart = this.addToCart.bind(this);
  }

  componentDidMount() {
    if (this.state.data.inStock == "null" || this.state.data.stockItem == "undefined" || this.state.data.stockItem == "" || this.state.data.stockItem == null || this.state.data.stockItem == 0) {
      $('#hide').hide();
    }
    else {
      $('#hide').show();
    }
    var PriceInRuppees = parseInt(this.state.data.price.substring(3))
    var PriceInUSD = (PriceInRuppees / 105.41) * 100;
    this.setState({ priceInUSD: PriceInUSD });
    var cartJSON = JSON.parse(localStorage.getItem("addToCartItems"));
    if (cartJSON === null) {
      this.setState({ addToCart: [] });
      document.getElementById('addToCartLength').innerHTML = '0';
    }
    else {
      this.setState({ addToCart: cartJSON });
      document.getElementById('addToCartLength').innerHTML = cartJSON.length;
    }
  }

  onToken = (token) => {
    axios.post('/buyNow', {
      myToken: token,
      userId: document.getElementById('userId').value,
      totalStockItem: document.getElementById('totalStockItem').value,
      name: document.getElementById('name').value,
      image: document.getElementById('image').value,
      price: document.getElementById('price').value,
      inStock: document.getElementById('inStock').value,
      inputStockItem: document.getElementById('inputStockItem').value
    }).then((response) => {
      window.location.pathname = '/loggedIn';
    })
  }

  handleChange(e) {
    let item = document.getElementById("inputStockItem").value;
    if (item === "") {
      window.alert('Please Provide Stock Item');
      window.location.reload();
    }
    e.preventDefault();
  }

  addToCart(product, e) {
    e.preventDefault();
    console.log(this.state.addToCart);
    if (this.state.addToCart != null) {
      let counter = 0;
      if (product.inStock === "off" || product.stockItem === "0") {
        toast.error("This item is out of stock", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
      else {
        let addToCart = this.state.addToCart;
        if (addToCart.length === 0) {
          this.state.addToCart.push(product);
          localStorage.setItem("addToCartItems", JSON.stringify(this.state.addToCart));
          document.getElementById('addToCartLength').innerHTML = this.state.addToCart.length;
          toast.success("Adding " + product.name + " To Cart !!", {
            position: toast.POSITION.TOP_RIGHT
          });
        }
        else {
          addToCart.map((response, index) => {
            if (response._id === product._id) {
              toast.error("Your Product is already in the cart", {
                position: toast.POSITION.TOP_RIGHT
              });
              counter++;
            }
          })
          if (counter === 0) {
            this.state.addToCart.push(product);
            localStorage.setItem("addToCartItems", JSON.stringify(this.state.addToCart));
            document.getElementById('addToCartLength').innerHTML = this.state.addToCart.length;
            toast.success("Adding " + product.name + " To Cart !!", {
              position: toast.POSITION.TOP_RIGHT
            });
            counter = 0;
          }
        }
      }
    }
    else {
      this.state.addToCart.push(product);
      localStorage.setItem("addToCartItems", JSON.stringify(this.state.addToCart));
      document.getElementById('addToCartLength').innerHTML = this.state.addToCart.length;
      toast.success("Adding " + product.name + " To Cart !!", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  }

  stockItemPriceChange(price) {
    var stockItemPrice = parseInt(document.getElementById('stockItem').value) * price;
    console.log(stockItemPrice);
  }


  inStock(inStock) {
    if (inStock == "off" || inStock == "null") {
      return (
        <div> <h3 id="status" key={inStock}>Not Available</h3>
          <h3 key={this.state.data.stockItem}>Stock Item's : None</h3>
        </div>)
    }
    else {
      if (this.state.data.stockItem == "undefined" || this.state.data.stockItem == "" || this.state.data.stockItem == null) {
        return (<div> <h3 id="status" key={inStock}>Not Available </h3>
          <h3 key={this.state.data.stockItem}>Stock Item : None</h3>
        </div>)
      }
      else {
      }
    }
  }

  stockItem(stockItem) {
    if (this.state.data.inStock == "null" || stockItem == "undefined" || stockItem == "" || stockItem == null || !stockItem || stockItem == 0) {

    }
    else {
      return (
        <form method="post" action="/buyNow" id="form">
          <input type="hidden" name="userId" defaultValue={this.state.data._id} id='userId' />
          <input type="hidden" name="totalStockItem" defaultValue={stockItem} id='totalStockItem' />
          <input type="hidden" name="name" defaultValue={this.state.data.name} id='name' />
          <input type="hidden" name="image" defaultValue={this.state.data.image} id='image' />
          <input type="hidden" name="price" defaultValue={this.state.data.price} id='price' />
          <input type="hidden" name="inStock" defaultValue={this.state.data.inStock} id='inStock' />
          <Input type="number" min='1' max={stockItem} key={stockItem + 1} onChange={this.stockItemPriceChange.bind(this, this.state.priceInUSD)} name="inputStockItem" id="inputStockItem" hint="Enter Stock Item" required />
          <br />
          <button className="btn btn-warning btn-lg" style={{ marginRight: '300px' }} onClick={this.addToCart.bind(this, this.state.data)} type="submit" id={this.state.data._id}>Add To Cart</button>
          <StripeCheckout
            token={this.onToken.bind(this)}
            name={this.state.data.name}
            image={this.state.data.image}
            amount={this.state.priceInUSD}
            currency="USD"
            stripeKey="pk_test_XtG5Y2XAaKEGcmbys4xRqKuw"
            billingAddress={true}
            shippingAddress={true}
          >
            <Button color="primary" onClick={this.handleChange}>Buy Now</Button>
          </StripeCheckout>
        </form>
      )
    }
  }

  renderAddToCart() {
    if (this.state.addToCart.length > 0) {
      window.location = "./addToCart";
    }
    else {
      toast.info("No Product In The Cart !!", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  }

  render() {
    return (
      <main>{/*main content*/}
        <Head />
        <Appbar>
          <br />
          <h1 id="title">E-Commerce Website</h1>
          <input type="image" src="./static/addToCart.png" onClick={this.renderAddToCart.bind(this)} width={'50px'} id="addToCartImage" />
          <h3 id="addToCartLength"></h3>
        </Appbar>
        <Menu>
          <form method="get" action="/loggedIn" >
            <Button className="btn btn-block">Back</Button>
          </form>
          <br />
          <br />
          <form method="post" action="/logout" >
            <Button color="danger">Logout</Button>
          </form>
        </Menu>
        <h3>
          <ToastContainer autoClose={2000} />
        </h3>
        <div id="border"></div>
        <div id="productDetails" className="row">
          <img src={this.state.data.image} id='productImage' />
          <div id="productDetailsBorder" className=" offset-xl-1 col-xl-5 offset-lg-1 col-lg-5 offset-md-1 col-md-5 offset-sm-1 col-sm-5">
            <div key={this.state.data.name}>
              <h2 key={'details'}>Product Detail's</h2>
              <div id="hide">
                <h3 id="status">Available</h3>
                <h3>Stock Item : {this.state.data.stockItem}</h3>
              </div>
              {this.inStock(this.state.data.inStock)}
              <hr />
              <h3 key={this.state.data.name}>Product Name : {this.state.data.name}</h3>
              <h3 key={this.state.data.price}>Product Price : {this.state.data.price}</h3>
              {this.stockItem(this.state.data.stockItem)}
            </div>
          </div>
        </div>
      </main>
    )
  }
}