import React, { Component } from 'react'
import {  Tooltip } from 'antd';
import './index.css'

class Button extends Component{
    render(){
        return(
            <div>
                 <Tooltip placement="top" title={this.props.text}>
                    <button className="button" onChange={this.props.changed} onClick={this.props.click}>{this.props.name}</button>
                </Tooltip>
            </div>
        )
    }
}

export default Button