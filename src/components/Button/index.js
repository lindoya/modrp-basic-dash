import React, { Component } from 'react'
// import {  Tooltip } from 'antd';
// import MediaQuery from 'react-responsive'
import './index.css'

class Button extends Component{
    render(){
        return(
            <div>
                <button className="button" onChange={this.props.changed} onClick={this.props.click}>{this.props.name}</button>
                {/* <MediaQuery query="(max-device-width: 800px)">
                    <button className="button" onChange={this.props.changed} onClick={this.props.click}>{this.props.name}</button>
                </MediaQuery>
                <MediaQuery query="(min-device-width: 801px)">
                    <Tooltip placement="top" title={this.props.text}>
                        <button className="button" onChange={this.props.changed} onClick={this.props.click}>{this.props.name}</button>
                    </Tooltip>
                </MediaQuery> */}
            </div>
        )
    }
}

export default Button