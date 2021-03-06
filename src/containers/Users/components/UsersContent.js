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
import ContentPane from '../../../components/ContentPane'
import IconItemList from '../../../components/IconItemList'
import Confirmation from '../../../components/Confirmation'
import Loading from '../../../components/Loading'
import { I18n } from "react-i18nify"
import itemtype from '../../../shared/itemtype'
import getID from '../../../shared/getID'
import publicURL from '../../../shared/publicURL'

export default class UsersContent extends PureComponent {

    constructor (props) {
        super(props)
        this.state = {
            id: getID(this.props.history.location.pathname),
            data: undefined,
            emails: []
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.id !== getID(nextProps.history.location.pathname)) {
            return {
                id: getID(nextProps.history.location.pathname),
                data: undefined,
                emails: []
            }
        } else {
            return {
                ...prevState
            }
        }
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
        if (prevState.id !== this.state.id) {
            this.handleRefresh()
        }
    }

    handleDelete = async () => {
        const isOK = await Confirmation.isOK(this.contentDialog)
        if (isOK) {

            let itemListToDelete = this.props.selectedItems.map((item) => {
                return {
                    id: item["User.id"]
                }
            })

            this.setState({
                isLoading: true
            })
            
            try {
                await this.props.glpi.deleteItem({ itemtype: itemtype.User, input: itemListToDelete })
                this.props.setNotification({
                    title: I18n.t('commons.success'),
                    body: I18n.t('notifications.elements_successfully_removed'),
                    type: 'success'
                })
                this.props.changeAction('reload')            
                this.props.changeSelectionMode(false)
                this.props.history.push(`${publicURL}/app/users`)
            } catch (error) {                
                this.props.setNotification(this.props.handleMessage({ type: 'alert', message: error }))
            }
            
        }
    }

    componentDidMount() {
        this.handleRefresh()
    }

    handleRefresh = async () => {
        try {
            const user = await this.props.glpi.getAnItem({
                itemtype: itemtype.User,
                id: this.state.id
            }) 

            const emails = await this.props.glpi.getSubItems({
                itemtype: itemtype.User,
                id: this.state.id,
                subItemtype: 'UserEmail'
            })
            this.setState({ 
                data: user,
                emails 
            })
        } catch (error) {
            this.props.setNotification(this.props.handleMessage({ type: 'alert', message: error }))
            this.props.history.push(`${publicURL}/app/users`)
        }
    }

    render() {
        let renderComponent 
        if (!this.state.data) {
            renderComponent = <Loading message={`${I18n.t('commons.loading')}...`}/>
        } else {
            let imageProfile = this.state.data.picture ? this.state.data.picture : "profile.png"
            renderComponent = (
                <React.Fragment>
                    <div className="content-header">
                        <div className="item-info">
                            <IconItemList image={imageProfile} size={100} />
                            <div>
                                <div className="item-info__name">
                                    <b>
                                        {this.state.data.name}
                                    </b>
                                </div>
                                
                                <span className="item-info__message" >
                                    {this.state.data.realname}
                                </span>
                                <br />
                                <span className="item-info__source">
                                    {I18n.t('commons.joined')} {this.state.data.date_creation}
                                </span>
                                <br />
                                <span
                                    className="editIcon"
                                    style={{ padding: '0 10px', fontSize: '20px' }}
                                    onClick={() => this.props.history.push(`${publicURL}/app/users/${this.state.id}/edit`)}
                                />
                                <span
                                    className="deleteIcon"
                                    style={{ padding: '0 10px', fontSize: '20px', display: this.props.selectedItems.length === 0 ? 'none' : '' }}
                                    onClick={this.handleDelete}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="separator" />
                    <div className="content-info">
                        <ul>
                            <li>
                                <span className="phoneIcon" />
                                <div>
                                    <a href={this.state.data.mobile ? "tel:" + this.state.data.mobile : "#call"}>
                                        {I18n.t('commons.call_mobile')}
                                    </a>
                                    <div>
                                        {this.state.data.mobile ? this.state.data.mobile : I18n.t('commons.not_available')}
                                    </div>
                                </div>
                            </li>
                            <li>
                                <span className="phoneIcon" />
                                <div>
                                    <a href={this.state.data.phone2 ? "tel:" + this.state.data.phone2 : "#call"}>
                                        {I18n.t('commons.call_work')}
                                    </a>
                                    <div>
                                        {this.state.data.phone2 ? this.state.data.phone2 : I18n.t('commons.not_available')}
                                    </div>
                                </div>
                            </li>
                            <li>
                                <span className="emailIcon" />
                                <div>
                                    <a href={this.state.emails.length > 0 ? "mailto:" + this.state.emails[0]["email"] : "#email"}>
                                        {I18n.t('commons.email')}
                                    </a>
                                    <div>
                                        {this.state.emails.length > 0 ? this.state.emails[0]["email"] : I18n.t('commons.not_available')}
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <Confirmation title={I18n.t('users.delete_one')} message={this.state.data.name} reference={el => this.contentDialog = el} />
                </React.Fragment>
            )
        }
        return (
            <ContentPane>
                { renderComponent }
            </ContentPane>
        ) 
    }
}
UsersContent.propTypes = {
    selectedItems: PropTypes.array,
    changeAction: PropTypes.func.isRequired,
    changeSelectionMode: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    setNotification: PropTypes.func.isRequired,
    glpi: PropTypes.object.isRequired
}
