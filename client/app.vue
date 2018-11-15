<template>
    <div class="test">{{text}}</div>
</template>

<script>
import './assets/styles/test.css'
import Header from './layout/header.vue'
import Footer from './layout/footer.vue'
import Todo from './views/todo/todo.vue'

export default{
  components: {
    Header,
    Footer,
    Todo
  },
  data () {
    return {
      text: 'apanxiaa'
    }
  }
}
</script>

<style lang="css" scoped>
 .test{
    color:#666
 }
</style>
// scoped指定该样式只在该组件下生效
