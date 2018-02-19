import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactWinJS from 'react-winjs'
import ContentPane from '../../../components/ContentPane'
import { DangerZone, Main, SystemReport, Applications, Geolocation } from './Sections'

export default class DevicesContent extends Component {

    render() {
        return (
            <ContentPane itemListPaneWidth={this.props.itemListPaneWidth} updateAnimation={true} >
                <ReactWinJS.Pivot>
                    <ReactWinJS.Pivot.Item key="main" header="Main">

                        <Main 
                            selectedItems={this.props.selectedItems}
                            changeAction={this.props.changeAction}
                            changeSelectionMode={this.props.changeSelectionMode}
                            setNotification={this.props.setNotification}
                            history={this.props.history}
                            glpi={this.props.glpi}
                        />

                    </ReactWinJS.Pivot.Item>
                    <ReactWinJS.Pivot.Item key="systemReport" header="System Report">

                        <SystemReport 
                            selectedItems={this.props.selectedItems}
                            glpi={this.props.glpi}
                        />

                    </ReactWinJS.Pivot.Item>
                    <ReactWinJS.Pivot.Item key="applications" header="Applications">
                        
                        <Applications 
                            itemListPaneWidth={this.props.itemListPaneWidth}
                            selectedItems={this.props.selectedItems}
                            glpi={this.props.glpi}
                        />

                    </ReactWinJS.Pivot.Item>
                    <ReactWinJS.Pivot.Item key="geolocation" header="Geolocation">
                        <Geolocation 
                            selectedItems={this.props.selectedItems}
                            changeAction={this.props.changeAction}
                            changeSelectionMode={this.props.changeSelectionMode}
                            setNotification={this.props.setNotification}
                            glpi={this.props.glpi}
                    />
                    </ReactWinJS.Pivot.Item>
                    <ReactWinJS.Pivot.Item key="dangerZone" header="Danger Zone">

                        <DangerZone 
                            selectedItems={this.props.selectedItems}
                            changeAction={this.props.changeAction}
                            action={this.props.action}
                            changeSelectionMode={this.props.changeSelectionMode}
                            setNotification={this.props.setNotification}
                            glpi={this.props.glpi}
                        />

                    </ReactWinJS.Pivot.Item>
                </ReactWinJS.Pivot>
            </ContentPane>
        )
    }
}
DevicesContent.propTypes = {
    itemListPaneWidth: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    action: PropTypes.string,
    changeAction: PropTypes.func.isRequired,
    selectedItems: PropTypes.array.isRequired,
    setNotification: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    glpi: PropTypes.object.isRequired
}