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
      Promise.reject('test').then()
    }
  }
}
</script>