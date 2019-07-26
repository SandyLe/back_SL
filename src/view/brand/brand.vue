<template>
  <div>
    <div>首页 -> 品牌</div>
    <div>
      <ul v-for="item in datas">
        <li>{{item.id}}{{item.name}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'brand',
  data () {
    return {
      datas: [{
        id: 1,
        name: 'BRAND1'
      }, {
        id: 2,
        name: 'BRAND2'
      }]
    }
  }
}
</script>
