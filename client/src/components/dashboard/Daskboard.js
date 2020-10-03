import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import Spinner from '../layouts/Spinner';
import { getCurrentProfile } from '../../actions/profile';

const Daskboard = ({ getCurrentProfile, auth, profile }) => {

    useEffect(() => {
        getCurrentProfile();
    }, []);

    return profile.loading && profile.profile === null ? (
        <Spinner />) : (
            <Fragment>
                <h1 className="large text-primary"> Dashboard </h1>
                <p className="lead">
                    <i className="fas fa-user">Welcome {auth.user && auth.user.name}</i>
                </p>
               
                    {profile == null ?  <Fragment>
                        <p> You have not setup profile, please create prorfile</p>
                <Link to="/create-profile" className='btn btn-primary my-1'> Create Profile </Link>
                </Fragment>: <p> has</p>}
            </Fragment>
        )
}

Daskboard.propTypes = {
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    getCurrentProfile: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth
});

export default connect(mapStateToProps, { getCurrentProfile })(Daskboard);
