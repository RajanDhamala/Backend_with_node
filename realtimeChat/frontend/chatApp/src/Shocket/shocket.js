import {io} from 'socket.io-client'

const shocket=io('http://localhost:8000')

export default shocket