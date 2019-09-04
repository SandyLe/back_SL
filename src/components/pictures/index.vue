<template>
    <div class="form-group">
      <label class="control-label">上传图片</label>
      <div class="control-form">
        <div>
          <Select @on-change="getAlbum" v-model="level" class="ivu-select selectLevel">
            <Option :value="item.code" v-for="item in albumDataList" v-bind:key="item.id">{{item.name}}</Option>
          </Select>
        </div>
        <p class="help-block">(建议图片格式为：JPEG/BMP/PNG/GIF，大小不超过5M，最多可上传4张)</p>
        <ul class="upload-imgs">
          <li v-if="imgLen>=4 ? false : true">
            <input type="file" class="upload" @change="addImg" ref="inputer" multiple accept="image/png,image/jpeg,image/gif,image/jpg"/>
            <a class="add"><i class="iconfont icon-plus"></i><p>点击上传</p></a>
          </li>
          <li v-for='(value, key) in imgs' v-bind:key="key">
            <p class="img"><img :src="getObjectURL(value)" style="width: 94px; height: 94px;" /><a class="close" @click="delImg(key)">×</a></p>
          </li>
        </ul>
        <button class="ivu-btn ivu-btn-primary" @click="submitPics">上传</button>
      </div>
    </div>
</template>

<script>
import { uploadFiles } from '@/api/data'
export default {
  name: 'picturesadd',
  data () {
    return {
      formData: new FormData(),
      albumDataList: [{
        'code': 'TUCE',
        'name': '图册'
      }],
      imgs: {},
      imgLen: 0,
      album: ''
    }
  },
  methods: {
    addImg (event) {
      let inputDOM = this.$refs.inputer
      // 通过DOM取文件数据
      this.fil = inputDOM.files
      let oldLen = this.imgLen
      let len = this.fil.length + oldLen
      if (len > 4) {
        alert('最多可上传 4 张，您还可以上传' + (4 - oldLen) + '张')
        return false
      }
      for (let i = 0; i < this.fil.length; i++) {
        let size = Math.floor(this.fil[i].size / 1024)
        if (size > 5 * 1024 * 1024) {
          alert('请选择5M以内的图片！')
          return false
        }
        this.imgLen++
        this.$set(this.imgs, this.fil[i].name + '?' + new Date().getTime() + i, this.fil[i])
      }
    },
    getObjectURL (file) {
      var url = null
      if (window.createObjectURL !== undefined) { // basic
        url = window.createObjectURL(file)
      } else if (window.URL !== undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    },
    delImg (key) {
      this.$delete(this.imgs, key)
      this.imgLen--
    },
    submitPics () {
      for (let key in this.imgs) {
        let name = key.split('?')[0]
        this.formData.append('multipartFiles', this.imgs[key], name)
        this.formData.append('albumCode', this.album)
      }
      uploadFiles('pic', this.formData)
    },
    getAlbum (item) {
      this.album = item
    }

  }
}
</script>

<style scoped>
  .upload-imgs{margin: 10px 0 30px 0;overflow: hidden;font-size: 0;}
  .upload-imgs li{position: relative;width: 118px;height: 118px;font-size: 14px;display: inline-block;padding: 10px;margin-right: 25px;border: 2px dashed #ccc;text-align: center;vertical-align: middle;}
  .upload-imgs li:hover{border-color: $them-color;}
  .upload-imgs .add{display: block;background-color: #ccc;color: #ffffff;height: 94px;padding: 8px 0;}
  .upload-imgs .add .iconfont{padding: 10px 0;font-size: 40px;}
  .upload-imgs li:hover .add{background-color: $them-color;}
  .upload-imgs li .upload{position: absolute;top: 0;bottom: 0;left: 0;right: 0;width: 118px;height: 118px;}
  .upload-imgs .img{position: relative;width: 94px;height: 94px;line-height: 94px;}
  .upload-imgs .img img{vertical-align: middle;}
  .upload-imgs .img .close{display: none;}
  .upload-imgs li:hover .img .close{display: block;position: absolute;right: -6px;top: -10px;line-height: 1;font-size: 22px;color: #aaa;}
</style>
