const debug = require('debug')('touchstone:hardware.devices')
const USBDevice = require('./USBDevice')

const connectedDevices = {}


async function connect(name,path) {
  try {
    if (path.includes('[')) return 'invalid path'
    
    if (connectedDevices[name]) {
      return `${name} @ ${path} ALREADY CONNECTED`
    }
    
    const device = new USBDevice()
    
    debug('WANT TO INIT USB DEVICE', path, 'AS', name)
    
    await device.initialize(path)
    
    connectedDevices[name] = device
  } catch (error) {
    console.error(error)
  }
}


function data(name) {
  const device = connectedDevices[name]
  
  if (device) {
    return device.data
  } else {
    return {error: 'device not found'}
  }
}


async function list() {
  try {
    const {SerialPort} = require('serialport')
    
    let result = await SerialPort.list()
    
    return result
  } catch (error) {
    console.error(error)
  }
}


module.exports = {connect,data,list}