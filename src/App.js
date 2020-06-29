import React, { Component } from 'react';
import classNames from 'classnames';
import { AppTopbar } from './AppTopbar';
import { AppMenu } from './AppMenu';
import { AppProfile } from './AppProfile';
import { Route } from 'react-router-dom';

import { Growl } from 'primereact/growl';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import axios from './api/api';
import { Dashboard } from './components/Dashboard';
import { NextLaunch } from './components/NextLaunch';
import { PastLaunch } from './components/PastLaunch';
import { UpcomingLaunch } from './components/UpcomingLaunch';
import { LatestLaunch } from './components/LatestLaunch';
import { RocketInfo } from './components/RocketInfo';
import { HistoricalEvents } from './components/HistoricalEvents';


import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import './layout/layout.scss';
import './App.scss';

class App extends Component {

    constructor() {
        super();
        this.state = {
            layoutMode: 'static',
            staticMenuInactive: false,
            overlayMenuActive: false,
            mobileMenuActive: false,
            dialogVisible: false,
            isUserLogged: false,
            role: 'user',
            username_val: '',
            password_val: ''
        };

        this.onWrapperClick = this.onWrapperClick.bind(this);
        this.onToggleMenu = this.onToggleMenu.bind(this);
        this.onSidebarClick = this.onSidebarClick.bind(this);
        this.onMenuItemClick = this.onMenuItemClick.bind(this);

    }

    onWrapperClick(event) {
        if (!this.menuClick) {
            this.setState({
                overlayMenuActive: false,
                mobileMenuActive: false
            });
        }

        this.menuClick = false;
    }

    onToggleMenu(event) {
        this.menuClick = true;

        if (this.isDesktop()) {
            if (this.state.layoutMode === 'overlay') {
                this.setState({
                    overlayMenuActive: !this.state.overlayMenuActive
                });
            }
            else if (this.state.layoutMode === 'static') {
                this.setState({
                    staticMenuInactive: !this.state.staticMenuInactive
                });
            }
        }
        else {
            const mobileMenuActive = this.state.mobileMenuActive;
            this.setState({
                mobileMenuActive: !mobileMenuActive
            });
        }

        event.preventDefault();
    }

    onSidebarClick(event) {
        this.menuClick = true;
    }

    onMenuItemClick(event) {
        if (!event.item.items) {
            this.setState({
                overlayMenuActive: false,
                mobileMenuActive: false
            })
        }
    }

    createMenu() {
        this.menu = [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', command: () => { window.location = '#/' } },
            {
                label: 'Events', icon: 'pi pi-fw pi-globe',
                items: [
                    { label: 'Next Mission', icon: 'pi pi-fw pi-globe', to: '/next-launch' },
                    { label: 'Past Missions', icon: 'pi pi-fw pi-globe', to: '/past-launch' },
                    { label: 'Upcoming Missions', icon: 'pi pi-fw pi-globe', to: '/upcoming-launch' },
                    { label: 'Latest Missions', icon: 'pi pi-fw pi-globe', to: '/latest-launch' }
                ]
            }
        ];

        if(this.state.role === 'admin') {
            this.menu = this.menu.concat([{ label: 'Rocket', icon: 'pi pi-fw pi-file', command: () => { window.location = "#/rocket_info" } }, { label: 'History', icon: 'pi pi-fw pi-file', command: () => { window.location = "#/historical_events" } }])
        }
    }

    addClass(element, className) {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    removeClass(element, className) {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    componentDidMount() {
        const loginStatus = Boolean(sessionStorage.getItem('spacex_loggedin'));
        const agent_role = sessionStorage.getItem('spacex_loggedin_role');
        loginStatus && this.setState(() => ({ isUserLogged: !this.state.isUserLogged, role: agent_role }))
        this.state.isUserLogged && this.createMenu();
    }

    componentDidUpdate() {
        this.state.isUserLogged && this.createMenu();
        if (this.state.mobileMenuActive)
            this.addClass(document.body, 'body-overflow-hidden');
        else
            this.removeClass(document.body, 'body-overflow-hidden');
    }

    createDialogBox = (role) => {
        this.setState(() => ({ dialogVisible: !this.state.dialogVisible, role: role }))
    }

    getApiPath = (role) => {
        role = role.toLowerCase();
        if (role === 'admin') {
            return '/31347d29-049d-42de-9377-d82d2be645a3'
        } else {
            return '/2eb00045-515b-4afb-b4ed-1113c61b3def'
        }
    }

    logout = () => {
        sessionStorage.clear();
        this.setState(() => ({ isUserLogged: !this.state.isUserLogged, role: 'user' }));
        this.menu =  [{ label: 'Login to continue', icon: 'pi pi-fw pi-caret-left' }];
        window.location = '#/'
    }

    handleLogin = async (role) => {
        const path = this.getApiPath(role)
        if(this.state.username_val === "" || this.state.password_val === "") {
            alert("Please enter username and password!")
        }
        const response = await axios.get(path, {});
        const { data } = response;
        role = role.toLowerCase();
        if (data.identity.login === this.state.username_val.trim() && data.identity.password === this.state.password_val.trim()) {
            this.setState(() => ({ dialogVisible: !this.state.dialogVisible, isUserLogged: !this.state.isUserLogged, role }))
            this.growl.show({ severity: 'success', summary: `${role} successfully logged!` });
            sessionStorage.setItem('spacex_loggedin',  this.state.isUserLogged);
            sessionStorage.setItem('spacex_loggedin_role',  this.state.role);
        }

    }

    render() {
        const dialogFooter = (
            <Button label="Login" icon="pi pi-user" onClick={() => this.handleLogin(this.state.role)} />
        );

        const wrapperClass = classNames('layout-wrapper', {
            'layout-static': this.state.layoutMode === 'static',
            'layout-static-sidebar-inactive': !this.state.staticMenuInactive && this.state.layoutMode === 'static',
            'layout-mobile-sidebar-active': this.state.mobileMenuActive
        });

        return (

            <div className={wrapperClass} onClick={this.onWrapperClick}>
                <Growl ref={(el) => this.growl = el}></Growl>

                <AppTopbar onToggleMenu={this.onToggleMenu} createDialogBox={this.createDialogBox} isUserLogged={this.state.isUserLogged} />
                
                <div ref={(el) => this.sidebar = el} className="layout-sidebar layout-sidebar-dark" onClick={this.onSidebarClick}>
                    {this.state.isUserLogged && <AppProfile role={this.state.role} logout={this.logout}/>} 
                    <AppMenu model={this.menu} onMenuItemClick={this.onMenuItemClick} />
                </div>
                <div className="layout-main">
                    <Route path="/" exact component={Dashboard} />
                    <Route path="/next-launch" component={NextLaunch} />
                    <Route path="/past-launch" component={PastLaunch} />
                    <Route path="/upcoming-launch" component={UpcomingLaunch} />
                    <Route path="/latest-launch" component={LatestLaunch} />
                    <Route path="/rocket_info" component={RocketInfo} />
                    <Route path="/historical_events" component={HistoricalEvents} />
                </div>
                <div className="layout-mask"></div>
                <Dialog header={this.state.role} visible={this.state.dialogVisible} footer={dialogFooter} onHide={() => this.setState({ dialogVisible: false })}>
                    <div className="p-grid">
                        <div className="p-col-12">
                            <InputText placeholder="Username" type="text" value={this.state.username_val} onChange={(e) => this.setState({ username_val: e.target.value })} />
                        </div>
                        <div className="p-col-12">
                            <InputText placeholder="Password" type="password" value={this.state.password_val} onChange={(e) => this.setState({ password_val: e.target.value })} />
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }
}

export default App;
