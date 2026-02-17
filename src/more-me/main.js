import '../lib/styles/global.css'
import App from '../lib/components/more-me/App.svelte'
import { mount } from 'svelte'

const app = mount(App, { target: document.getElementById('app') })

export default app
