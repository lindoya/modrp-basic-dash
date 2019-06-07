import React, { Component } from 'react';
import './App.css';
import MediaQuery from 'react-responsive'
import Button1 from './components/Button'
import { message, Modal } from 'antd';
import "antd/dist/antd.css";
import { getStatus, resetRelogio, getPingService } from './service'
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
  loading: false,
  modalreset: false,
  modalresetInput: '',
}

class App extends Component {

  state = defaultState

  setValueToInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleOk = () => {
    this.setState({
      visible: false,
    });
  }

  showResetRelogioModal = () => {
    const isIp = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gm
    if (isIp.test(this.state.IP)) {
      this.setState({
        modalreset: true,
      })
    } else {
      message.error('O IP informado está inválido.', 5)
    }
  }
  resetCancel = () => {
    this.setState({
      modalreset: false,
    })
    message.info('Nenhum procedimento foi realizado.', 5)
  }

  resetOk = () => {
    const isIp = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gm
    if (isIp.test(this.state.IP)) {
      if (this.state.IP === this.state.modalresetInput) {
        this.setState({
          modalreset: false,
        })
        this.resetRelogio()
      } else {
        message.error('Os IPs informados não coincidem, por questôes de segurança o relógio não foi resetado.', 10)
      }
    } else {
      message.error('O IP informado está inválido.', 5)
    }
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

  getPing = async () => {
    const IP = this.state.IP
    this.setState({
      loading: true
    })
    const response = await getPingService(IP)
    console.log(response)
    const { erro = { message: '' }, falha = false, data = {}, success = false } = response
    if (success) {
      if (data.actionStatus) {
        if (data.actionStatusSucess) {
          this.setState({
            loading: false,
            data: data
          }, this.showModal)
        } else {
          message.error('Ocorreu uma falha, o módulo v4 não foi localizado. Erro: 02.02', 5);
          this.setState({
            loading: false,
            data: defaultState.data
          })

        }
      } else {
        this.setState({
          loading: false,
          data: defaultState.data
        })
        message.error('Ocorreu uma falha, algo deu muito errado !!!!!!!!!!. Erro: 01.01', 5);
      }
    } else {
      if (falha) {
        this.setState({
          loading: false,
          data: defaultState.data
        })
        message.error(erro.message, 5);
      } else {
        this.setState({
          loading: false,
          data: defaultState.data
        })
        message.error('Ocorreu uma falha, a conexão com servidor foi perdida, tente novamente. Erro: 02.01!', 5);
      }
    }
  }


  getStatus = async () => {
    const IP = this.state.IP
    this.setState({
      loading: true
    })
    const response = await getStatus(IP)
    const { erro = { message: '' }, falha = false, data = {}, success = false } = response
    if (success) {
      if (data.actionStatus) {
        if (data.actionStatusSucess) {
          this.setState({
            loading: false,
            data: data
          }, this.showModal)
        } else {
          message.error('Ocorreu uma falha, o módulo v4 não foi localizado. Erro: 02.02', 5);
          this.setState({
            loading: false,
            data: defaultState.data
          })

        }
      } else {
        this.setState({
          loading: false,
          data: defaultState.data
        })
        message.error('Ocorreu uma falha, algo deu muito errado !!!!!!!!!!. Erro: 01.01', 5);
      }
    } else {
      if (falha) {
        this.setState({
          loading: false,
          data: defaultState.data
        })
        message.error(erro.message, 5);
      } else {
        this.setState({
          loading: false,
          data: defaultState.data
        })
        message.error('Ocorreu uma falha, a conexão com servidor foi perdida, tente novamente. Erro: 02.01!', 5);
      }
    }
  }

  resetRelogio = async () => {
    const IP = this.state.IP
    this.setState({
      loading: true
    })
    const response = await resetRelogio(IP)
    console.log(response)

    const { erro = { message: '' }, falha = false, data = {}, success = false } = response
    if (success) {
      if (data.actionReset) {
        if (data.actionResetSucess) {
          message.success('Relógio resetado com sucesso!', 5);
          this.setState({
            loading: false,
            data: defaultState.data
          })
        } else {
          message.error('Ocorreu uma falha, o módulo v4 não foi localizado. Erro: 02.02', 5);
          this.setState({
            loading: false,
            data: defaultState.data
          })

        }
      } else {
        this.setState({
          loading: false,
          data: defaultState.data
        })
        message.error('Ocorreu uma falha, algo deu muito errado !!!!!!!!!!. Erro: 01.01', 5);
      }
    } else {
      if (falha) {
        this.setState({
          loading: false,
          data: defaultState.data
        })
        message.error(erro.message, 5);
      } else {
        this.setState({
          loading: false,
          data: defaultState.data
        })
        message.error('Ocorreu uma falha, a conexão com servidor foi perdida, tente novamente. Erro: 02.01.', 5);
      }
    }
  }

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

      <div className='App'>
        <MediaQuery query="(max-width: 659px)">
          <div className='group'>
            <input
              className='intputIp'
              onChange={this.setValueToInput}
              placeholder="IP"
              name='IP'
              value={this.state.IP}
            />
            <div className='row'>
              <Button1 name='Ping' click={this.getPing} changed={this.setValueToInput} text='Ping Ip' />
              <Button1 name='Reset' click={this.showResetRelogioModal} changed={this.setValueToInput} text='Reset relógio' />
              <Button1 name='Status' click={this.getStatus} changed={this.setValueToInput} text='Status de conexão' />
            </div>
          </div>
          <div className='groupPort'>
            <input className='intputPort' placeholder="Porta" />
            <Button1 name='Check' click={this.getStatus} changed={this.setValueToInput} text='Test conexão relógio' />
          </div>

          <div className='div-spin'>
            <Spin
              spinning={this.state.loading}
              size='large'
            />
          </div>
        </MediaQuery>
        <MediaQuery query="(min-width: 660px)">
          <div className='desktop'>
            <div className='groupDesk'>
              <input
                className='intputIp'
                onChange={this.setValueToInput}
                placeholder="IP"
                name='IP'
                value={this.state.IP}
              />
              <Button1 name='Ping' click={this.getPing} onchanged={this.setValueToInput} text='Ping Ip' />
              <Button1 name='Status' click={this.getStatus} changed={this.setValueToInput} text='Status de conexão' />
            </div>
            <div className='groupDesk'>
              <input className='intputPort' placeholder="Porta" />
              <Button1 name='Check' click={this.getStatus} changed={this.setValueToInput} text='Test conexão relógio' />
              <Button1 name='Reset' click={this.showResetRelogioModal} changed={this.setValueToInput} text='Reset relógio' />
            </div>
            <div className='div-spin'>
              <Spin
                className='spinLoading'
                spinning={this.state.loading}
                size='large'
              />
            </div>
          </div>
        </MediaQuery>
        <Modal
          title="Status do módulo"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          centered={true}
        >
          <div className='grafico'>

            <Progress type="circle" percent={percent} strokeColor='yellowgreen' />
          </div>
          <div className='div-modal'>
            <div className='div-p'><div className='modalParagrafo'> Ligado:</div> <div className='modalParagrafo'>{tempoLigado} </div></div>
            <div className='div-p'><div className='modalParagrafo'> Conectado:</div><div className='modalParagrafo'>{tempoConectado} </div></div>
            <div className='div-p'><div className='modalParagrafo'> Desconectado:</div> <div className='modalParagrafo'>{tempoDesconectado} </div></div>
            <div className='div-p'><div className='modalParagrafo'> Latência:</div> <div className='modalParagrafo'>{ping} ms </div></div>
            <div className='div-p'><div className='modalParagrafo'> TP - Link reset:</div> <div className='modalParagrafo'> {quantasVezesTPLinkReiniciou} vezes </div></div>
            <div className='div-p'><div className='modalParagrafo'> Versão do Firmware:</div> <div className='modalParagrafo'>{firmwareVersion} </div></div>
          </div>
        </Modal>
        <Modal
          title="Por questões de segurança redigite o IP"
          visible={this.state.modalreset}
          onOk={this.resetOk}
          onCancel={this.resetCancel}
          centered={true}
        >
          <div className='div-modal-reset'>
            <input
              className='intputreset'
              onChange={this.setValueToInput}
              placeholder="IP"
              name='modalresetInput'
              value={this.state.modalresetInput}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

export default App;
