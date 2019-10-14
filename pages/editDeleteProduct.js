import React from 'react';//import library react
import Head from '../components/head';//import head.js component file
import Link from 'next/link';
import axios from 'axios';
import Appbar from 'muicss/lib/react/appbar';//import appbar from muicss library
import Input from 'muicss/lib/react/input';//import input from muicss library
import Form from 'muicss/lib/react/form';//import from from muicss library
import Button from 'muicss/lib/react/button';//import button from muicss library
export default class extends React.Component {//this default class will extends react component
    constructor(props) {
        super(props);
        this.state = { data: [] }

    }
    componentWillMount() {
        axios.get('/product').then((response) => {
            this.setState({ data: response.data }, function () {
            })
        })
    }

    warningDelete(Id) {
        var deleteProduct = confirm('Are You Sure ?');
        if (deleteProduct == true) {
            window.location = "./deleteProduct/?id=" + Id;
        }
        else {
            window.location = "./editDeleteProduct";
        }
    }

    render() {//render() will render the elements in browser
        return (//return() will return those elements
            <main>{/*main content*/}
                <Head />
                <Appbar>
                    <br />
                    <h1 id="title">E-Commerce Website</h1>
                </Appbar>
                <Form method="post" action="/logout" >
                    <Button color="primary">Logout</Button>
                </Form>
                <form method="get" action="/addProductAdmin" >
                    <Button color="danger">Back</Button>
                </form>
                <div id="product">
                    {
                        this.state.data.reverse().map((response, i) => {
                            return (
                                <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-xs-12 " key={i}>
                                    <img src={response.image} width={'420px'} height={'300px'} />
                                    <div className="card-body" key={response.name}>
                                        <h3 className="card-title" key={response}>{response.name}</h3>
                                        <h3 className="card-text" key={response.price}>{response.price}</h3>
                                        <br />
                                        <div id="productData">
                                            <input type="text" defaultValue={response._id} name="id" />
                                            <input type="text" defaultValue={response.name} name="name" />
                                            <input type="text" defaultValue={response.price} name="price" />
                                            <input type="text" defaultValue={response.image} name="image" />
                                            <input type="text" defaultValue={response.stockItem} name="stockItem" />
                                            <input type="text" defaultValue={response.inStock} name="inStock" />
                                        </div>
                                        <Link><a className="btn btn-danger btn-lg btn-block" href={"/editProductForm?id=" + response._id + "&name=" + response.name + "&image=" + response.image + "&price=" + response.price + "&stockItem=" + response.stockItem + "&inStock=" + response.inStock + "&category=" + response.category}>Edit Product</a></Link>
                                        <br />
                                        <button className="btn btn-info btn-lg btn-block" onClick={this.warningDelete.bind(this, response._id)}>Delete Product</button>
                                    </div>
                                </div>)
                        })
                    }
                </div>
            </main>
        )
    }
}
