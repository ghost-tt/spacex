import React, { Component } from 'react';
import {Card} from 'primereact/card';

class Timer extends Component {
    constructor(props) {
        super(props)
        this.count = this.count.bind(this)
        this.state = {
            days: 0,
            minutes: 0,
            hours: 0,
            secounds: 0,
            time_up: ""
        }
        this.x = null
        this.deadline = null
    }
    count() {
        var now = new Date().getTime();
        var t = this.deadline - now;
        var days = Math.floor(t / (1000 * 60 * 60 * 24));
        var hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((t % (1000 * 60)) / 1000);
        this.setState({ days, minutes, hours, seconds })
        if (t < 0) {
            clearInterval(this.x);
            this.setState({ days: 0, minutes: 0, hours: 0, seconds: 0, time_up: "TIME IS UP" })
        }
    }
    componentDidMount() {
        const parseNum = Number(this.props.launchTime) * 1000;
        this.deadline = new Date(parseNum)
        this.x = setInterval(this.count, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.x)
    }

    render() {
        const { days=0, seconds=0, hours=0, minutes=0, time_up } = this.state
        return (
            <div className="p-grid" >
                <div className="p-col-12">
                    <div className="card">
                        <div className="p-grid p-align-center p-justify-center"  style={{ padding: '2rem'}}>
                            <div className="p-col-12 textAlignCenter"><p className="title">SpaceX Launch CountDown</p></div>
                            <div className="p-col p-md-3 textAlignCenter">
                                <Card title={String(days)} subTitle="Days"></Card>
                            </div>
                            <div className="p-col p-md-3 textAlignCenter">
                                <Card title={String(hours)} subTitle="Hours"></Card>
                            </div>
                            <div className="p-col p-md-3 textAlignCenter">
                                <Card title={String(minutes)} subTitle="Minutes"></Card>
                            </div>
                            <div className="p-col p-md-3 textAlignCenter">
                                <Card title={String(seconds)} subTitle="Seconds"></Card>
                            </div>
                        </div>
                        <p id="demo">{time_up}</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default Timer