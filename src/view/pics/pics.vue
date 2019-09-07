<template>
  <div>
    <Card>
      <picturesadd/>
      <ul class="galary">
        <li v-for="data in imgDatas"  v-bind:key="data.album.code">
          <div>{{data.album.name}}</div>
          <div>
            <ul class="imgGalary">
              <li v-for="item in data.urls"  v-bind:key="item"><img :src="baseUrl + item"/> </li>
            </ul>
          </div>
        </li>
      </ul>
      <div class="clearfloat"></div>
    </Card>
  </div>
</template>

<script>
import picturesadd from '@/components/pictures'
import config from '@/config'
import { getAllPics } from '@/api/common'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

export default {
  name: 'menus_page',
  components: {
    picturesadd
  },
  inject: ['reload'],
  data () {
    return {
      baseUrl: baseUrl,
      imgsrc: '/upload/bs00.jpg',
      imgDatas: [{
        album: { 'code': 'TUCE', 'name': '1图册' },
        urls: ['/upload/bs00.jpg']
      }]
    }
  },
  methods: {
  },
  mounted () {
    getAllPics().then(res => {
      this.imgDatas = res.data.data
      console.log(this.imgDatas)
    })
  }
}
</script>

<style>
  .selectLevel{ width: 100px; }
  .parentHidden{ display: none}
  .parentShow{ display: inherit}
  .galary{ height: inherit}
  .imgGalary{ height: 100%}
  .imgGalary li{ float: left; margin: 4px; list-style-type: none; border: #BFBFBF 2px dot-dot-dash}
  .clearfloat{clear:both;height:0;font-size:1px;line-height:0px;}
</style>
