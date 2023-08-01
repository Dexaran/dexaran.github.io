import React, { Component } from "react";
import {NavLink} from "react-router-dom";
import styled from 'styled-components';

class Header extends Component {
  render() {
    return (
      <StyledWrapper>
        
        <div className="container py-5">
        <div className="hover">
            <NavLink to="/"><h1 class="title">Universe X</h1></NavLink>
        
        </div>
        </div>
      </StyledWrapper>
    );
  }
}
 
export default Header;

const StyledWrapper = styled.div`

.active{
  text-decoration:none;
}
}
`