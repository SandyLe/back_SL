<template>
  <div>
    <Card>
      <tables ref="tables" editable searchable search-place="top" v-model="tableData" v-bind:pageData="pageData" :columns="columns"
              @on-delete="handleDelete" v-on:listenToChildEvent="showModalAdd" v-on:updatePageDate="updatePageDate"/>
      <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
    </Card>
    <Modal v-draggable="options" title="关联文章" v-model="addModalVisible" @on-ok="addData" @on-cancel="cancel"
           :loading='loading'>
      <Form ref="saveForm" :model="form_obj">
        <FormItem>
          <label for="name" class="ivu-form-label-left lableFormField">菜单：</label>
          <Select v-model="form_obj.menuCode" class="ivu-select selectLevel">
            <Option :value="item.code" v-for="item in menuList" v-bind:key="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <label for="name" class="ivu-form-label-left lableFormField">文章类型：</label>
          <Select v-model="form_obj.newsTypeCode" class="ivu-select selectLevel">
            <Option :value="item.code" v-for="item in newsTypeList" v-bind:key="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-draggable="options" title="编辑关联文章" v-model="modalVisible"  @on-ok="addData" @on-cancel="cancel">
      <Form>
        <FormItem>
          <label for="name" class="ivu-form-label-left lableFormField">菜单：</label>
          <Select v-model="form_obj.menuCode" class="ivu-select selectLevel">
            <Option :value="item.code" v-for="item in menuList" v-bind:key="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <label for="name" class="ivu-form-label-left lableFormField">文章类型：</label>
          <Select v-model="form_obj.newsTypeCode" class="ivu-select selectLevel">
            <Option :value="item.code" v-for="item in newsTypeList" v-bind:key="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getPageData, getOneData, deleteData, saveData } from '@/api/data'
import { formatTimeToStr } from '@/libs/util'
import { getMenuList, getNewsTypeList } from '@/api/common'
export default {
  name: 'menuNewsType_page',
  components: {
    Tables
  },
  inject: ['reload'],
  data () {
    return {
      pageData: {
        identity: 'menuNewsType',
        pageSize: 10,
        currentPage: 1
      },
      form_obj: {
      },
      menuList: [],
      newsTypeList: [],
      loading: true,
      options: true,
      addModalVisible: false,
      modalVisible: false,
      columns: [
        { title: '菜单',
          key: 'menu',
          render: (h, params) => {
            return h('div', params.row.menu.name)
          }
        },
        { title: '文章类型',
          key: 'newsType',
          render: (h, params) => {
            return h('div', params.row.newsType.name)
          }
        },
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
          button: [
            (h, params, vm) => {
              return h('Button', {
                on: {
                  'click': () => {
                    this.modalVisible = true
                    getMenuList('', '').then(res => {
                      this.menuList = res.data.data
                    })
                    getNewsTypeList().then(res => {
                      this.newsTypeList = res.data.data
                    })
                    getOneData('menuNewsType', params.row.id).then(res => {
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
                    deleteData('menuNewsType', params.row.id).then(res => {
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
      this.form_obj = {}
      this.addModalVisible = data
      getMenuList('', '').then(res => {
        this.menuList = res.data.data
      })
      getNewsTypeList().then(res => {
        this.newsTypeList = res.data.data
      })
    },
    addData () {
      var menuNewsTypeObj = JSON.parse(JSON.stringify(this.form_obj))
      saveData('menuNewsType', menuNewsTypeObj).then((res) => {
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
</style>
