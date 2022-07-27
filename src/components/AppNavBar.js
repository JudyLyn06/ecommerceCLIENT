import React, { useContext } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import UserContext from '../UserContext';

export default function AppNavBar(){

    const { user } = useContext(UserContext);

    return(
        <Navbar bg="secondary" variant="dark" expand="lg">
          <Link className="navbar-brand" to="/">The Zuitt Shop</Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <Link className="nav-link" to="/products">
                    {user.isAdmin === true
                        ?
                        <span>Admin Dashboard</span>
                        :
                        <span>Products</span>
                    }   
                </Link>
            </Nav>
            <Nav className="ms-auto">
                {user.id !== null
                    ? user.isAdmin === true
                        ? <Link className="nav-link" to="/logout">Log Out</Link>
                        :
                        <React.Fragment>
                            <Link className="nav-link" to="/cart">Cart</Link>
                            <Link className="nav-link" to="/orders">Orders</Link>
                            <Link className="nav-link" to="/logout">Log Out</Link>
                        </React.Fragment>
                    :
                    <React.Fragment>
                        <Link className="nav-link" to={{pathname: '/login', state: { from: 'navbar'}}}>Log In</Link>
                        <Link className="nav-link" to="/register">Register</Link>
                    </React.Fragment>
                }               
            </Nav>
          </Navbar.Collapse>
        </Navbar>
    )
}
