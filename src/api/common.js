import axios from '@/libs/api.request'

export const getMenuList = (level, parent) => {
  return axios.request({
    url: '/menu/getList',
    params: {
      level: level,
      parent: parent
    },
    method: 'get'
  })
}

export const getAllPics = () => {
  return axios.request({
    url: '/pic/getList',
    params: {
    },
    method: 'get'
  })
}
