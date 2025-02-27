const { Blog } = require('../mongo')
const { User } = require('../mongo')

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const createUser = async (api, username, name, password) => {
  const userResponse = await api
    .post('/api/users')
    .send({
      username: username,
      name: name,
      password: password,
    })
    .expect(201)
    .expect('Content-Type', /application\/json/)

  return userResponse.body
}

const createBlog = async (api, token, title, author, url, likes) => {
  const blogResponse = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: title,
      author: author,
      url: url,
      likes: likes,
    })
    .expect(201)
    .expect('Content-Type', /application\/json/)

  return blogResponse.body
}

const getValidToken = async (api, username, password) => {
  try {
    // eslint-disable-next-line no-debugger
    debugger
    const response = await api
      .post('/api/login')
      .send({
        username: username,
        password: password,
      })
      .expect('Content-Type', /application\/json/)

    if (response.status !== 200) {
      console.error('Failed to get valid token. Status:', response.status)
      console.error('Response body:', response.body)
    }

    return response.body.token
  } catch (error) {
    console.error('Error in getValidToken:', error)
    throw error
  }
}

module.exports = {
  initialBlogs,
  nonExistingId,
  usersInDb,
  blogsInDb,
  createUser,
  createBlog,
  getValidToken,
}
