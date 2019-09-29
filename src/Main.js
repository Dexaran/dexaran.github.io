import React, { Component } from "react";
import {
    Route,
    NavLink,
    HashRouter
  } from "react-router-dom";
  import Home from "./Home";
  import HowTo from "./HowTo";
  import Login from "./Login";
  import Header from "./Header";


class Main extends Component {
  render() {
      
    return (
        
        <HashRouter>
            <div>
                <Header />
            <ul className="header">
                <li><NavLink exact to="/">Home</NavLink></li>
                <li><NavLink to="/howto">How To Play</NavLink></li>
                <li><NavLink to="/login">Login</NavLink></li>
            </ul>
            <div className="content">
                <Route exact path="/" component={Home}/>
                <Route path="/howto" component={HowTo}/>
                <Route path="/login" component={Login}/>
            </div>
            </div>
            
        </HashRouter>
   
    );
  }
}
 
export default Main;