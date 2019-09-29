import React from "react"
import styled from "styled-components";

function Footer () {
    return (
    <footer>
    
    	<section>
        	<div class="footer">
        		<div className="container py-3">
        		<ColumnsFooter>
      				<div className="row">
      					<div class="column">
        					<img src={"../../assets/images/mentee___color--horizontal.png"} class="img-fluid"  class="ml-3" style={{width: "10rem", height: "3.9rem"}} alt="mentee logo">
							</img>					
     						<p>Copyright © 2019 | mentee.network</p>
     					</div>
     					<div class="column">
     						We'd love to hear from you <div></div>
        					<span><a href="mailto:info@mentee.network">info@mentee.network</a></span>
      		 				<p class="site-footer-newsletter appear-fade-up appear-delay--4">
        						<a href="https://mentee.network/"> Subscribe to our newsletter
                				</a>
      						</p>
      					</div>
     				</div>
     			</ColumnsFooter>
     			</div>	
     		</div>
     		
        
  
     	</section>
      </footer>
    )
  }

 
export default Footer

const ColumnsFooter = styled.div`

.row {
  display: flex;
}

.column {
  flex: 50%;
}
.footer{
	
	background-color:black;
	color: white;
    bottom:50%;
    top:50%;
    width:100%;
    left:0;
    position:relative;
}
`