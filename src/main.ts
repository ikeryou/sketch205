import { Kv } from './con/kv'
import './style.css'

new Kv({
  el:document.querySelector<HTMLCanvasElement>('#js-con')
})