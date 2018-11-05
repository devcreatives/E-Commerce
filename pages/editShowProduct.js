import React from 'react';//import library react
import axios from 'axios';//import library axios 
import Head from '../components/head';//Import head components
import Link from 'next/link';
export default class extends React.Component{//this default class will extends react component
    constructor(props)
    {
      super(props);
      this.state = {data:[]}
    }

    componentWillMount()
    {
      axios.get('/product').then((response)=>{
             this.setState({data:response.data},function () {
            })
         })
    }

      render(){//render() will render the elements in browser
        return(//return() will return those elements
            <main>  {/*main content*/}
            <div id="product">
                {
                    this.state.data.reverse().map((response,i) =>
                    {
                  return(
                         <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 " key={response.name}>
                         <img src={response.image} width={'420px'} height={'300px'}/>
                         <div className="card-body" key={response.name}>
                         <h3 className="card-title" key={response.name}>{response.name}</h3> 
                         <h3 className="card-text" key={response.price}>{response.price}</h3>
                         <div id="productData">
                         <input type="text" defaultValue={response._id} name="id"/>
                         <input type="text" defaultValue={response.name} name="name"/>
                         <input type="text" defaultValue={response.price} name="price"/>
                         <input type="text" defaultValue={response.image} name="image"/>
                         <input type="text" defaultValue={response.stockItem} name="stockItem"/>
                         <input type="text" defaultValue={response.inStock} name="inStock"/>
                         </div>
                         <Link><a className="btn btn-primary btn-lg" href="#">Edit</a></Link>
                         </div>
                         </div>)
                    })
                }
            </div>
            </main>
        );

    }
}