import React, { Component } from 'react';
import spacex from '../api/spacex';
import Timer from './Timer';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';


export class NextLaunch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: undefined,
            dialogVisible: false,
        }
    }
    
    componentDidMount() {
        this.handleSpacexApi();
    }


    handleSpacexApi = async () => {
        const response = await spacex.get('/launches/next', {});
        const { data } = response;
        this.setState(() => ({ loading: !this.state.loading, data }))
    }


    render() {
        const details = this.state.data;

        return (
            <div className="p-grid">
                <div className="p-col-12">
                    <div className="card">
                        <div className="p-grid p-align-center">
                            {
                                details && (
                                    <div>
                                        <Timer launchTime={details.launch_date_unix}  />
                                        <div className="p-col-12">

                                            <div className="p-col-12">
                                                <div className="p-card-subtitle">About us</div>
                                                {details.details}
                                                <div onClick={() => this.setState({ dialogVisible: true })} ><a href="#/next-launch" rel="noopener noreferrer">more details...</a></div>
                                                <Dialog visible={this.state.dialogVisible} showHeader={false} dismissableMask={true} closeOnEscape={true} modal={true} onHide={() => this.setState({ dialogVisible: false })}>
                                                    <div className="p-grid">
                                                        <div>
                                                            <div className="p-col-12">
                                                                <Card>
                                                                    <div className="p-card-subtitle">Mission Information</div>
                                                                    <div>{details.mission_name}</div>
                                                                    <div>{details.launch_year}</div>
                                                                    <div>{details.launch_date_unix}</div>
                                                                </Card>
                                                            </div>

                                                            <div className="p-col-12">
                                                                <Card>
                                                                    <div className="p-card-subtitle">Rocket Information</div>
                                                                    <div>{details.rocket.rocket_name}</div>
                                                                    {details.rocket.second_stage.payloads.map((val, index) => {
                                                                        return (
                                                                            <div key={val.payload_id + index}>
                                                                                <div>{val.nationality}</div>
                                                                                <div>{val.manufacturer}</div>
                                                                                <div>{val.payload_mass_kg}</div>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </Card>
                                                            </div>

                                                            <div className="p-col-12">
                                                                <Card>
                                                                    <div className="p-card-subtitle">Site Information</div>
                                                                    <div>{details.launch_site.site_name_long}</div>
                                                                    <div>{details.launch_site.site_name}</div>

                                                                    <div><a href={details.links.reddit_campaign} rel="noopener noreferrer">Reddit</a></div>
                                                                </Card>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Dialog>

                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}