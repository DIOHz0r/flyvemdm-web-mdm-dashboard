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
import ChangeDownloadURL from './ChangeDownloadURL'
import ChangeTokenLife from './ChangeTokenLife'
import Main from './Main'
import ContentPane from '../../../../components/ContentPane'
import Loading from '../../../../components/Loading'
import { I18n } from 'react-i18nify'
import withGLPI from '../../../../hoc/withGLPI'
import withHandleMessages from '../../../../hoc/withHandleMessages'
import itemtype from '../../../../shared/itemtype'
import { bindActionCreators } from 'redux'
import { uiSetNotification } from '../../../../store/ui/actions'
import { connect } from 'react-redux'

function mapDispatchToProps(dispatch) {
    const actions = {
        setNotification: bindActionCreators(uiSetNotification, dispatch)
    }
    return { actions }
}


class Entity extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            mode: '', 
            tokenLife: '',
            downloadURL: '',
            entityID: '',
            devicesCurretlymanaged: '',
            fleetsCurrentlyManaged: '',
            filesUploaded: '',
            applicationsUploaded: '',
            numberUsers: '',
            invitationsSent: '',
            typesPolicies: '',
            numberCategoriesForPolicies: ''
        }
    }

    componentDidMount = async () => {
        try {
            const devices = await this.props.glpi.searchItems({ 
                itemtype: itemtype.PluginFlyvemdmAgent
            })
            const applications = await this.props.glpi.searchItems({ 
                itemtype: itemtype.PluginFlyvemdmPackage
            })
            const users = await this.props.glpi.searchItems({ 
                itemtype: itemtype.User
            })
            const invitations = await this.props.glpi.searchItems({ 
                itemtype: itemtype.PluginFlyvemdmInvitation
            })
            const files = await this.props.glpi.searchItems({ 
                itemtype: itemtype.PluginFlyvemdmFile
            })
            const fleets = await this.props.glpi.searchItems({ 
                itemtype: itemtype.PluginFlyvemdmFleet
            })
            const policies = await this.props.glpi.searchItems({ 
                itemtype: itemtype.PluginFlyvemdmPolicy
            })
            const policyCategories = await this.props.glpi.searchItems({ 
                itemtype: itemtype.PluginFlyvemdmPolicyCategory
            })
            const { active_profile } = await this.props.glpi.getActiveProfile()
            let entityID
            if (Array.isArray(active_profile.entities)) {
                entityID = active_profile.entities[0].id
            } else {
                for (const key in active_profile.entities) {
                    if (active_profile.entities.hasOwnProperty(key)) {
                        entityID = `${active_profile.entities[key].id}`
                    }
                }
            }

            let entityconfig = await this.props.glpi.getAnItem({ 
                itemtype: itemtype.PluginFlyvemdmEntityconfig,
                id: entityID
            })

            if (Array.isArray(entityconfig)) entityconfig = entityconfig[0]

            const tokenLifeMatch = entityconfig.agent_token_life.match(/\d+/)

            const downloadURL = entityconfig.download_url

            this.setState({
                isLoading: false,
                entityID: `${entityID}`,
                devicesCurretlymanaged: `${devices.totalcount}`,
                applicationsUploaded: `${applications.totalcount}`,
                numberUsers: `${users.totalcount}`,
                invitationsSent: `${invitations.totalcount}`,
                filesUploaded: `${files.totalcount}`,
                fleetsCurrentlyManaged: `${fleets.totalcount}`,
                typesPolicies: `${policies.totalcount}`,
                numberCategoriesForPolicies: `${policyCategories.totalcount}`,
                tokenLife: tokenLifeMatch ? tokenLifeMatch[0] : 0,
                downloadURL: downloadURL ? downloadURL : "https://"
            })
        } catch (error) {
            this.props.actions.setNotification(this.props.handleMessage({ type: 'alert', message: error }))
        }
    }

    changeMode = (mode) => {
        this.setState({ mode })
    }

    saveValues = (name, value) => {
        this.setState({
            [name]: value
        })
    }

    render () {
        let content
        switch (this.state.mode) {

            case 'change Token life':
                content = (
                    <ChangeTokenLife 
                        changeMode={this.changeMode} 
                        tokenLife={this.state.tokenLife}
                        saveValues={this.saveValues}
                        showNotification={this.props.showNotification}
                        handleMessage={this.props.handleMessage}
                        glpi={this.props.glpi}
                        entityID={this.state.entityID}
                    />
                )
                
            break

            case 'change download URL':
                content = (
                    <ChangeDownloadURL 
                        changeMode={this.changeMode} 
                        downloadURL={this.state.downloadURL} 
                        saveValues={this.saveValues}
                        showNotification={this.props.showNotification}
                        handleMessage={this.props.handleMessage}
                        glpi={this.props.glpi}
                        entityID={this.state.entityID}
                    />
                )

            break
        
            default:
                content = (
                    <ContentPane>
                        <Main
                            tokenLife={this.state.tokenLife} 
                            numberCategoriesForPolicies={this.state.numberCategoriesForPolicies} 
                            typesPolicies={this.state.typesPolicies} 
                            invitationsSent={this.state.invitationsSent} 
                            numberUsers={this.state.numberUsers} 
                            applicationsUploaded={this.state.applicationsUploaded} 
                            filesUploaded={this.state.filesUploaded} 
                            fleetsCurrentlyManaged={this.state.fleetsCurrentlyManaged} 
                            devicesCurretlymanaged={this.state.devicesCurretlymanaged} 
                            entityID={this.state.entityID}  
                            downloadURL={this.state.downloadURL} 
                            changeMode={this.changeMode}
                            handleMessage={this.props.handleMessage}
                        />
                    </ContentPane>
                )
        }

        return (
            this.state.isLoading ? <Loading message={`${I18n.t('commons.loading')}...`}/> :
            (
                <React.Fragment>
                    <h2 style={{margin:10}}>{ I18n.t('settings.entity.title') }</h2> 
                    <div style={{marginTop: '10px', height: "100%"}}>
                        {content}
                    </div>
                </React.Fragment>
            )
        )
    }
}

export default connect(null, mapDispatchToProps)(withGLPI(withHandleMessages(Entity)))