import CatchFetch from './fetch'

const listeners = {
  CatchFetch
}

export default function listen () {
  Object.entries(listeners).forEach(([name, fn]) => {
    fn()
  })
}