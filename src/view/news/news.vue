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
          <input type="text" class="ivu-input inputFormField" name="form_obj.name" v-model="form_obj.name" id="name"/>
        </FormItem>
        <FormItem>
          <label for="name" class="ivu-form-label-left lableFormField">文章类型：</label>
          <Select @on-change="getItemValue" v-model="form_obj.newsTypeCode" class="ivu-select selectTypeStyle">
            <Option :value="item.code" v-for="item in newsTypeList" v-bind:key="item.code">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <div style="width:20%"><label for="desc" class="ivu-form-label-left lableFormField">内容：</label></div>
          <div style="width:90%; float:left"><editor ref="editor" :value="form_obj.content" @on-change="handleChange" v-model="form_obj.content"/></div>
        </FormItem>
        <FormItem>
          <label for="desc" class="ivu-form-label-left lableFormField">备注：</label>
          <textarea rows="2" cols="100" type="text" class="ivu-input textFormField" name="form_obj.description"  v-model="form_obj.description" id="desc"/>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-draggable="options" title="编辑" fullscreen v-model="modalVisible"  @on-ok="addData" @on-cancel="cancel">
      <Form>
        <FormItem>
          <label for="name" class="ivu-form-label-left lableFormField">标题：</label>
          <input type="text" class="ivu-input inputFormField" name="form_obj.name" v-model="form_obj.name"/>
        </FormItem>
        <FormItem>
          <label for="name" class="ivu-form-label-left lableFormField">文章类型：</label>
          <Select @on-change="getItemValue" v-model="form_obj.newsTypeCode" class="ivu-select selectTypeStyle">
            <Option :value="item.code" v-for="item in newsTypeList" v-bind:key="item.code">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <div style="width:20%"><label for="desc" class="ivu-form-label-left lableFormField">内容：</label></div>
          <div style="width:90%; float:left"><editor ref="editor" :value="form_obj.content" @on-change="handleChange" v-model="form_obj.content" id="content"/></div>
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
import { formatTimeToStr } from '@/libs/util'
import { getNewsTypeList } from '@/api/common'
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
      newsTypeList: [{}],
      loading: true,
      addModalVisible: false,
      modalVisible: false,
      columns: [
        { title: '标题', key: 'name', sortable: true },
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
          // options: ['delete'],
          button: [
            (h, params, vm) => {
              return h('Button', {
                on: {
                  'click': () => {
                    this.modalVisible = true
                    getNewsTypeList().then(res => {
                      this.newsTypeList = res.data.data
                    })
                    getOneData('news', params.row.id).then(res => {
                      this.form_obj = res.data.data
                      this.$refs.editor.setHtml(this.form_obj.content)
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
                    deleteData('news', params.row.id).then(res => {
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
      getNewsTypeList().then(res => {
        this.newsTypeList = res.data.data
      })
    },
    addData () {
      var newsObj = JSON.parse(JSON.stringify(this.form_obj))
      console.log(newsObj)
      saveData('news', newsObj).then((res) => {
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
  .selectTypeStyle{ width: 100px; }
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
