import axios from '@/libs/api.request'
import crypto from 'crypto'

export const login = ({ userName, password }) => {
  let pass = getMD5(password + 'b492f97ca837625b3d2ad39fdd5518ed')
  console.log(pass)
  const data = {
    'userName': userName,
    'password': pass
  }
  return axios.request({
    url: 'http://localhost:8082/demo/api/login',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'token': ''
    }
  })
}

export const getMD5 = (pass) => {
  let md5 = crypto.createHash('md5')
  md5.update(pass)
  return md5.digest('hex')
}

export const getUserInfo = (token) => {
  return axios.request({
    url: 'get_info',
    params: {
      token
    },
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}
