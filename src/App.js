import React, { Component } from 'react';
import './App.css';
import Button1 from './components/Button'
import { message, Modal } from 'antd';
import "antd/dist/antd.css";
import { getStatus, resetRelogio, getPingService, testPortService } from './service'
import { Spin } from 'antd'
import { Progress } from 'antd';
import MediaQuery from 'react-responsive'

import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalBarSeries,
} from 'react-vis'

const defaultState = {
  IP: '',
  data: {
  },
  dataPing: {
    address: '',
    attempts: '',
    avg: '',
    max: '',
    min: '',
    port: '',
    results: [],
  },
  visible: false,
  loading: false,
  modalreset: false,
  modalresetInput: '',
  modalPing: false,
  modalPort: false,
  inputModalPort: '',
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

  portCancel = () => {
    this.setState({
      modalPort: false,
    })
  }

  resetInputs = () => {
    this.setState({
      inputModalPort: '',
      modalresetInput: '',
    })
  }

  portOk = () => {
    const isIp = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gm
    if (isIp.test(this.state.IP)) {
      this.setState({
        modalPort: false,
      })
      this.testPort()
    } else {
      message.error('O IP informado está inválido.', 5)
    }
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  closeModalPing = () => {
    this.setState({
      modalPing: false
    })
  }

  showModal = () => {
    this.setState({
      visible: true
    })
  }

  showModalPing = () => {
    this.setState({
      modalPing: true
    })
  }

  showModalPort = () => {
    const isIp = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gm
    if (isIp.test(this.state.IP)) {


      this.setState({
        modalPort: true
      })
    } else {
      message.error('O IP informado está inválido.', 5)
    }
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
      if (data.actionPing) {
        if (data.actionPingSucess) {
          this.setState({
            loading: false,
            dataPing: data.ping,
          }, this.showModalPing)
        } else {
          message.error('Ocorreu uma falha, o módulo v4 não foi localizado. Erro: 02.02', 5);
          this.setState({
            loading: false,
            dataPing: defaultState.dataPing,
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

  testPort = async () => {
    const IP = this.state.IP
    const port = this.state.inputModalPort
    this.setState({
      loading: true
    })
    const response = await testPortService(IP, port)
    console.log(response)
    const { erro = { message: '' }, falha = false, data = {}, success = false } = response
    if (success) {
      if (data.actionPort) {
        if (data.actionPortSucess) {
          this.setState({
            loading: false,
          })
          message.success('O relógio está comunicando!', 10)
        } else {
          message.error('O relógio está travado.', 10);
          this.setState({
            loading: false,
          })
        }
      } else {
        this.setState({
          loading: false,
        })
        message.error('Ocorreu uma falha, algo deu muito errado !!!!!!!!!!. Erro: 01.01', 5);
      }
    } else {
      if (falha) {
        this.setState({
          loading: false,
        })
        message.error(erro.message, 5);
      } else {
        this.setState({
          loading: false,
        })
        message.error('Ocorreu uma falha, a conexão com servidor foi perdida, tente novamente. Erro: 02.01!', 5);
      }
    }
    this.resetInputs()
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
            data: data.status
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
    this.resetInputs()
  }

  render() {
    console.log(this.state)
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

    const { dataPing } = this.state

    const {
      address = '',
      attempts = '',
      avg = '',
      max = '',
      min = '',
      port = '',
      results = [],
    } = dataPing
    const minAvg = Math.floor(min)
    const maxAvg = Math.floor(max)
    const medAvg = Math.floor(avg)

    const dataToPlot = results.map(item => ({
      x: item.seq, y: Math.floor(item.time)
    }))

    console.log(dataToPlot)

    return (

      <div className='App'>
        <div className='group'>
          <input
            className='intputIp'
            onChange={this.setValueToInput}
            placeholder="IP"
            name='IP'
            value={this.state.IP}
          />
          <div className='rowMaster'>
            <div className='row'>
              <Button1 name='Ping' click={this.getPing} changed={this.setValueToInput} text='Ping Ip' />
              <Button1 name='Reset' click={this.showResetRelogioModal} changed={this.setValueToInput} text='Reset relógio' />
            </div>
            <div className='row'>
              <Button1 name='Status' click={this.getStatus} changed={this.setValueToInput} text='Status de conexão' />
              <Button1 name='Porta' click={this.showModalPort} changed={this.setValueToInput} text='Test conexão relógio' />
            </div>
          </div>
        </div>

        <div className='div-spin'>
          <Spin
            spinning={this.state.loading}
            size='large'
          />
        </div>


        <Modal
          className='ModalStatus'
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

            <div className='div-p'>
              <div className='modalParagrafo'> Ligado:</div>
              <div className='modalParagrafo'>{tempoLigado} </div>
            </div>

            <div className='div-p'>
              <div className='modalParagrafo'> Conectado:</div>
              <div className='modalParagrafo'>{tempoConectado} </div>
            </div>

            <div className='div-p'>
              <div className='modalParagrafo'> Desconectado:</div>
              <div className='modalParagrafo'>{tempoDesconectado} </div>
            </div>

            <div className='div-p'>
              <div className='modalParagrafo'> Latência:</div>
              <div className='modalParagrafo'>{ping} ms </div>
            </div>

            <div className='div-p'>
              <div className='modalParagrafo'> TP - Link reset:</div>
              <div className='modalParagrafo'> {quantasVezesTPLinkReiniciou} vezes </div>
            </div>

            <div className='div-p'>
              <div className='modalParagrafo'> Versão do Firmware:</div>
              <div className='modalParagrafo'>{firmwareVersion} </div>
            </div>
          </div>
        </Modal>

        <Modal
          title=""
          className='ModalReset'
          visible={this.state.modalreset}
          onOk={this.resetOk}
          onCancel={this.resetCancel}
          centered={true}
        >
          <div className='div-modal-reset'>
            <label className='labelReset'>Por questões de segurança redigite o IP</label>
            <input
              className='intputreset'
              onChange={this.setValueToInput}
              placeholder="IP"
              name='modalresetInput'
              value={this.state.modalresetInput}
            />
          </div>
        </Modal>
        <Modal
          title=""
          className='ModalPing'
          visible={this.state.modalPing}
          onOk={this.closeModalPing}
          onCancel={this.closeModalPing}
          centered={true}
        >
          <div className='div-modal-ping'>

            <label
              className='ping-Data-headerPrimary'>
              <label>Ip: {address}</label> <label>Porta: {port}</label>
            </label>

            {/* <label
              className='ping-Data-labelPrimary'>Latência:</label> */}
            <div className='ping-data-feed'>
              <div className='div-ping-DataHeader'>

                <label
                  className='ping-Data-headerSecundary'>{'mín: '}
                  <label className='ping-Data-headerSecundaryValue'>
                    {minAvg}</label> ms.
            </label>

                <label
                  className='ping-Data-headerSecundary'>{'máx: '}
                  <label className='ping-Data-headerSecundaryValue'>
                    {maxAvg}</label> ms.
            </label>

                <label
                  className='ping-Data-headerSecundary'>{'méd: '}
                  <label className='ping-Data-headerSecundaryValue'>
                    {medAvg}</label>  ms.
            </label>

              </div>
              <div className='div-graph'>

                <MediaQuery minWidth={540}>
                  <XYPlot
                    width={480}
                    height={300}
                    yDomain={[0, (maxAvg + 100)]}
                    margin={{ left: 50 }}

                  >
                    <VerticalBarSeries color="blue" data={dataToPlot} />
                    <XAxis />
                    <YAxis />
                  </XYPlot>
                </MediaQuery>
                <MediaQuery maxWidth={539}>
                  <MediaQuery minWidth={430}>
                    <XYPlot
                      width={380}
                      height={300}
                      yDomain={[0, (maxAvg + 100)]}
                      margin={{ left: 50 }}
                    >
                      <VerticalBarSeries color="blue" data={dataToPlot} />
                      <XAxis />
                      <YAxis />
                    </XYPlot>
                  </MediaQuery>
                  <MediaQuery maxWidth={429}>
                    <MediaQuery minWidth={380}>
                      <XYPlot
                        width={320}
                        height={300}
                        yDomain={[0, (maxAvg + 100)]}
                        margin={{ left: 50 }}
                      >
                        <VerticalBarSeries color="blue" data={dataToPlot} />
                        <XAxis />
                        <YAxis />
                      </XYPlot>
                    </MediaQuery>
                    <MediaQuery maxWidth={379}>
                      <XYPlot
                        width={250}
                        height={300}
                        yDomain={[0, (maxAvg + 100)]}
                        margin={{ left: 50 }}
                      >
                        <VerticalBarSeries color="blue" data={dataToPlot} />
                        <XAxis />
                        <YAxis />
                      </XYPlot>
                    </MediaQuery>
                  </MediaQuery>
                </MediaQuery>

              </div>
            </div>

            <div className='div-ping-DataHeader'></div>
          </div>
        </Modal>

        <Modal
          title=""
          className='ModalReset'
          visible={this.state.modalPort}
          onOk={this.portOk}
          onCancel={this.portCancel}
          centered={true}
        >
          <div className='div-modal-reset'>
            <label className='labelReset'>Digite a porta:</label>
            <input
              className='intputreset'
              onChange={this.setValueToInput}
              placeholder="Port"
              name='inputModalPort'
              value={this.state.inputModalPort}
            />
          </div>
        </Modal>

      </div>
    );
  }
}

export default App;
