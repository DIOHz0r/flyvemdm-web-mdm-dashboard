/*
*   Copyright © 2018 Teclib. All rights reserved.
*
*   This file is part of web-mdm-dashboard
*
* web-mdm-dashboard is a subproject of Flyve MDM. Flyve MDM is a mobile
* device management software.
*
* Flyve MDM is free software: you can redistribute it and/or
* modify it under the terms of the GNU General Public License
* as published by the Free Software Foundation; either version 3
* of the License, or (at your option) any later version.
*
* Flyve MDM is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* ------------------------------------------------------------------------------
* @author     Gianfranco Manganiello (gmanganiello@teclib.com)
* @author     Hector Rondon (hrondon@teclib.com)
* @copyright  Copyright © 2018 Teclib. All rights reserved.
* @license    GPLv3 https://www.gnu.org/licenses/gpl-3.0.html
* @link       https://github.com/flyve-mdm/web-mdm-dashboard
* @link       http://flyve.org/web-mdm-dashboard
* @link       https://flyve-mdm.com
* ------------------------------------------------------------------------------
*/

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { I18n } from 'react-i18nify'
import Loading from '../../components/Loading'
import ConstructInputs from '../../components/Forms'
import withAuthenticationLayout from '../../hoc/withAuthenticationLayout'
import {
    changeNotificationMessage,
    fetchCaptcha,
    fetchSignUp
} from '../../store/authentication/actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { buildDataArray, changeState, handleSubmitForm } from './actions'
import publicURL from '../../shared/publicURL'

function mapDispatchToProps(dispatch) {
    const actions = {
        fetchCaptcha: bindActionCreators(fetchCaptcha, dispatch),
        fetchSignUp: bindActionCreators(fetchSignUp, dispatch),
        changeNotificationMessage: bindActionCreators(changeNotificationMessage, dispatch)
    }
    return { actions }
}

function mapStateToProps(state, props) {
    return {
        isLoading: state.ui.loading,
        type: state.ui.notification.type,
        captcha: state.auth.captcha,
        configurationPassword: state.auth.configurationPassword
    }
}

class SignUp extends PureComponent {

    constructor (props) {
        super(props)
        this.state = {
            email: '',
            login: '',
            realName: '',
            password: '',
            passwordConfirmation: '',
            captchaValue: '',
            forceValidation: false,
        }
        
        this.handleSubmitForm = event => handleSubmitForm(this, event)
        this.changeState = () => changeState(this)
        this.buildDataArray = () => buildDataArray(this, I18n)
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
        if (this.props.type === 'success') {
            this.props.history.push(`${publicURL}/validateAccount`)
        }
    }
    
    componentDidMount() {
        this.props.actions.fetchCaptcha()
    }

    render() {
        let renderComponent 
        if (this.props.isLoading) {
            renderComponent = <div style={{ height: '140px' }}><Loading message={`${I18n.t('commons.loading')}...`}/></div>
        } else {
            const user = this.buildDataArray()
            renderComponent = (
                <React.Fragment>
                    <h2 style={{textAlign: 'center'}}>
                        { I18n.t('create_account.title') }
                    </h2>

                    <form onSubmit={(event) => this.handleSubmitForm(event)}>
                        <ConstructInputs data={user.personalInformation} />
                        <ConstructInputs data={user.passwordInformation} />
                        <ConstructInputs data={user.captchaInformation } />
                        <div className="authentication__captcha-img">
                            <img src={this.props.captcha ? this.props.captcha.img : null } alt='Captcha' />
                        </div>
                        <div className="authentication__captcha-refresh" onClick={this.props.actions.fetchCaptcha} >
                            <span className="refreshIcon" />
                            <span>{I18n.t('login.refresh_captcha')}</span>
                        </div>
                        <div style={{textAlign: 'center'}}>
                            <button className='btn btn--primary' style={{ margin: "20px" }}>
                                { I18n.t('commons.register') }
                            </button>
                            <p>
                                { I18n.t('create_account.already_have_account') }
                                &#160;
                                <Link to={`${publicURL}`}>
                                    { I18n.t('commons.sign_in') }
                                </Link>
                            </p>
                        </div>

                    </form>
                </React.Fragment>
            )
        }

        return renderComponent
    }
}

SignUp.defaultProps = {
    captcha: {}
}

SignUp.propTypes = {
    history: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withAuthenticationLayout(SignUp, {contentCenter: true}))