import {SerialPort} from 'serialport'
import {ReadlineParser} from '@serialport/parser-readline'


class USBDevice {
  data = {proto:'USB Device'}
  path = ''
  
  
  constructor({path, processor}) {
    if (path) this.path = path
    if (processor) this.processor = processor
    
    this.initialize().then(console.log).catch(console.error)
  }
  
  
  async initialize() {
    try {
      this.port = new SerialPort({
        path: this.path,
        baudRate: 115200,
      })
      
      
      this.parser = this.port.pipe(new ReadlineParser({ delimiter: '\r\n' }))
      
      
      this.parser.on('data', this.processor)
      
      
      this.parser.on('open', console.log)
      
      
      this.parser.on('error', console.error)
      
      
      console.log(`USB Device initialized @ ${this.path}`)
    } catch (error) {
        console.error('USB INIT ERR', error)
    }
  }
  
  
  send(msg) {
    this.port.write(`${msg}\r\n`)
  }
}


export default USBDevice