import React from 'react';//Importing react
import Head from 'next/head';//Importing head from next.js

export default class extends React.Component{//This class extends react components 

    render(){//render() is use to show the data on frontend 
       
        return(// return() returns the element 
            
            <Head>
<title>E Commerce Website</title>  
<link rel="icon" href="../static/favicon.png" type="image/gif" sizes="16x16"/>             
<link href="//cdn.muicss.com/mui-0.9.28/css/mui.min.css" rel="stylesheet" type="text/css" media="screen" />
<link href="../static/style.css" rel="stylesheet" type="text/css"/>
<link href="../static/ReactToastify.css" rel="stylesheet" type="text/css"/>
<script src="https://code.jquery.com/jquery-3.1.1.slim.min.js" ></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" ></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" ></script>
<script src="https://sdk.accountkit.com/en_US/sdk.js"></script>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css"/>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-social/5.1.1/bootstrap-social.min.css"/>
            </Head>

        )
        
    }
}
