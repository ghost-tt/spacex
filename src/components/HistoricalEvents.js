import spacex from '../api/spacex';
import React, { Component } from 'react';
import { Fieldset } from 'primereact/fieldset';

export class HistoricalEvents extends Component {
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
        const response = await spacex.get('/history', {});
        const { data } = response;
        this.setState(() => ({ loading: !this.state.loading, data }))
    }

    render() {
        const details = this.state.data;
        return (
            <div>
                {
                    details && (
                        details.map((val, index) => {
                            return (
                                <div className="dashboard_container dashboard_child_container" key={val.event_date_unix}>
                                    <Fieldset legend={val.title} className="fieldset">
                                        <p>{val.details}</p>
                                    </Fieldset>
                                </div>
                            )
                        })

                    )
                }
            </div>
        )
    }
}