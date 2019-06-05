import axios from  'axios'

export const getStatus = async IP =>{

  let responseObject = { 
    success: false 
  }

  await axios.post('http://200.196.235.175:5312/api/modRp', { ip: IP, action: 'getStatus' }, { timeout:35000})
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
    responseObject.success = false
      console.log("error");
      console.log(error);
  })
  return responseObject
}

export const resetRelogio = async IP =>{
  let success = false

  await axios.post('http://200.196.235.175:5312/api/modRp', { ip: IP, action: 'resetRelogio' }, { timeout:35000})
  .then(function (response) {
    if(response.status === 200){
      success = true
    }
  })
  .catch(function (error) {
    success = false
      console.log("error");
      console.log(error);
  })
  return success
}
export default resetRelogio