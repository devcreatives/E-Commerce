import React from 'react';//import library react
import Link from 'next/link';
import Form from 'muicss/lib/react/form';//import from from muicss library
import Input from 'muicss/lib/react/input';//import input from muicss library
import Button from 'muicss/lib/react/button';//import button from muicss library
import TopBar from '../components/topBar';//import TopBary
export default class extends React.Component{//this default class will extends react component 
  constructor(props)
  {
    super(props);
    this.state = {status:this.props.url.query.status}
  }
  componentDidMount()
  {
      let status = this.state.status;
      if(status === 'wrong')
      {
          window.alert('This User Already Exist');
      }
  }
    render(){//render() will render the elements in browser
        return(//return() will return those elements
          <main>{/*main content*/}
            <TopBar/>
            <div id="loginUser">
            <Form method='post' action='/signup'>
            <Input id="email" type="text" name="username" hint="Username" required/>
            <Input id="password" type="password" name="password" hint="Password" required/>
            <Button variant="raised">Signup</Button>
            </Form>
            </div>
            <br/>
            <p id="signup">Already have an account ? please <Link href='/loginUser'><a>Login</a></Link></p>
          </main>
        )
    }
}
