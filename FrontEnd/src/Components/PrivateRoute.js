import axios from "axios";
import React, { Component } from 'react'
import { BrowserRouter as Router,Redirect,Route,Switch } from 'react-router-dom';
class PrivateRoute extends Component {
    state = {
      loading: true,
      isAuthenticated: false,
    }
    componentDidMount() {
        axios.get("http://localhost:5000/validate", {withCredentials: true}).then((Response) => {
        this.setState({
          loading: false,
          isAuthenticated: !Response.data.error,
        });
      });
    }
    render() {
      const { component: Component, ...rest } = this.props;
      if (this.state.loading) {
          console.log("Loading!!")
        return <div>LOADING</div>;
      } else {
        return (
          <Route {...rest} render={props => (
            <div>
              {!this.state.isAuthenticated && <Redirect to={{ pathname: "/login", state: { from: this.props.location } }} />}
              <Component {...this.props} />
            </div>
            )}
          />
        )
      }
    }
  }
  export default PrivateRoute