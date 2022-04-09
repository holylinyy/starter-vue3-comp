<script lang="ts">
import { defineComponent } from 'vue'
import props from './props'
export default defineComponent({
  props,
  setup() {
    return {
      msg: 'hello world',
    }
  },
})
</script>

<template>
  <div>
    {{ msg }}
  </div>
</template>

<style lang="less">

</style>
