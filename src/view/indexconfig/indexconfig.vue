<template>
  <div>
    <Card>
      <tables ref="tables" editable searchable search-place="top" v-model="tableData" v-bind:pageData="pageData" :columns="columns"
              @on-delete="handleDelete" v-on:listenToChildEvent="showModalAdd" v-on:updatePageDate="updatePageDate"/>
      <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
    </Card>
    <Modal v-draggable="options" title="新增页面配置" v-model="addModalVisible" @on-ok="addData" @on-cancel="cancel"
           :loading='loading'>
      <Form ref="saveForm" :model="form_obj">
        <FormItem>
          <label for="name" class="ivu-form-label-left lableFormField">序号：</label>
          <input type="text" class="ivu-input inputFormField" name="form_obj.weight" v-model="form_obj.weight"/>
        </FormItem>
        <FormItem>
          <label for="name" class="ivu-form-label-left lableFormField">主图：</label>
          <input type="text" class="ivu-input inputFormField" name="form_obj.url" v-model="form_obj.url"/>
        </FormItem>
        <FormItem>
          <label for="desc" class="ivu-form-label-left lableFormField">描述：</label>
          <textarea rows="3" cols="20" type="text" class="ivu-input textFormField" name="form_obj.description" v-model="form_obj.description" id="description"/>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-draggable="options" title="编辑页面配置" v-model="modalVisible"  @on-ok="addData" @on-cancel="cancel">
      <Form>
        <FormItem>
          <label for="name" class="ivu-form-label-left lableFormField">序号：</label>
          <input type="text" class="ivu-input inputFormField" name="form_obj.weight" v-model="form_obj.weight"/>
        </FormItem>
        <FormItem>
          <label for="name" class="ivu-form-label-left lableFormField">主图：</label>
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
export default {
  name: 'indexconfig_page',
  components: {
    Tables
  },
  inject: ['reload'],
  data () {
    return {
      pageData: {
        identity: 'indexConfig',
        pageSize: 10,
        currentPage: 1
      },
      form_obj: {
      },
      loading: true,
      options: true,
      addModalVisible: false,
      modalVisible: false,
      productTypeList: [],
      columns: [
        { title: '序号', key: 'weight', sortable: true },
        { title: '路径地址', key: 'url', editable: true },
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
          button: [
            (h, params, vm) => {
              return h('Button', {
                on: {
                  'click': () => {
                    this.modalVisible = true
                    getOneData('indexConfig', params.row.id).then(res => {
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
                    deleteData('indexConfig', params.row.id).then(res => {
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
    },
    addData () {
      var indexConfigObj = JSON.parse(JSON.stringify(this.form_obj))
      saveData('indexConfig', indexConfigObj).then((res) => {
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
</style>
