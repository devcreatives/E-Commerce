import React from 'react';//import library react
import Head from '../components/head';//import head.js component file
import Appbar from 'muicss/lib/react/appbar';//import appbar from muicss library
import Form from 'muicss/lib/react/form';//import from from muicss library
import Button from 'muicss/lib/react/button';//import button from muicss library
import Product from './showProduct';//import products from showProduct file
import Input from 'muicss/lib/react/input';//import input from muicss library
import Link from 'next/link';
import {ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { bubble as Menu } from 'react-burger-menu';
import _ from 'lodash';
export default class extends React.Component{//this default class will extends react component 

  constructor(props)
  {
    super(props);
    this.state = {addToCart:[],notLoggedIn:this.props.url.query.status}
    this.showImage = this.showImage.bind(this);
    this.checkArray = this.checkArray.bind(this);
    this.removeItemCart = this.removeItemCart.bind(this);
    this.saveRemoveItemCart = this.saveRemoveItemCart.bind(this);
  }

  componentDidMount()
  {
      let data = JSON.parse(localStorage.getItem("addToCartItems"));
      console.log(data);
      this.setState({addToCart:data});
  }

  showImage(a)
  {
    if(a=="on")
    {
 return( <img src='../static/available-now.png' width={'60'} className="inStock"/>)
    }
  }

  clearItem()
  {
    localStorage.removeItem("addToCartItems");
    window.location="./loggedIn";
  }

  removeItemCart(Id)
  {
    var Array = this.state.addToCart;
    if(Id==Array.length)
    {
      Array.pop();
    }
    else if(Id>Array.length)
    {
      Array.shift();
    }
    else
    {
    Array.splice(Id,1);
    }
    console.log(Array);
    this.saveRemoveItemCart();
  }
  saveRemoveItemCart()
  {
    var Array =JSON.stringify(this.state.addToCart);
    localStorage.setItem("addToCartItems",Array);
  }
  removeItem(Id,name,e)
  {
    console.log("Array "+this.state.addToCart.length);
    console.log("Id "+Id);
      toast.success("Removing "+name+" From Cart !!", {
        position: toast.POSITION.TOP_RIGHT
       });
      this.removeItemCart(Id);
      this.checkArray(Id);
  }
  checkArray(Id)
  {
    var Array = this.state.addToCart;
    if(Array.length==0 && this.state.notLoggedIn === "none")
    {
      window.location="./";
    }
    else if(Array.length==0 && this.state.notLoggedIn !== "none")
    {
      window.location="./loggedIn";
    }
    else
    {
      $("#"+Id).hide();
    }
  }

  checkButton()
  {
    if(this.state.notLoggedIn === "none")
    {
      return(
        <main>
        <form method="get" action="/" >
        <Button className="btn btn-warning">Back</Button>
        </form>
        </main>)
    }
    else
    {
      return(
      <main>
        <Menu>
            <Button color="primary" onClick={this.clearItem.bind(this)}>Remove All Item</Button>
            <br/>
            <br/>
            <hr/>
            <br/>
      <form method="get" action="/loggedIn" >
      <Button className="btn btn-error btn-block">Back</Button>
      </form>
      <br/>
      <br/>
      <hr/>
      <br/>
      <form method="post" action="/logout" >
      <Button color="danger" className="btn btn-block">Logout</Button>
      </form>
      </Menu>
      </main>)
    }
  }

  lastButton(response,i)
  {
    if(this.state.notLoggedIn === "none")
    {
      return(
        <main>
              <button className="btn btn-success btn-lg btn-block" onClick={this.removeItem.bind(this,i,response.name)}>Remove Item </button>
       </main>
      )
    }
    else
    {
      return(<main>
             <Input type="number" min='1' max={response.stockItem} key={response.stockItem+1}  name="inputStockItem" id="inputStockItem" hint="Enter Stock Item" required/>
                     <button className="btn btn-success btn-lg btn-block" onClick={this.removeItem.bind(this,i,response.name)}>Remove Item </button>
                     <br/>
                     <Link><a className="btn btn-danger btn-lg btn-block" href={"/productDetails?id="+response._id+"&name="+response.name+"&image="+response.image+"&price="+response.price+"&stockItem="+response.stockItem+"&inStock="+response.inStock}>Details</a></Link>
            </main>)
    }
  }

    render(){//render() will render the elements in browser
        return(//return() will return those elements
          <main>{/*main content*/}
          <Head/>
          <Appbar>
                  <br/>
            <h1 id="title">E-Commerce Website</h1>
            {this.checkButton()}
            </Appbar>
            <h3>
            <ToastContainer autoClose={2000}/>
            </h3>
            <hr/>
            <div id="addToCartProduct">
            {
                this.state.addToCart.reverse().map((response,i) =>
                {
              return(
                     <div className="row" id="addToCartSingle" key={i}>
                     <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 " id={i} key={i}>
                     {this.showImage(response.inStock)}
                     <img src={response.image} width={'420px'}/>
                     <div className="card-body" key={response.name}>
                     <h3 className="card-title" key={response.name}>{response.name}</h3> 
                     <h3 className="card-text" key={response.price}>{response.price}</h3>
                     <br/>
                     <div id="productData">
                     <input type="text" defaultValue={response._id} name="id"/>
                     <input type="text" defaultValue={response.name} name="name"/>
                     <input type="text" defaultValue={response.price} name="price"/>
                     <input type="text" defaultValue={response.image} name="image"/>
                     <input type="text" defaultValue={response.stockItem} name="stockItem"/>
                     <input type="text" defaultValue={response.inStock} name="inStock"/>
                     </div>
                     {this.lastButton(response,i)}
                     </div>
                     </div>
                     </div>)
                })
            }
            </div>
              <hr/>
          </main>
        )
    }
}
