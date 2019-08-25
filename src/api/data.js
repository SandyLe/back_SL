import axios from '@/libs/api.request'

export const getTableData = () => {
  return axios.request({
    url: 'http://www.noohle.com/api/cloud/fc/basic/platformMaterial/getPage',
    method: 'get'
  })
}
export const getPageData = pageData => {
  return axios.request({
    url: pageData.identity + '/getPage',
    method: 'get',
    params: pageData
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

export const saveData = (identity, data) => {
  return axios.request({
    url: identity + '/save',
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

export const getOneData = (identity, id) => {
  return axios.request({
    url: identity + '/getOne',
    params: {
      id: id
    },
    method: 'get'
  })
}

export const deleteData = (identity, id) => {
  return axios.request({
    url: identity + '/delete',
    params: {
      id: id
    },
    method: 'post'
  })
}
