import React, { Component } from 'react';
import BackgroundVideo from './BackgroundVideo';
import spacex from '../api/spacex';

export class Dashboard extends Component {

    constructor() {
        super();
        this.state = {
            data: undefined
        };
    }

    componentDidMount() {
        this.handleSpacexApi();
    }


    handleSpacexApi = async () => {
        const response = await spacex.get('/info', {});
        const { data } = response;
        this.setState(() => ({ loading: !this.state.loading, data }))
    }


    render() {
        return (
            <div>
                {
                    this.state.data &&
                    <div>
                        <div style={{ position: 'absolute', bottom: '5rem', right: '0', textAlign: 'center' }}>
                            <div className="d">
                                <div className="p-grid">
                                    <p className="p-col-12  company_info" style={{ fontSize: '1.2rem', fontWeight: '600', color: 'white', padding: '0', marginBlockStart: '0', marginBlockEnd: '0' }}>Welcome to {this.state.data.name} ( {this.state.data.headquarters.state} )</p>
                                    <p className="p-col-12  company_info" style={{ fontSize: '1.2rem', fontWeight: '600', color: 'white', padding: '0', marginBlockStart: '0', marginBlockEnd: '0' }}>-{this.state.data.founder}</p>
                                </div>
                            </div>
                        </div>
                        <BackgroundVideo />
                    </div>
                }
            </div>

        );
    }
}