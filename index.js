import * as fs from 'fs'
import USBDevice from "./USBDevice.js"
import { SerialPort } from "serialport"

import data from './data.json' assert { type: 'json' } 

let devices = []

const parse = name=>{
  return (msg)=>{
    if (!data[name]) data[name] = {}
    
    const [key, val] = msg.split('=')
    
    data[name][key] = val
  }
}


async function main() {
  const list = await SerialPort.list()
  
  for (const device of list) {
    if (device.path) {
      const thisn = new USBDevice({
        path: device.path,
        processor: parse(device.path),
      })
      
      devices.push(thisn)
    }
  }
}


main().then(console.log).catch(console.error)


setInterval(() => {
  fs.writeFileSync('./data.json', JSON.stringify(data))

  console.log(data)
}, 1234);