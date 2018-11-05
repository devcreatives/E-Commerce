import React from 'react';//import library react
import Head from '../components/head';//import head.js component file
import Link from 'next/link';
import Appbar from 'muicss/lib/react/appbar';//import appbar from muicss library
import Input from 'muicss/lib/react/input';//import input from muicss library
import Form from 'muicss/lib/react/form';//import from from muicss library
import Button from 'muicss/lib/react/button';//import button from muicss library
export default class extends React.Component{//this default class will extends react component
    constructor(props)
    {
        super(props);
        this.showInput = this.showInput.bind(this);
    } 
    
    componentDidMount()
    {
        $("#stockItem").hide();
    }
    showInput()
    {
        $("#stockItem").toggle();     
    }
    render(){//render() will render the elements in browser
        return(//return() will return those elements
          <main>{/*main content*/}
          <Head/>
              <Appbar>
                  <br/>
            <h1 id="title">E-Commerce Website</h1>
            </Appbar>
            <Form method="post" action="/logout" >
            <Button color="primary">Logout</Button>
            </Form>
                <br/>
                <br/>

            <Button type="button" data-toggle="modal" data-target="#MyModal" variant="raised" color="danger">Add Product</Button>
            <div className="modal fade" id="MyModal"  role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
            <div className="modal-content">
            <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Add Product</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
            </div>
            <div className="modal-body">
            <form method="post" action="/addProduct" encType="multipart/form-data">
            <Input type="text" name="name" hint="Name of Product" required/>
            <Input type="number" min="1" name="price" hint="Price of Product In Rupees" required/>
            <select name="select" required>
            <option value="Shirt">Shirt</option>
            <option value="T-Shirt">T-Shirt</option>
            <option value="Jacket">Jacket</option>
            <option value="Shoes">Shoes</option>
            </select>
            <br/>
            <br/>
            <input type="file" name="product" accept="image/*"/>
            <br/>
            <br/>
            <br/>
            <input type="checkbox" name="inStock" onClick={this.showInput}/><label id="inStock"> In Stock </label>
            <Input type="number" name="stockItem" min="1" hint="Number of Item's in Stock" id="stockItem"/>
            <Button color="primary">Add Product</Button>
            </form>
            </div>
            <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
            </div>
            </div>
            </div>
            <br/>
            <br/>
            <Form method="get" action="/editDeleteProduct" >
            <Button color="primary" >Show Product's</Button>
            </Form>
            <br/>
            <Button type="button" data-toggle="modal" data-target="#Modal" variant="raised">Add Admin</Button>
            <div className="modal fade" id="Modal"  role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
            <div className="modal-content">
            <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Add Admin</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
            </div>
            <div className="modal-body">
            <Form method="post" action="/addAdmin" >
            <Input type="text" name="username" hint="Name" required/>
            <Input type="password" name="password" hint="Password" required/>
            <Button color="primary">Add Admin</Button>
            </Form>
            </div>
            <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
            </div>
            </div>
            </div>
          </main>
        )
    }
}
