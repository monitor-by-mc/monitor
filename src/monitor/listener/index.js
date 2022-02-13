import CatchFetch from './fetch'
import EventListener from './event'

const listeners = {
  CatchFetch,
  EventListener
}

export default function listen () {
  Object.entries(listeners).forEach(([name, fn]) => {
    fn()
  })
}