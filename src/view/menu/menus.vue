<template>
  <div>
    <Card>
      <tables ref="tables" editable searchable search-place="top" v-model="tableData" v-bind:pageData="pageData" :columns="columns"
              @on-delete="handleDelete" v-on:listenToChildEvent="showModalAdd" v-on:updatePageDate="updatePageDate"/>
    </Card>
    <Modal v-draggable="options" title="新增菜单" v-model="addModalVisible" @on-ok="addData" @on-cancel="cancel"
           :loading='loading'>
      <Form ref="saveForm" :model="form_obj">
        <FormItem>
          <label for="name" class="ivu-form-label-left lableFormField">名称：</label>
          <input type="text" class="ivu-input inputFormField" name="form_obj.name" v-model="form_obj.name" id="name"/>
        </FormItem>
        <FormItem>
          <label for="name" class="ivu-form-label-left lableFormField">类型：</label>
          <RadioGroup v-model="form_obj.type">
            <Radio label="1">跳转菜单</Radio>
            <Radio label="0">普通菜单</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem>
          <label for="name" class="ivu-form-label-left lableFormField">等级：</label>
          <Select @on-change="getItemValue" v-model="form_obj.level" class="ivu-select selectLevel">
            <Option :value="item.code" v-for="item in levelDataList" v-bind:key="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem :class="parentVisible" >
          <label for="name" class="ivu-form-label-left lableFormField">父菜单：</label>
          <Select v-model="form_obj.parent" class="ivu-select selectLevel">
            <Option :value="item.code" v-for="item in parentList" v-bind:key="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <label for="name" class="ivu-form-label-left lableFormField">URL：</label>
          <input type="text" class="ivu-input inputFormField" name="form_obj.url" v-model="form_obj.url"/>
        </FormItem>
        <FormItem>
          <label for="desc" class="ivu-form-label-left lableFormField">描述：</label>
          <textarea rows="3" cols="20" type="text" class="ivu-input textFormField" name="form_obj.description" v-model="form_obj.description" id="description"/>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-draggable="options" title="编辑" v-model="modalVisible"  @on-ok="addData" @on-cancel="cancel">
      <Form>
        <FormItem>
          <label for="name" class="ivu-form-label-left lableFormField">名称：</label>
          <input type="text" class="ivu-input inputFormField" name="form_obj.name" v-model="form_obj.name" id="name"/>
        </FormItem>
        <FormItem>
          <label for="name" class="ivu-form-label-left lableFormField">类型：</label>
          <RadioGroup v-model="form_obj.type">
            <Radio label="1">跳转菜单</Radio>
            <Radio label="0">普通菜单</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem>
          <label for="name" class="ivu-form-label-left lableFormField">等级：</label>
          <Select @on-change="getItemValue" v-model="form_obj.level" class="ivu-select selectLevel">
            <Option :value="item.code" v-for="item in levelDataList" v-bind:key="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem :class="parentVisible" >
          <label for="name" class="ivu-form-label-left lableFormField">父菜单：</label>
          <Select v-model="form_obj.parent" class="ivu-select selectLevel">
            <Option :value="item.code" v-for="item in parentList" v-bind:key="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <label for="name" class="ivu-form-label-left lableFormField">URL：</label>
          <input type="text" class="ivu-input inputFormField" name="form_obj.url" v-model="form_obj.url"/>
        </FormItem>
        <FormItem>
          <label for="desc" class="ivu-form-label-left lableFormField">描述：</label>
          <textarea rows="3" cols="20" type="text" class="ivu-input textFormField" name="form_obj.description" v-model="form_obj.description" id="description"/>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getPageData, getOneData, deleteData, saveData } from '@/api/data'
import { formatTimeToStr } from '@/libs/util'
import { getMenuList } from '@/api/common'
export default {
  name: 'menus_page',
  components: {
    Tables
  },
  inject: ['reload'],
  data () {
    return {
      pageData: {
        identity: 'menu',
        pageSize: 10,
        currentPage: 1
      },
      loading: true,
      options: true,
      form_obj: {
      },
      levelDataList: [{
        id: 1,
        code: '1',
        name: '一'
      }, {
        id: 2,
        code: '2',
        name: '二'
      }],
      parentList: [{}],
      addModalVisible: false,
      modalVisible: false,
      parentVisible: 'parentHidden',
      columns: [
        { title: '名称', key: 'name', sortable: true },
        { title: '等级',
          key: 'level',
          render: (h, params) => {
            if (params.row.level === '1') {
              return h('div', '跳转菜单')
            } else if (params.row.level === '0') {
              return h('div', '普通菜单')
            }
          }
        },
        { title: '父菜单', key: 'parentDto.name', sortable: true },
        { title: 'URL', key: 'url', sortable: true },
        { title: '备注', key: 'description', editable: true },
        { title: '创建时间',
          key: 'createDate',
          render: (h, params) => {
            return h('div', formatTimeToStr(new Date(params.row.createDate), 'yyyy-MM-dd hh:mm'))
          }
        },
        { title: '更新时间',
          key: 'updateDate',
          render: (h, params) => {
            return h('div', formatTimeToStr(new Date(params.row.updateDate), 'yyyy-MM-dd hh:mm'))
          }
        },
        {
          title: 'Handle',
          key: 'handle',
          // options: ['delete'],
          button: [
            (h, params, vm) => {
              return h('Button', {
                on: {
                  'click': () => {
                    this.modalVisible = true
                    getOneData('user', params.row.id).then(res => {
                      this.form_obj = res.data.data
                    })
                  }
                }
              }, '编辑')
            }, (h, params, vm) => {
              return h('Poptip', {
                props: {
                  confirm: true,
                  title: '你确定要删除吗?'
                },
                on: {
                  'on-ok': () => {
                    deleteData('user', params.row.id).then(res => {
                    })
                    vm.$emit('on-delete', params)
                    vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
                  }
                }
              }, [
                h('Button', '删除')
              ])
            }
          ]
        }
      ],
      tableData: []
    }
  },
  methods: {
    handleDelete (params) {
      console.log(params)
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    },
    showModalAdd (data) {
      this.addModalVisible = data
    },
    addData () {
      var userObj = JSON.parse(JSON.stringify(this.form_obj))
      console.log(userObj.password)
      saveData('menu', userObj).then((res) => {
        alert('操作成功')
        this.reload()
      })
    },
    updatePageDate (pageData) {
      this.pageData = pageData
      getPageData(this.pageData).then(res => {
        this.tableData = res.data.data.data
        delete res.data.data.data
        this.pageData = res.data.data
      })
    },
    getItemValue (item) {
      this.parentVisible = 'parentShow'
      getMenuList('1', '').then(res => {
        this.parentList = res.data.data
      })
    },
    cancel () {}
  },
  mounted () {
    getPageData(this.pageData).then(res => {
      this.tableData = res.data.data.data
      delete res.data.data.data
      this.pageData = res.data.data
    })
  }
}
</script>

<style>
  .selectLevel{ width: 100px; }
  .parentHidden{ display: none}
  .parentShow{ display: inherit}
</style>
