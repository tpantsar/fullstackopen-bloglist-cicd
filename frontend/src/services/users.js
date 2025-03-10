import apiClient from './apiClient'
const resourceUrl = '/users'

const getAll = () => {
  const request = apiClient.get(resourceUrl)
  return request.then((response) => response.data)
}

const createUser = (newObject) => {
  const request = apiClient.post(resourceUrl, newObject)
  return request.then((response) => response.data)
}

export default { getAll, createUser }
