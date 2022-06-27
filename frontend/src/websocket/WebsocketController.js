import { Subject } from 'rxjs';
import CustomWebSocket from './CustomWebSocket'

// From here https://stackoverflow.com/a/46728427
class WebsocketController {
  static instance = WebsocketController.instance || new WebsocketController()

  static ws;

  static subject;

  constructor() {
    this.subject = new Subject();
    this.connectionHandling();
  }

  connectionHandling() {
    this.ws = new CustomWebSocket(`${process.env.REACT_APP_API_WS_URL}?access_token=${localStorage.getItem('accessToken')}`);

    this.ws.onmessage = (msg) => {
      console.log(msg)
      this.subject.next(JSON.parse(msg.data))
    }
    this.ws.onclose = () => {
      console.log('WebSocket is closed now.');
      setTimeout(() => {
        console.log('Tries to reconnect.');
        this.connectionHandling();
      }, 5000);
    }
  }

  getMessage = () => {
    return this.subject.asObservable()
  }
}

export default WebsocketController
