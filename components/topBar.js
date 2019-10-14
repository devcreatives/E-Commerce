import React from 'react';//import library react
import Head from '../components/head';//import head.js component file 
import Link from 'next/link';
import Appbar from 'muicss/lib/react/appbar';//import appbar from muicss library
import Dropdown from 'muicss/lib/react/dropdown';//import dropdown from muicss library
import DropdownItem from 'muicss/lib/react/dropdown-item';//import dropdown from muicss library
import { bubble as Menu } from 'react-burger-menu';
export default class extends React.Component {//this default class will extends react component 
    render() {//render() will render the elements in browser
        return (//return() will return those elements
            <main>  {/*main content*/}
                <Head />
                <Appbar>
                    <br />
                    <h1 id="title" >E-Commerce Website</h1>
                </Appbar>
                <Menu>
                    <Link href="./"><a className='a btn btn-primary'>Home</a></Link>
                    <hr />
                    <Link href="./loginUser"><a className='a btn btn-danger'>Login As User</a></Link>
                    <hr />
                    <Link href="./loginAdmin"><a className='a btn btn-success'>Login As Admin</a></Link>
                    <hr />
                    <Link href="./signup"><a className='a btn btn-info'>Signup As User</a></Link>
                    <hr />
                </Menu>
            </main>
        );
    }
}