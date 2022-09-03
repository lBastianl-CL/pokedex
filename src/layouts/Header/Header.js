import React from "react";
import {Container} from "react-bootstrap";
import {Link} from "react-router-dom";
import logo from "../../assets/images/logo.png";
import "./styles.css";


const Header = () => {
  return (
    <header className="container-header mb-5">
      <Container fluid>
        <div className="text-center">
          <Link to="/">
            <img title="Go to home" alt="Go to home" src={logo} />
          </Link>
        </div>
      </Container>
    </header>
  );
}

export default Header;