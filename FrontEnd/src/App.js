
//import './App.css';
import { BrowserRouter as Router,Redirect,Route,Switch } from 'react-router-dom';
import Home from './Components/Home/Home'
import Login from './Components/Login/Login'
import Register from './Components/Register/Register'
import axios from 'axios';
import PrivateRoute from './Components/PrivateRoute';
import Dashboard from './Components/Dashboard/Dashboard';
import Ticker from './Components/Ticker/Ticker';
function App() {

  
  // Right now exact component to change later
  return (
    <Router>
      <Switch>
        <Route exact path = "/" component = {Home}/>
        <PrivateRoute exact path = "/dashboard" component = {Dashboard}/>
        <PrivateRoute exact path = "/ticker" component = {Ticker}/>
        <Route exact path = "/login"  component = {Login}/>
        <Route exact path = "/register" component = {Register}/>
      
      </Switch>

      
    </Router>
  );
}

export default App;
