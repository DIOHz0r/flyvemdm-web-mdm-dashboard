import React, { Component } from "react"
import PropTypes from 'prop-types'
import ReactWinJS from 'react-winjs'
import ItemList from '../ItemList'
import WinJS from 'winjs'
import UsersItemList from './UsersItemList'
import Loading from '../../Utils/Loading'

export default class UsersList extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            layout: { type: WinJS.UI.ListLayout },
            selectedItemList: [],
            selectionMode: false
        }
    }

    componentDidMount() {
        this.handleRefresh()
    }

    ItemListRenderer = ReactWinJS.reactRenderer((ItemList) => {
        return (
            <UsersItemList itemList={ItemList.data}/>
        )
    })

    groupHeaderRenderer = ReactWinJS.reactRenderer((item) => {
        return (
            <div>{item.data.title}</div>
        )
    })

    handleToggleSelectionMode = () => {
        this.setState({ selectionMode: !this.state.selectionMode })
        this.props.onNavigate([this.props.location[0]])
        this.refs.listView.winControl.selection.clear()
    }

    handleSelectionChanged = (eventObject) => {
        let listView = eventObject.currentTarget.winControl
        let index = listView.selection.getIndices()
        setTimeout(function () {
            this.setState({ selectedItemList: index })
            this.props.changeActionList(null)
            this.props.onNavigate(index.length === 1 && !this.state.selectionMode ? [this.props.location[0], index] : this.props.location)
        }.bind(this), 0)
    }

    handleContentAnimating(eventObject) {
        // Disable ListView's entrance animation
        if (eventObject.detail.type === 'entrance') {
            eventObject.preventDefault()
        }
    }

    handleRefresh = () => {
        this.props.fetchData(this.props.location[0])
    }

    handleDelete = () => {
        // Clean another actions selected
        this.props.changeActionList(null)
        
        let item = this.props.dataSource.itemList
        let index = this.state.selectedItemList
        index.sort()
        index.reverse()
        index.forEach((i) => {
            item.splice(i, 1)
        })
        this.setState({
            selectedItem: [],
            selectionMode: false
        })
        this.props.changeDataSource(this.props.location, { itemList: item, sort: this.props.dataSource.sort })
    }

    handleSort = () => {
        let array = []
        this.props.dataSource.itemList.map((value, index) =>
            array.push(value)
        );
        this.props.changeDataSource(this.props.location, { itemList: ItemList(this.props.location[0], array, !this.props.dataSource.sort), sort: !this.props.dataSource.sort })
    }

    descendingCompare(first, second) {
        if (first === second)
            return 0;
        else if (first < second)
            return 1;
        else
            return -1;
    }

    render() {
    
        let deleteCommand = (
            <ReactWinJS.ToolBar.Button
                key="delete"
                icon="delete"
                priority={0}
                disabled={this.state.selectedItemList.length === 0}
                onClick={this.handleDelete}
            />
        )

        let listComponent = <Loading message="Loading..." headerSize={48}/>

        if (this.isError) {
            listComponent = "Error"
        } else if (!this.props.isLoading) {
            listComponent = (
                <ReactWinJS.ListView
                    ref="listView"
                    className="contentListView win-selectionstylefilled"
                    style={{ height: 'calc(100% - 48px)' }}
                    itemDataSource={this.props.dataSource.itemList.dataSource}
                    groupDataSource={this.props.dataSource.itemList.groups.dataSource}
                    layout={this.state.layout}
                    itemTemplate={this.ItemListRenderer}
                    groupHeaderTemplate={this.groupHeaderRenderer}
                    selectionMode={this.state.selectionMode ? 'multi' : 'single'}
                    tapBehavior={this.state.selectionMode ? 'toggleSelect' : 'directSelect'}
                    onSelectionChanged={this.handleSelectionChanged}
                    onContentAnimating={this.handleContentAnimating}
                />
            )
        }

        return (
            <div className="listPane" style={{ height: '100%', width: this.props.itemListPaneWidth, display: 'inline-block', verticalAlign: 'top' }}>
                <ReactWinJS.ToolBar className="listToolBar">
                    <ReactWinJS.ToolBar.Button
                        key="sort"
                        icon="sort"
                        label="Sort"
                        priority={1}
                        onClick={this.handleSort}
                    />
                    <ReactWinJS.ToolBar.Button
                        key="refresh"
                        icon="refresh"
                        label="Refresh"
                        priority={1}
                        onClick={this.handleRefresh}
                    />

                    <ReactWinJS.ToolBar.Button
                        key="add"
                        icon="add"
                        label="Add"
                        priority={0}
                    />

                    {this.state.selectionMode ? deleteCommand : null}

                    <ReactWinJS.ToolBar.Toggle
                        key="select"
                        icon="bullets"
                        label="Select"
                        priority={0}
                        selected={this.state.selectionMode}
                        onClick={this.handleToggleSelectionMode}
                    />
                </ReactWinJS.ToolBar>

                { listComponent }

            </div>
        )
    }
}

UsersList.propTypes = {
    itemListPaneWidth: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    dataSource: PropTypes.object.isRequired,
    changeDataSource: PropTypes.func.isRequired,
    location: PropTypes.array.isRequired,
    onNavigate: PropTypes.func.isRequired,
    selectionMode: PropTypes.bool.isRequired,
    changeSelectionMode: PropTypes.func.isRequired,
    actionList: PropTypes.string,
    changeActionList: PropTypes.func.isRequired
}