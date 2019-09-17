<template>
  <div>
    <Card>
      <tables ref="tables" editable searchable search-place="top" v-model="tableData" v-bind:pageData="pageData" :columns="columns"
              @on-delete="handleDelete" v-on:listenToChildEvent="showModalAdd" v-on:updatePageDate="updatePageDate"/>
      <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
    </Card>
    <Modal v-draggable="options" fullscreen title="新增文章" v-model="addModalVisible" @on-ok="addData" @on-cancel="cancel"
           :loading='loading'>
      <Form ref="saveForm" :model="form_obj">
        <FormItem>
          <label for="name" class="ivu-form-label-left lableFormField">标题：</label>
          <input type="text" class="ivu-input inputFormField" name="form_obj.title" v-model="form_obj.title"/>
        </FormItem>
        <FormItem>
          <label for="name" class="ivu-form-label-left lableFormField">文章类型：</label>
          <input type="password" class="ivu-input inputFormField" name="form_obj.password" v-model="form_obj.password"/>
        </FormItem>
        <FormItem>
          <label for="name" class="ivu-form-label-left lableFormField">确认密码：</label>
          <input type="password" class="ivu-input inputFormField" name="form_obj.confirmPassword" v-model="form_obj.confirmPassword"/>
        </FormItem>
        <FormItem>
          <label for="desc" class="ivu-form-label-left lableFormField">描述：</label>
          <editor ref="editor" :value="content" @on-change="handleChange"/>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-draggable="options" title="编辑" fullscreen v-model="modalVisible"  @on-ok="addData" @on-cancel="cancel">
      <Form>
        <FormItem>
          <label for="name" class="ivu-form-label-left lableFormField">名称：</label>
          <input type="text" class="ivu-input inputFormField" name="form_obj.name" v-model="form_obj.name" id="name"/>
        </FormItem>
        <FormItem>
          <label for="desc" class="ivu-form-label-left lableFormField">描述：</label>
          <textarea rows="3" cols="20" type="text" class="ivu-input textFormField" name="form_obj.description"  v-model="form_obj.description" id="desc"/>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getPageData, getOneData, deleteData, saveData } from '@/api/data'
import Editor from '_c/editor'
import { decode } from '@/api/user'
import { formatTimeToStr } from '@/libs/util'
export default {
  name: 'news_page',
  components: {
    Tables,
    Editor
  },
  inject: ['reload'],
  data () {
    return {
      pageData: {
        identity: 'news',
        pageSize: 10,
        currentPage: 1
      },
      form_obj: {
      },
      loading: true,
      addModalVisible: false,
      modalVisible: false,
      columns: [
        { title: '用户名', key: 'name', sortable: true },
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
      console.log(data)
      this.addModalVisible = data
    },
    addData () {
      var userObj = JSON.parse(JSON.stringify(this.form_obj))
      if (!userObj.id) {
        if (userObj.password !== userObj.confirmPassword) {
          alert('两次输入密码不一致！')
          this.loading = false
          this.$nextTick(() => {
            this.loading = true
          })
          return false
        }
      }
      console.log(userObj.password)
      var password = decode(userObj.password)
      userObj.password = password
      console.log(userObj.password)
      saveData('user', userObj).then((res) => {
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
    }
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
  .editor-wrapper * {
    z-index: 100 !important;
  }
  .w-e-menu{
    z-index: 2 !important;
  }
  .w-e-text-container{
    z-index: 1 !important;
  }
</style>
