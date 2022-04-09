import type { App, Plugin } from 'vue'
import Main from './main.vue'

const withInstall = <T>(comp: T): T & Plugin => {
  const c: any = comp
  c.install = (app: App) => {
    app.component(c.name, comp)
  }
  return c as T & Plugin
}

const Component = withInstall(Main)

export default Component
