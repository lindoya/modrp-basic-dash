import React, { Component } from 'react';
import './App.css';
import Input from './components/Input/index'
import Button1 from './components/Button'
import { message, Modal } from 'antd';
import "antd/dist/antd.css";
import { getStatus, resetRelogio }  from './service'
import { Spin } from 'antd'
import { Progress } from 'antd';

const defaultState = {
  IP: '',
  data: {
    tempoLigado: '0',
    tempoConectado: '0',
    tempoDesconectado: '0',
    quantVezesPerdeuConexao: '0',
    ping: '0',
    firmwareVersion: '0',
    percent: '0'
  },
  visible: false,
  loading: false
}

class App extends Component {

  state = defaultState

  setValueToInput = (e) => {
    this.setState({
      IP: e.target.value
    })
  }

  handleOk = () => {
    this.setState({
      visible: false,
    });
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  showModal = () => {
    this.setState({
      visible: true
    })
  }

  getStatus = async () => {
    const IP = this.state.IP
    this.setState({
      loading: true
    })
    const { data, success } = await getStatus(IP)
    if (success) {
      this.setState({
        loading: false,
        data: data
      }, this.showModal)
    } else {
      this.setState({
        loading: false,
        data: defaultState.data
      })
      message.error('Relógio não encontrado, tente novamente', 10);
    }
  }

  resetRelogio = async () => {
    const IP = this.state.IP
    this.setState({
      loading: true
    })
    const success = await resetRelogio(IP)

    const deucerto = () => {
      message.success('Relógio resetado com sucesso', 10);
    }
    const failed = () => {
      message.error('Relógio não teve sucesso ao ser resetado', 10);
    }
    if (success) {
      this.setState({
        loading: false
      }, deucerto())
    } else {
      this.setState({
        loading: false,
      }, failed())
    }
  }


  // masterReboot = async () => {
  //   const IP = this.state.IP
  //   this.setState({
  //     loading: true
  //   })
  //   const success = await masterReboot(IP)

  //   const deucerto = () => {
  //     message.success('Sonoff resetada com sucesso', 10);
  //   }
  //   const failed = () => {
  //     message.error('Sonoff nãa teve sucesso ao ser resetada', 10);
  //   }
  //   if (success) {
  //     this.setState({
  //       loading: false
  //     }, deucerto())
  //   } else {
  //     this.setState({
  //       loading: false,
  //     }, failed())
  //   }
  // }

  render() {
    const { data } = this.state
    const {
      tempoLigado = '0',
      tempoConectado = '0',
      tempoDesconectado = '0',
      quantasVezesTPLinkReiniciou = '0',
      ping = '0',
      firmwareVersion = '0',
      percent = '0'
    } = data

    return (
      <div className='main'>
        <div className="App">
          <div className='div-info'>
            <Input changed={this.setValueToInput} />
            <Button1 name='Reset' click={this.resetRelogio} changed={this.setValueToInput} text='Reset relógio'/>
            <Button1 name='Status' click={this.getStatus} changed={this.setValueToInput} text='Status de conexão'/>
            <div className='div-spin'>
              <Spin
                spinning={this.state.loading}
                size='large'
              />
            </div>
            <Modal
              title="Status do módulo"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <div className='grafico'>
                <h3>Qualidade:</h3>
                <Progress type="circle" percent={percent} strokeColor='yellowgreen' />
              </div>
              <div className='div-modal'>
                <div className='div-p'><p className='paragrafoLigado'> Tempo Ligado:</p>            {tempoLigado} </div>
                <div className='div-p'><p className='paragrafoResposta'> Tempo de resposta:</p>     {ping} ms </div>
                <div className='div-p'><p className='paragrafoConectado'> Tempo Conectado:</p>      {tempoConectado} </div>
                <div className='div-p'><p className='paragrafoDesc'> Tempo Desconectado:</p>        {tempoDesconectado} </div>
                <div className='div-p'><p className='paragrafoTP'> TP - Link reset:</p>             {quantasVezesTPLinkReiniciou} vezes </div>
                <div className='div-p'><p className='paragrafoFirmware'> Versão do Firmware:</p>      {firmwareVersion} </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
