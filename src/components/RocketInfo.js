import React, { Component } from 'react';
import spacex from '../api/spacex';
import { Card } from 'primereact/card';


export class RocketInfo extends Component {
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
        const response = await spacex.get('/rockets', {});
        const { data } = response;
        this.setState(() => ({ loading: !this.state.loading, data }))
    }


    render() {
        const details = this.state.data;

        return (
            <div className="p-grid" style={{ padding: '66px 16px 16px 16px' }}>
                <div className="p-col-12">
                    <div className="card">
                        
                            {
                                details && (
                                    <div className="p-grid p-align-center">
                                        {details.map((val, index) => {
                                            return (
                                                <div className="p-col-6" key={val.first_flight + index} >
                                                    <Card>
                                                        <div className="p-grid">
                                                            <div className="p-col-12">
                                                                <img src={val.flickr_images[0]} alt={val.flickr_images[0]} style={{width: '100%', height: '15rem'}} />
                                                            </div>
                                                            <div className="p-col-12">
                                                                <div>{val.rocket_name}</div>
                                                                <div>{val.first_flight}</div>
                                                                <div>{val.mass.kg} kg</div>
                                                                <div>{val.country}</div>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </div>
                                            )
                                        })}

                                    </div>
                                )
                            }
                    </div>
                </div>
            </div>
        );
    }
}