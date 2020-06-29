import React, { Component } from 'react';
import classNames from 'classnames';

export class AppProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        };
        this.onClick = this.onClick.bind(this);
    }

    onClick(event) {
        this.setState({expanded: !this.state.expanded});
        event.preventDefault();
    }

    render() {
        const {role = "default"} = this.props;
        return  (
            <div className="layout-profile">
                <div>
                    <img src="assets/layout/images/avatar_2.png" alt="" />
                </div>
                <button className="p-link layout-profile-link" onClick={this.onClick}>
                    <span className="username">{role}</span>
                    <i className="pi pi-fw pi-cog"/>
                </button>
                <ul className={classNames({'layout-profile-expanded': this.state.expanded})}>
                    <li><button className="p-link" onClick={this.props.logout}><i className="pi pi-fw pi-power-off"/><span>Logout</span></button></li>
                </ul>
            </div>
        );
    }
}