<template>
  <div>
    <Card>
      <tables ref="tables" editable searchable search-place="top" v-model="tableData" :columns="columns" @on-delete="handleDelete" v-on:listenToChildEvent="showModalAdd"/>
      <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
    </Card>
    <Modal v-draggable="options" title="新增用户" v-model="addModalVisible" @on-ok="addData" @on-cancel="cancel">
      <Form ref="saveForm" :model="form_obj">
        <FormItem>
          <label for="name" class="ivu-form-label-left lableFormField">名称：</label>
          <input type="text" class="ivu-input inputFormField" name="form_obj.name" v-model="form_obj.name" id="name"/>
        </FormItem>
        <FormItem>
          <label for="name" class="ivu-form-label-left lableFormField">密码：</label>
          <input type="password" class="ivu-input inputFormField" name="form_obj.password" v-model="form_obj.password"/>
        </FormItem>
        <FormItem>
          <label for="name" class="ivu-form-label-left lableFormField">确认密码：</label>
          <input type="password" class="ivu-input inputFormField" name="form_obj.confirmPassword" v-model="form_obj.confirmPassword"/>
        </FormItem>
        <FormItem>
          <label for="desc" class="ivu-form-label-left lableFormField">描述：</label>
          <textarea rows="3" cols="20" type="text" class="ivu-input textFormField" v-model="form_obj.desc" id="desc"/>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-draggable="options" title="编辑" v-model="modalVisible" >
      <Form>
        <FormItem>
          <label for="name" class="ivu-form-label-left lableFormField">名称：</label>
          <input type="text" class="ivu-input inputFormField" name="form_obj.name" v-model="form_obj.name" id="name"/>
        </FormItem>
        <FormItem>
          <label for="name" class="ivu-form-label-left lableFormField">密码：</label>
          <input type="password" class="ivu-input inputFormField" name="form_obj.password" v-model="form_obj.password"/>
        </FormItem>
        <FormItem>
          <label for="name" class="ivu-form-label-left lableFormField">确认密码：</label>
          <input type="password" class="ivu-input inputFormField" name="form_obj.confirmPassword" v-model="form_obj.confirmPassword"/>
        </FormItem>
        <FormItem>
          <label for="desc" class="ivu-form-label-left lableFormField">描述：</label>
          <textarea rows="3" cols="20" type="text" class="ivu-input textFormField" v-model="form_obj.desc" id="desc"/>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getPageData, getOneData, deleteData, saveData } from '@/api/data'
import { decode, aesDecrypt } from '@/api/user'
import { formatTimeToStr } from '@/libs/util'
export default {
  name: 'users_page',
  components: {
    Tables
  },
  inject: ['reload'],
  data () {
    return {
      form_obj: {
      },
      loading: true,
      addModalVisible: false,
      modalVisible: false,
      columns: [
        { title: '用户名', key: 'name', sortable: true },
        { title: '备注', key: 'desc', editable: true },
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
                      alert(this.form_obj.password)
                      var passwordDecode = aesDecrypt(this.form_obj.password)
                      alert(passwordDecode)
                      console.log(res.data.data)
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
      if (userObj.password !== userObj.confirmPassword) {
        alert('两次输入密码不一致！')
        return
      }
      var password = decode(userObj.password)
      userObj.password = password
      console.log(this.loading)
      saveData('user', userObj).then((res) => {
        alert(JSON.stringify(res))
        this.reload()
      })
    }
  },
  mounted () {
    getPageData('user').then(res => {
      this.tableData = res.data.data.data
      console.log(this.tableData)
    })
  }
}
</script>

<style>

</style>
