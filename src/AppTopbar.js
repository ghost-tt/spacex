import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {SplitButton} from 'primereact/splitbutton';


export class AppTopbar extends Component {
    constructor() {
        super();
        this.state = {
            items: [
                {
                    label: 'Admin',
                    command: (e) => {
                        this.props.createDialogBox(e.item.label)
                    }
                },
                {
                    label: 'Moderator',
                    command: (e) => {
                        this.props.createDialogBox(e.item.label)
                    }
                }
            ]
        }

        this.save = this.save.bind(this);
    }

    
    static defaultProps = {
        onToggleMenu: null
    }

    static propTypes = {
        onToggleMenu: PropTypes.func.isRequired
    }

    save() {
        this.growl.show({severity: 'success', summary: 'Success', detail: 'Data Saved'});
    }

    render() {
        
        return (
            <div className="layout-topbar clearfix">
                <button className="p-link layout-menu-button" onClick={this.props.onToggleMenu}>
                    <span className="pi pi-bars" />
                </button>
                <div className="layout-topbar-icons">
                    <div className="p-link">
                        { !this.props.isUserLogged && <SplitButton label="Login Roles" onClick={() => this.props.createDialogBox('Admin')}  model={this.state.items}></SplitButton> }
                    </div>
                </div>
            </div>
        );
    }
}