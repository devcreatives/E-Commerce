import React from 'react';//import library react
import Head from '../components/head';//import head.js component file
import Appbar from 'muicss/lib/react/appbar';//import appbar from muicss library
import Form from 'muicss/lib/react/form';//import from from muicss library
import Button from 'muicss/lib/react/button';//import button from muicss library
import Product from './showProduct';//import products from showProduct file
import Link from 'next/link';
import {ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { bubble as Menu } from 'react-burger-menu';
import _ from 'lodash';
export default class extends React.Component{//this default class will extends react component 

  constructor(props)
  {
    super(props);
    this.state = {data:[],totalProduct:[],product:[],addToCart:[],username:this.props.url.query.username}
    this.showImage = this.showImage.bind(this);
    this.newProductToast = this.newProductToast.bind(this);
    this.greetings = this.greetings.bind(this);
  }

  componentDidMount()
  {  
      this.greetings();
      axios.get('/category').then((response) => {
          for (var i = 0; i < response.data.length; i++) {
            this.setState({data: this.state.data.concat(response.data[i].category)})
          }
          this.setState({data: _.uniq(this.state.data)})
        });
        axios.get('/product').then((response)=>{
          this.setState({product:response.data,totalProduct:response.data},function () {
         })
       })
    var cartJSON = JSON.parse(localStorage.getItem("addToCartItems"));
    if(cartJSON === null)
    {
        this.setState({addToCart:[]}); 
        document.getElementById('addToCartLength').innerHTML ='0'    
    }
    else
    {
    this.setState({addToCart:cartJSON});
    document.getElementById('addToCartLength').innerHTML = cartJSON.length;
    }
      setInterval(this.newProductToast,10000);
}

greetings()
{
    if(this.state.username==undefined)
    {

    }
    else
    {
    toast.error("Welcome User : "+this.state.username, {
        position: toast.POSITION.TOP_LEFT,
        autoClose:false,
        hideProgressBar:true
    });
}
}

newProductToast()
{
    axios.get('/product').then((response)=>{
        if(response.data.length>this.state.totalProduct.length)
        {
        this.setState({totalProduct:response.data},function () {
            toast.info("New Product Added !!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose:false,
                hideProgressBar:true
            });
       })
    }
    else if (response.data.length<this.state.totalProduct.length)
    {
        this.setState({totalProduct:response.data},function () {
        }) 
    }
     })
}

  addToCart(product,e)
  {
      e.preventDefault();
      if(this.state.addToCart != null )
      {
      let counter = 0 ;
      if(product.inStock === "off" || product.stockItem ===  "0")
      {
        toast.error("This item is out of stock", {
            position: toast.POSITION.TOP_RIGHT
          });
      }
    else
    {
      let addToCart = this.state.addToCart;
      if(addToCart.length === 0)
      {
      this.state.addToCart.push(product);
      localStorage.setItem("addToCartItems",JSON.stringify(this.state.addToCart));
      document.getElementById('addToCartLength').innerHTML = this.state.addToCart.length;
      toast.success("Adding "+product.name+" To Cart !!", {
        position: toast.POSITION.TOP_RIGHT
      });
      }
      else
      {
          addToCart.map((response,index) =>
        {
            if(response._id === product._id)
            {
                toast.error("Your Product is already in the cart", {
                    position: toast.POSITION.TOP_RIGHT
                  });
                counter++;
            }
        })
        if(counter === 0)
        {
          this.state.addToCart.push(product);
          localStorage.setItem("addToCartItems",JSON.stringify(this.state.addToCart));
          document.getElementById('addToCartLength').innerHTML = this.state.addToCart.length;
          toast.success("Adding "+product.name+" To Cart !!", {
            position: toast.POSITION.TOP_RIGHT
          });
          counter = 0; 
        }
      }
       }
      }
      else
      {
        this.state.addToCart.push(product);
        localStorage.setItem("addToCartItems",JSON.stringify(this.state.addToCart));
        document.getElementById('addToCartLength').innerHTML = this.state.addToCart.length;
        toast.success("Adding "+product.name+" To Cart !!", {
          position: toast.POSITION.TOP_RIGHT
        });
       }
}

  renderAddToCart()
  {
      if(this.state.addToCart.length>0)
      {
      window.location="./addToCart";
      }
    else
    {
    toast.info("No Product In The Cart !!", {
        position: toast.POSITION.TOP_RIGHT
    });
    }
  }

  showProduct(a)
  {
    var array = [];
    if(a === 'Recent')
    {
        axios.get('/product').then((response)=>{
            this.setState({product:response.data},function () {
           })
         })
    }
    else
    {
    axios.get('/product').then((response)=>{
        for (var i = 0; i < response.data.length; i++) {
            if(response.data[i].category === a)
            {
                console.log(response.data[i]);
                array.push(response.data[i]);
            }
          }
        if(array.length != 0)
        {
            this.setState({product:array});
        }
    })
    }
 }

  showImage(a,Id)
  {
    if(a>0)
    {
        return( <img src='../static/available-now.png' width={'60'} className="inStock"/>)
    }
    else
    {
        let cartDelete = this.state.addToCart;
        let newArray;
        let counter=0;
        cartDelete.map((response,index) =>
          {
              if(response._id === Id)
              {
                  cartDelete.splice(index);
                  counter++;
              }
          })
        if(counter>0)
        {
            localStorage.setItem("addToCartItems",JSON.stringify(cartDelete));
        }
        return( <img src='../static/out-of-stock.png' width={'50%'} className="outStock"/>)  
    }
  }
    render(){//render() will render the elements in browser
        let product = this.state.product;
        if(product.length === 1)
        {
            return(//return() will return those elements
            <main>{/*main content*/}
            <Head/>
            <Appbar>
                    <br/>
              <h1 id="title">E-Commerce Website</h1>
              <input type="image" src="./static/addToCart.png" onClick={this.renderAddToCart.bind(this)} width={'50px'} id="addToCartImage"/>
              <h3 id="addToCartLength"></h3>
              </Appbar>
              <h3>
              <ToastContainer autoClose={2000}/>
              </h3>
              <Menu>
              <a className='b MenuItem' data-id='Recent' onClick={this.showProduct.bind(this,'Recent')}>All</a>
              {
                  this.state.data.sort().map((response,i)=>
                  {
                   return <a className='b MenuItem' data-id={response} onClick={this.showProduct.bind(this,response)} key={response}>{response}</a>
                  })
              }
              </Menu>
              <form method="post" action="/logout" >
              <Button color="danger">Logout</Button>
              </form>
              <hr/>
              <div id="product">
                           <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-xs-12 ">
                           {this.showImage(product[0].stockItem,product[0]._id)}
                           <img src={product[0].image} width={'420px'} height={'300px'}/>
                           <div className="card-body" key={product[0].name}>
                           <h3 className="card-title" key={product[0].name}>{product[0].name}</h3> 
                           <h3 className="card-text" key={product[0].price}>{product[0].price}</h3>
                           <br/>
                           <div id="productData">
                           <input type="text" defaultValue={product[0]._id} name="id"/>
                           <input type="text" defaultValue={product[0].name} name="name"/>
                           <input type="text" defaultValue={product[0].price} name="price"/>
                           <input type="text" defaultValue={product[0].image} name="image"/>
                           <input type="text" defaultValue={product[0].stockItem} name="stockItem"/>
                           <input type="text" defaultValue={product[0].inStock} name="inStock"/>
                           </div>
                           <button className="btn btn-primary btn-lg btn-block" onClick={this.addToCart.bind(this,product[0])} type="submit" id={product[0]._id}>Add To Cart</button>
                           <br/>
                           <Link><a className="btn btn-danger btn-lg btn-block" href={"/productDetails?_id="+product[0]._id+"&name="+product[0].name+"&image="+product[0].image+"&price="+product[0].price+"&stockItem="+product[0].stockItem+"&inStock="+product[0].inStock+"&cartlength="+this.state.addToCart.length}>Details</a></Link>
                           </div>
                           </div>
              </div>
              <hr/>
            </main>
          )
           }
        else
        {
        return(//return() will return those elements
          <main>{/*main content*/}
          <Head/>
          <Appbar>
                  <br/>
            <h1 id="title">E-Commerce Website</h1>
            <input type="image" src="./static/addToCart.png" onClick={this.renderAddToCart.bind(this)} width={'50px'} id="addToCartImage"/>
            <h3 id="addToCartLength"></h3>
            </Appbar>
            <h3>
            <ToastContainer autoClose={2000}/>
            </h3>
            <Menu>
            <a className='b MenuItem' data-id='Recent' onClick={this.showProduct.bind(this,'Recent')}>All</a>
            {
                this.state.data.sort().map((response,i)=>
                {
                    
                 return <a className='b MenuItem' data-id={response} onClick={this.showProduct.bind(this,response)} key={response}>{response}</a>
                })
            }
            <br/>
            <br/>
            <hr/>
            <br/>
            <form method="post" action="/logout" >
            <Button color="danger" className="btn btn-block">Logout</Button>
            </form>
            </Menu>
            <hr/>
            <div id="product">
            {
                    this.state.product.reverse().map((response,i) =>
                    {
                  return(
                         <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-xs-12 " key={i}>
                         {this.showImage(response.stockItem,response._id)}
                         <img src={response.image} width={'420px'} height={'300px'}/>
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
                         <button className="btn btn-primary btn-lg btn-block" onClick={this.addToCart.bind(this,response)} type="submit" id={response._id}>Add To Cart</button>
                         <br/>
                         <Link><a className="btn btn-danger btn-lg btn-block" href={"/productDetails?_id="+response._id+"&name="+response.name+"&image="+response.image+"&price="+response.price+"&stockItem="+response.stockItem+"&inStock="+response.inStock+"&cartlength="+this.state.addToCart.length}>Details</a></Link>
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
}
