<template>
  <div>
    <Card>
      <picturesadd/>
      <ul class="galary">
        <li v-for="data in imgDatas"  v-bind:key="data.album.code">
          <div>{{data.album.name}}</div>
          <div>
            <ul class="imgGalary">
              <li v-for="item in data.urls"  v-bind:key="item">
                <Tooltip placement="top-start">
                  <img :src="baseUrl + item"/>
                  <div slot="content">
                    <p>双击链接选中复制：</p>
                    <p><i>{{baseUrl + item.replace('-thumbnail','')}} </i></p>
                    <div style="float: right;"><i-button type="primary" shape="circle" size="small" v-on:click="deleteImg(item)">删除 <span style="color: red">X</span></i-button></div>
                    <div class="clearfloat"></div>
                  </div>
                </Tooltip>
              </li>
            </ul>
          </div>
          <div class="clearfloat"></div>
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
    deleteImg: function (item) {
      alert(item)
    }
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
  .galary{ height: inherit;}
  .galary li{font-weight: bolder; list-style-type: none; border-top: solid #e8e8e8 1px; margin-top: 5px;}
  .imgGalary{ height: 100%}
  .imgGalary li{ float: left; margin: 4px; list-style-type: none; border: #e8e8e8 1px solid; border-radius: 3px}
  .imgGalary li:hover{box-shadow: #F5CBD1 1px 1px 2px 1px; border-radius: 3px}
  .clearfloat{clear:both;height:0;font-size:1px;line-height:0px;}
</style>
