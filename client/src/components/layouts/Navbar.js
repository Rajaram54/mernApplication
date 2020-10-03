import React from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { logout } from '../../actions/auth';

const Navbar = ({auth, logout}) => {

    const guestLinks = (
        <ul>
            <li><Link to="profiles.html">Developers</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
        </ul>
    )

    const authLinks = (
        <ul>
            <li><Link to="/dashboard"><i class="fas fa-user"></i>{'  '} <span className="hide-sm">Dashboard</span></Link></li>
            <li><a onClick={logout}><i class="fas fa-sign-out-alt"></i>{'  '} <span className="hide-sm">Logout</span></a></li>
        </ul>
    )


    return (
        <nav className="navbar bg-dark">
            <h1>
                <a href="index.html"><i className="fas fa-code"></i> DevConnector</a>
            </h1>
           
            {!auth.loading && (<React.Fragment>{  auth.isAuthenticated ?  authLinks : guestLinks }</React.Fragment>)}
        </nav>
    )
}

const mapStateToProps = state => ({
    auth: state.auth
});

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
} 

export default connect(mapStateToProps, {logout})(Navbar);