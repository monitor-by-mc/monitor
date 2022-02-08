<template>
  <div class="monitor">
    <button @click="clickHanld">click</button>
    <ul>
      <li v-for="item in liList" :key="item.id">{{ item.name }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      a: 1,
      liList: [
        { id: 0, name: 'myy' },
        { id: 0, name: 'myy' }
      ]
    }
  },
  computed: {
    str() {
      return this.a + 2
    }
  },

  methods: {
    clickHanld() {
      // Promise.reject('test').then()
      let body = document.getElementsByTagName('body')[0]
      let jsNode = document.createElement('script')
      jsNode.setAttribute('type', 'text/javascript')
      jsNode.setAttribute('src', 'http://127.0.0.1:8090/hello.js')
      body.appendChild(jsNode)
    }
  }
}
</script>