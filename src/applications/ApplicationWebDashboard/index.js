import React, { Component } from 'react'
import { Switch } from 'react-router-dom'
import { Route } from 'react-router'

import PrivateRoute from '../../components/PrivateRoute'

import SignIn from '../../containers/SignIn'

import asyncAdminDashboard from './asyncComponents/asyncAdminDashboard'
import asyncLogout from './asyncComponents/asyncLogout';
import asyncSignUp from './asyncComponents/asyncSignUp';

import withI18NTranslation from '../../hoc/withI18NTranslation'
import asyncValidateAccount from './asyncComponents/asyncValidateAccount';
import asyncForgotPassword from './asyncComponents/asyncForgotPassword';


/**
 * Main Component in the React Tree
 * This Render each route of the containers or / and components like 404
 */
class ApplicationWebDashboard extends Component {
  render () {
    return (
      <Switch>
        <Route exact path='/' component={SignIn} /> 
        <Route exact path='/signUp' component={asyncSignUp} />
        <Route exact path='/validateAccount' component={asyncValidateAccount} />
        <Route exact path='/forgotPassword' component={asyncForgotPassword} />
        <PrivateRoute exact path="/app" component={asyncAdminDashboard} />
        <PrivateRoute exact path="/logout" component={asyncLogout} />
      </Switch>    
    )
  }
}

export default withI18NTranslation(ApplicationWebDashboard)