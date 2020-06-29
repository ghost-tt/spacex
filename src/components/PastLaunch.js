import React, { Component } from 'react';
import spacex from '../api/spacex';
import { Dialog } from 'primereact/dialog';
import { Panel } from 'primereact/panel';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

export class PastLaunch extends Component {
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
        this.onSortChange = this.onSortChange.bind(this);
    }

    

    componentDidMount() {
        this.handleSpacexApi();
    }

    handleSpacexApi = async () => {
        const response = await spacex.get('/launches/past', {});
        const { data } = response;
        this.setState(() => ({ data }))
    }

    onSortChange(event) {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            this.setState({
                sortOrder: -1,
                sortField: value.substring(1, value.length),
                sortKey: value
            });
        }
        else {
            this.setState({
                sortOrder: 1,
                sortField: value,
                sortKey: value
            });
        }
    }

    renderListItem(data) {
        return (
            <div className="p-col-12">
                <div className="spacex-details">
                    <div>
                        <img src={data.links.mission_patch} srcSet={data.links.mission_patch_small} alt={data.mission_name}/>
                        <div className="p-grid">
                            <div className="p-col-12">Rocket: <b>{data.rocket.rocket_name}</b></div>
                            <div className="p-col-12">Mission Name: <b>{data.mission_name}</b></div>
                            <div className="p-col-12">Site Name: <b>{data.launch_site.site_name_long}</b></div>
                            <div className="p-col-12">Launch Year: <b>{data.launch_year}</b></div>
                            <div className="p-col-12">Manufacturer: <b>{data.rocket.second_stage.payloads[0].manufacturer}</b></div>
                            <div className="p-col-12">Nationality: <b>{data.rocket.second_stage.payloads[0].nationality}</b></div>
                        </div>
                    </div>
                    <Button icon="pi pi-search" onClick={(e) => this.setState({ selectedTab: data, visible: true })}></Button>
                </div>
            </div>
        );
    }

    renderGridItem(data) {
        return (
            <div style={{ padding: '.5em' }} className="p-col-12 p-md-3">
                <Panel header={data.vin} style={{ textAlign: 'center' }}>
                    <img src={data.links.mission_patch} srcSet={data.links.mission_patch_small} alt={data.mission_name} />
                    <div className="spacex-detail">{data.year} - {data.color}</div>
                    <Button icon="pi pi-search" onClick={(e) => this.setState({ selectedTab: data, visible: true })}></Button>
                </Panel>
            </div>
        );
    }

    itemTemplate(data, layout) {
        if (!data) {
            return;
        }
        if (layout === 'list')
            return this.renderListItem(data);
        else if (layout === 'grid')
            return this.renderGridItem(data);
    }

    renderDialogContent() {
        const data = this.state.selectedTab;
        if (data) {
            return (
                <div className="p-grid" style={{fontSize: '16px', textAlign: 'center', padding: '20px'}}>
                    <div className="p-col-12" style={{textAlign: 'center'}}>
                        <img src={data.links.mission_patch_small} srcSet={data.links.mission_patch_small} alt={data.mission_name} />
                    </div>
                    <div className="p-col-4">Rocket: </div>
                    <div className="p-col-8">{data.rocket.rocket_name}</div>

                    <div className="p-col-4">Mission Name: </div>
                    <div className="p-col-8">{data.mission_name}</div>

                    <div className="p-col-4">Site Name: </div>
                    <div className="p-col-8">{data.launch_site.site_name_long}</div>

                    <div className="p-col-4">Launch Year: </div>
                    <div className="p-col-8">{data.launch_year}</div>

                    <div className="p-col-4">Manufacturer: </div>
                    <div className="p-col-8">{data.rocket.second_stage.payloads[0].manufacturer}</div>

                    <div className="p-col-4">Nationality: </div>
                    <div className="p-col-8">{data.rocket.second_stage.payloads[0].nationality}</div>

                    <div className="p-col-3"><a href={data.links.presskit} target="_blank" rel="noopener noreferrer">Press Kit</a></div>
                    <div className="p-col-3"><a href={data.links.reddit_launch} target="_blank" rel="noopener noreferrer">Reddit</a></div>
                    <div className="p-col-3"><a href={data.links.wikipedia} target="_blank" rel="noopener noreferrer">Wiki</a></div>
                    <div className="p-col-3"><a href={data.links.video_link} target="_blank" rel="noopener noreferrer">Youtube</a></div>
                </div>
            );
        }
        else {
            return null;
        }
    }

    renderHeader() {
        const sortOptions = [
            {label: 'Newest First', value: '!year'},
            {label: 'Oldest First', value: 'year'},
            {label: 'Brand', value: 'brand'}
        ];

        return (
            <div className="p-grid">
                <div className="p-col-6" style={{textAlign: 'left'}}>
                    <Dropdown options={sortOptions} value={this.state.sortKey} placeholder="Sort By" onChange={this.onSortChange} style={{width: '12em'}} />
                </div>
                <div className="p-col-6" style={{textAlign: 'right'}}>
                    <DataViewLayoutOptions layout={this.state.layout} onChange={(e) => this.setState({layout: e.value})} />
                </div>
                </div>
        );
    }

    render() {
        const header = this.renderHeader();
        return (
            <div className="dataview-demo">
                { this.state.data && <div><DataView value={this.state.data} layout={this.state.layout} header={header}
                        itemTemplate={this.itemTemplate} paginatorPosition={'both'} paginator={true} rows={20}
                        sortOrder={this.state.sortOrder} sortField={this.state.sortField} />

                <Dialog  visible={this.state.visible} showHeader={false} dismissableMask={true} closeOnEscape={true} modal={true} onHide={() => this.setState({visible: false})}>
                    {this.renderDialogContent()}
                </Dialog></div>}
            </div>
        );
    }
}
                