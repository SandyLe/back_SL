<template>
  <div>
    <Card>
      <tables ref="tables" editable searchable search-place="top" v-model="tableData" :columns="columns" @on-delete="handleDelete" v-on:listenToChildEvent="showModalAdd"/>
      <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
      <div>ss{{addModalVisible}}</div>
    </Card>
    <Modal v-draggable="options" title="新增" v-model="addModalVisible" @on-ok="addData" @on-cancel="cancel">
      <Form ref="saveForm" :model="form_obj">
        <FormItem>
          <label for="name" class="ivu-form-label-left lableFormField">名称：</label>
          <input type="text" class="ivu-input inputFormField" name="form_obj.name" v-model="form_obj.name" id="name"/>
        </FormItem>
        <FormItem>
          <label for="desc" class="ivu-form-label-left lableFormField">描述：</label>
          <textarea rows="3" cols="20" type="text" class="ivu-input textFormField" v-model="form_obj.desc" id="desc"/>
        </FormItem>
        <FormItem>
          <label for="pic" class="ivu-form-label-left lableFormField">主图：</label>
          <input type="file" class="inputFormField" id="pic"/>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-draggable="options" title="编辑" v-model="modalVisible" >
      <Form>
        <FormItem>
          <label for="name" class="ivu-form-label-left lableFormField">名称：</label>
          <input type="text" class="ivu-input inputFormField" name="name" id="name" :value="form_obj.name"/>
        </FormItem>
        <FormItem>
          <label for="desc" class="ivu-form-label-left lableFormField">描述：</label>
          <textarea rows="3" cols="20" type="text" class="ivu-input textFormField" name="desc" id="desc"/>
        </FormItem>
        <FormItem>
          <label for="pic" class="ivu-form-label-left lableFormField">主图：</label>
          <input type="file" class="inputFormField" name="pic" id="pic"/>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getPageData, getOneData, deleteData } from '@/api/data'
export default {
  name: 'users_page',
  components: {
    Tables
  },
  data () {
    return {
      form_obj: {
      },
      addModalVisible: false,
      modalVisible: false,
      columns: [
        { title: 'Name', key: 'name', sortable: true },
        { title: 'Email', key: 'email', editable: true },
        { title: 'Create-Time', key: 'createTime' },
        { title: 'Create-Time1', key: 'createTime1' },
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
      alert(JSON.stringify(this.form_obj))
      saveData('user', this.form_obj).then((res) => {
        alert(JSON.stringify(res))
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
