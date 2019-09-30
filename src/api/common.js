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

export const getAllAlbums = () => {
  return axios.request({
    url: '/album/getList',
    params: {
    },
    method: 'get'
  })
}

export const getNewsTypeList = () => {
  return axios.request({
    url: '/newsType/getList',
    params: {
    },
    method: 'get'
  })
}

export const getBrandListList = () => {
  return axios.request({
    url: '/brand/getList',
    params: {
    },
    method: 'get'
  })
}

export const getProductListList = (brandCode) => {
  return axios.request({
    url: '/product/getList',
    params: {
      brandCode: brandCode
    },
    method: 'get'
  })
}
