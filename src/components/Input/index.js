import React, { Component } from 'react'
import './index.css'

class Input extends Component{
    render(){
        return(
            <div>
                <input onChange={this.props.changed} className='input' placeholder="Digite o IP..."/>
            </div>
        )
    }
}

export default Input