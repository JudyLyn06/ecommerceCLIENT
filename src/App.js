import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AppNavBar from './components/AppNavBar';
import Home from './pages/Home';
import Register from './pages/Register'
import Login from './pages/Login'
import Logout from './pages/Logout'
import Products from './pages/Products';
import Specific from './pages/Specific';
import MyCart from './pages/MyCart';
import Orders from './pages/Orders';
import Error from './pages/Error';
import './App.css';
import 'bootswatch/dist/cosmo/bootstrap.min.css';
import { UserProvider } from './UserContext';

export default function App() {

    const [user, setUser] = useState({
        id: null,
        isAdmin: null
    });

    useEffect(() => {
        fetch(`${ process.env.REACT_APP_API_URL }/users/details`, {
            headers: { Authorization: `Bearer ${ localStorage.getItem('token') }`}
        })
        .then(res => res.json())
        .then(data => {

            if (typeof data._id !== 'undefined') {
                setUser({ id: data._id, isAdmin: data.isAdmin });
            } else {
                setUser({ id: null, isAdmin: null });
            }
        })

    }, [])

  return (
    <UserProvider value={{user, setUser}}>
        <Router>
            <AppNavBar />
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route exact path="/register" component={Register}/>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/products" component={Products}/>
                <Route exact path="/products/:productId" component={Specific}/>
                <Route exact path="/cart" component={MyCart}/>
                <Route exact path="/orders" component={Orders}/>
                <Route exact path="/logout" component={Logout}/>
                <Route component={Error}/>
            </Switch>
        </Router>
    </UserProvider>
  );
}
