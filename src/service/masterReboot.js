import axios from  'axios'

const masterReboot = async IP =>{
  let success = false

  await axios.get(`http://${IP}:4560/masterReboot`, { timeout:25000})
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
export default masterReboot