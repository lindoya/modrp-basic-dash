import axios from  'axios'

import { urlBackEnd } from './var'

export const getStatus = async IP =>{

  let responseObject = { 
    success: false,
    falha: false,
    erro: 999,
  }

  await axios.post(`${urlBackEnd}/api/modRp`, { ip: IP, action: 'getStatus' }, { timeout:35000})
  .then(function (response) {
    if(response.status === 200){
      responseObject.success = true
      responseObject = {
        ...responseObject,
        data:response.data
      }
    }
  })
  .catch(function (error) {
    try{
      if(error.response.data.status === 422){
        responseObject.success = false
        responseObject.falha = true
        responseObject.erro = error.response.data.fields[0]
      }else{
        console.log("error");
        console.log(error);
      }
    }catch{
      console.log("error");
      console.log(error);
    }
  })
  return responseObject
}

export const resetRelogio = async IP =>{
  let responseObject = { 
    success: false,
    falha: false,
    erro: 999,
  }

  await axios.post(`${urlBackEnd}/api/modRp`, { ip: IP, action: 'resetRelogio' }, { timeout:35000})
  .then(function (response) {
    if(response.status === 200){
      responseObject.success = true
      responseObject = {
        ...responseObject,
        data:response.data
      }
    }
  })
  .catch(function (error) {
    try{
      if(error.response.data.status === 422){
        responseObject.success = false
        responseObject.falha = true
        responseObject.erro = error.response.data.fields[0]
      }else{
        console.log("error");
        console.log(error);
      }
    }catch{
      console.log("error");
      console.log(error);
    }
  })
  return responseObject
}

export const getPingService = async IP =>{
  let responseObject = { 
    success: false,
    falha: false,
    erro: 999,
  }

  await axios.post(`${urlBackEnd}/api/modRp`, { ip: IP, action: 'ping' }, { timeout:35000})
  .then(function (response) {
    console.log(response)
    if(response.status === 200){
      responseObject.success = true
      responseObject = {
        ...responseObject,
        data:response.data
      }
    }
  })
  .catch(function (error) {
    try{
      if(error.response.data.status === 422){
        responseObject.success = false
        responseObject.falha = true
        responseObject.erro = error.response.data.fields[0]
      }else{
        console.log("error");
        console.log(error);
      }
    }catch{
      console.log("error");
      console.log(error);
    }
  })
  return responseObject
}
