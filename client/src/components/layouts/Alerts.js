import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

const Alerts = ({ alerts }) => (alerts!== null && alerts && alerts.map((val) => (
    <div key={val.id} className={`alert alert-${val.alertType}`}>
        {val.msg}
    </div>
)));

Alerts.propTypes = {
    alerts: PropTypes.array.isRequired
};

const mapToProps = state => ({
    alerts: state.alert
});
export default connect(mapToProps)(Alerts);
