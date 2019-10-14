import React from 'react';//import library react
import Head from '../components/head';//import head.js component file
import Appbar from 'muicss/lib/react/appbar';//import appbar from muicss library
import Form from 'muicss/lib/react/form';//import from from muicss library
import Button from 'muicss/lib/react/button';//import button from muicss library
import Product from './showProduct';//import products from showProduct file
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { bubble as Menu } from 'react-burger-menu';
import _ from 'lodash';
export default class extends React.Component {//this default class will extends react component
  constructor(props) {
    super(props);
    this.state = { category: [], data: [], addToCart: [] }
  }

  showImage(a, Id) {
    if (a > 0) {
      return (<img src='../static/available-now.png' width={'60'} className="inStock" />)
    }
    else {
      let cartDelete = this.state.addToCart;
      let newArray;
      let counter = 0;
      cartDelete.map((response, index) => {
        if (response._id === Id) {
          cartDelete.splice(index);
          counter++;
        }
      })
      if (counter > 0) {
        localStorage.setItem("addToCartItems", JSON.stringify(cartDelete));
      }
      return (<img src='../static/out-of-stock.png' width={'50%'} className="outStock" />)
    }
  }

  renderAddToCart() {
    if (this.state.addToCart.length > 0) {
      window.location = "./addToCart?status=none";
    }
    else {
      toast.info("No Product In The Cart !!", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  }

  addToCart(product, e) {
    console.log('invoked');
    e.preventDefault();
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


  componentWillMount() {
    axios.get('/product').then((response) => {
      this.setState({ data: response.data }, function () {
      })
    })
  }

  componentDidMount() {
    var cartJSON = JSON.parse(localStorage.getItem("addToCartItems"));
    if (cartJSON === null) {
      this.setState({ addToCart: [] });
      document.getElementById('addToCartLength').innerHTML = '0'
    }
    else {
      this.setState({ addToCart: cartJSON });
      document.getElementById('addToCartLength').innerHTML = cartJSON.length;
    }
    axios.get('/category').then((response) => {
      for (var i = 0; i < response.data.length; i++) {
        this.state.category.push(response.data[i].category);
      }
      this.setState({ category: _.uniq(this.state.category) })
    });
  }

  showProduct(a) {
    var array = [];
    if (a === 'Recent') {
      axios.get('/product').then((response) => {
        this.setState({ data: response.data }, function () {
        })
      })
    }
    else {
      axios.get('/product').then((response) => {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].category === a) {
            console.log(response.data[i]);
            array.push(response.data[i]);
          }
        }
        if (array.length != 0) {
          this.setState({ data: array });
        }
      })
    }
  }

  render() {//render() will render the elements in browser
    return (//return() will return those elements
      <main>
        <input type="image" src="./static/addToCart.png" onClick={this.renderAddToCart.bind(this)} width={'50px'} id="addToCartImage" />
        <h3 id="addToCartLength"></h3>
        <h3>
          <ToastContainer autoClose={2000} />
        </h3>
        <div id="MenuOverflow">
          <h2>Category</h2>
          <hr />
          <a className='freeMenu' data-id='Recent' onClick={this.showProduct.bind(this, 'Recent')}>All</a>
          {
            this.state.category.sort().map((response, i) => {
              return (<main><br /><hr /><a className='freeMenu' data-id={response} onClick={this.showProduct.bind(this, response)} key={response}>{response}</a></main>)
            })
          }
        </div>
        <div id="product">
          {
            this.state.data.reverse().map((response, i) => {
              return (
                <div className="showProduct col-xl-10 col-lg-10 col-md-7 col-sm-7 col-xs-7" key={i}>
                  {this.showImage(response.stockItem, response._id)}
                  <img src={response.image} width={'420px'} height={'300px'} />
                  <div className="card-body" key={response.name}>
                    <h3 className="card-title" key={response.name}>{response.name}</h3>
                    <h3 className="card-text" key={response.price}>{response.price}</h3>
                    <button className="btn btn-primary btn-lg btn-block" onClick={this.addToCart.bind(this, response)} id={response._id}>Add To Cart</button>
                  </div>
                </div>)
            })
          }
        </div>
      </main>
    );

  }
}