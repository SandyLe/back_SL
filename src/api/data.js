import axios from '@/libs/api.request'

export const getTableData = () => {
  return axios.request({
    url: 'http://www.noohle.com/api/cloud/fc/basic/platformMaterial/getPage',
    method: 'get'
  })
}

export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  return axios.request({
    url: 'save_error_logger',
    data: info,
    method: 'post'
  })
}

export const saveData = data => {
  return axios.request({
    url: 'http://localhost:8082/demo/test/goal/save',
    data: JSON.stringify(data),
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'token': ''
    }
  })
}

export const uploadImg = formData => {
  return axios.request({
    url: 'image/upload',
    data: formData
  })
}

export const getOrgData = () => {
  return axios.request({
    url: 'get_org_data',
    method: 'get'
  })
}

export const getTreeSelectData = () => {
  return axios.request({
    url: 'get_tree_select_data',
    method: 'get'
  })
}

export const getOneData = id => {
  return axios.request({
    url: 'http://www.noohle.com/api/cloud/fc/basic/platformMaterial/getOne',
    params: {
      id: id
    },
    method: 'get'
  })
}
