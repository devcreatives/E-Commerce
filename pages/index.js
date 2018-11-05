import React from 'react';//import library react
import Topbar from '../components/topBar';//import topBar 
import Product from './showProduct';//import products from showProduct file
import Link from 'next/link';
export default class extends React.Component{//this default class will extends react component 
      render(){//render() will render the elements in browser
        return(//return() will return those elements
            <main>  {/*main content*/}
            <Topbar/>
            <Product/>
            </main>
        );

    }
}