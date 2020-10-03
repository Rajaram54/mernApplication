import React, { Fragment, useEffect } from 'react';
import './App.css';
import NavBar from './components/layouts/Navbar';
import Landing from './components/layouts/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import CreateProfile from './components/profile-form/CreateProfile';
import Dashboard from './components/dashboard/Daskboard';
import PrivateRoutes from './components/routes/PrivateRoutes';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import store from './store';
import { Provider } from 'react-redux';
import Alerts from './components/layouts/Alerts';
import setToken from './Utils/setUserToken';
import { setUser } from './actions/auth';

if (localStorage.token) {
  setToken(localStorage.token);
}
const App = () => {
  useEffect(() => {
    store.dispatch(setUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <NavBar />
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alerts />
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <PrivateRoutes exact path="/dashboard" component={Dashboard} />
              <PrivateRoutes exact path="/create-profile" component={CreateProfile} />
              
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  )
};

export default App;
