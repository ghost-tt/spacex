import React, { Component } from 'react';
import spacex from '../api/spacex';
import { DataView } from 'primereact/dataview';

export class UpcomingLaunch extends Component {
    constructor() {
        super();
        this.state = {
            data: undefined,
            layout: 'list',
            selectedTab: null,
            visible: false,
            sortKey: null,
            sortOrder: null,
            sortField: null
        };
        this.itemTemplate = this.itemTemplate.bind(this);
    }

    componentDidMount() {
        this.handleSpacexApi();
    }

    handleSpacexApi = async () => {
        const response = await spacex.get('/launches/upcoming', {});
        const { data } = response;
        this.setState(() => ({ data }))
    }
    
    renderListItem(data) {
        return (
            <div className="p-col-12">
                <div className="spacex-details">
                    <div>
                        <div className="p-grid">
                            <div className="p-col-12">Mission Name: <b>{data.mission_name}</b></div>
                            <div className="p-col-12">Site Name: <b>{data.launch_site.site_name_long}</b></div>
                            <div className="p-col-12">Manufacturer: <b>{data.rocket.second_stage.payloads[0].manufacturer}</b></div>
                            <div className="p-col-12">Nationality: <b>{data.rocket.second_stage.payloads[0].nationality}</b></div>
                            <div className="p-col-12">Launch Year: <b>{data.launch_year}</b></div>
                            <div className="p-col-12"><a href={data.links.reddit_launch} target="_blank" rel="noopener noreferrer">Reddit</a></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    itemTemplate(data, layout) {
        if (!data) {
            return "";
        }
        if (layout === 'list')
            return this.renderListItem(data);
        else if (layout === 'grid')
            return this.renderGridItem(data);
    }

    render() {
        return (
            <div className="dataview-demo">
                {this.state.data && <div><DataView value={this.state.data} layout={this.state.layout}
                    itemTemplate={this.itemTemplate} paginatorPosition={'both'} paginator={true} rows={8} />
                </div>}
            </div>
        );
    }
}
