import React from 'react';//import library react
import Head from '../components/head';//import head.js component file
import Link from 'next/link';
import Appbar from 'muicss/lib/react/appbar';//import appbar from muicss library
import Input from 'muicss/lib/react/input';//import input from muicss library
import Form from 'muicss/lib/react/form';//import from from muicss library
import Button from 'muicss/lib/react/button';//import button from muicss library
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: this.props.url.query };
        this.showInput = this.showInput.bind(this);
    }
    showCheckbox() {
        if (this.state.data.inStock == "on") {
            return (<input type="checkbox" name="inStock" defaultChecked />)
        }
        else {
            return (<input type="checkbox" name="inStock" />)
        }
    }
    showInput() {
        if (this.state.data.inStock == "on") {
            return (<Input type="number" name="stockItem" min="1" defaultValue={this.state.data.stockItem} id="stockItem" />)
        }
        else {

            return (<Input type="number" name="stockItem" min="1" defaultValue={this.state.data.stockItem} id="stockItem" />)
        }
    }
    removeImage(e) {
        alert("Image Deleted Please Click Update");
        e.preventDefault();
        document.getElementById("imageURL").value = "";
    }
    render() {
        return (
            <main>
                <Head />
                <h1>Edit Product</h1>
                <form method="post" action="/productUpdate" encType="multipart/form-data">
                    <input type="hidden" value={this.state.data.id} name="UserId" />
                    <Input type="text" name="name" defaultValue={this.state.data.name} required />
                    <Input type="number" min="1" name="price" defaultValue={this.state.data.price.slice(3)} required />
                    <select defaultValue={this.state.data.category} name="select" required>
                        <option value="Shirt">Shirt</option>
                        <option value="T-Shirt">T-Shirt</option>
                        <option value="Jacket">Jacket</option>
                        <option value="Shoes">Shoes</option>
                    </select>
                    <br />
                    <br />
                    <input type="hidden" name="productImageURL" id="imageURL" defaultValue={this.state.data.image} />
                    <button className="btn btn-info btn-lg" onClick={this.removeImage.bind(this)}> Remove Product Image</button>
                    <br />
                    <br />
                    <input type="file" name="productImage" accept="image/*" />
                    <br />
                    <br />
                    {this.showCheckbox()}
                    <label id="inStock"> In Stock </label>
                    {this.showInput()}
                    <Button color="primary" className="btn-block">Update Product</Button>
                </form>
                <br />
                <Link><a className="btn btn-info btn-lg btn-block" href="./editDeleteProduct">Back</a></Link>
            </main>
        )
    }
} 