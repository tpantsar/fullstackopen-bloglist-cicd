const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const helper = require('./test_helper')

const Blog = require('../mongo/models/blog')
const { User } = require('../mongo')

// Reset the initial state of the database before each test
beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  await Blog.insertMany(helper.initialBlogs)
  await User.insertMany(helper.initialUsers)

  // Create a user and blog for testing
  await helper.createUser(api, 'test-username', 'test-name', 'test-password')

  console.log('resetted database')
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two initial blogs', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, 2)
})

test('the first blog is about React patterns', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map((blog) => blog.title)
  assert(titles.includes('React patterns'))
})

test('a valid blog can be added', async () => {
  console.log('users:', await helper.usersInDb())
  const token = await helper.getValidToken(api, 'test-username', 'test-password')

  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'test-author',
    url: 'test-url',
    likes: 7,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const titles = response.body.map((blog) => blog.title)

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
  assert(titles.includes('async/await simplifies making async calls'))
})

test('blog without token is not added', async () => {
  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'test-author',
    url: 'test-url',
    likes: 7,
  }

  await api.post('/api/blogs').send(newBlog).expect(401)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blog without title is not added', async () => {
  const token = await helper.getValidToken(api, 'test-username', 'test-password')

  const newBlog = {
    author: 'test-author',
    url: 'test-url',
    likes: 7,
  }

  await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(400)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blog without url is not added', async () => {
  const token = await helper.getValidToken(api, 'test-username', 'test-password')

  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'test-author',
    likes: 7,
  }

  await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(400)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('adding a blog without likes defaults to 0 likes', async () => {
  console.log('users:', await helper.usersInDb())
  const token = await helper.getValidToken(api, 'test-username', 'test-password')

  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'test-author',
    url: 'test-url',
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
    .expect((response) => {
      assert.strictEqual(response.body.likes, 0)
    })
})

test('a specific blog can be viewed', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToView = blogsAtStart[0]

  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultBlog.body, blogToView)
})

test('a blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedBlog = { ...blogToUpdate, likes: 10 }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlogAtEnd = blogsAtEnd[0]

  assert.strictEqual(updatedBlogAtEnd.likes, 10)
})

test('blog can be deleted', async () => {
  const token = await helper.getValidToken(api, 'test-username', 'test-password')

  // Create a blog that is deleted later
  const blogToDelete = await helper.createBlog(
    api,
    token,
    'test-title',
    'test-author',
    'test-url',
    7
  )

  console.log('blogToDelete:', blogToDelete)
  const blogsAtStart = await helper.blogsInDb()

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send(blogToDelete)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  const titles = blogsAtEnd.map((blog) => blog.title)

  assert(!titles.includes(blogToDelete.title))
  assert.strictEqual(blogsAtStart.length - 1, blogsAtEnd.length)
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'test-username',
      name: 'test-name',
      password: 'test-password',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username is already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('Username is already taken'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is less than 3 characters long', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ab',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('Username must be at least 3 characters long'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is less than 3 characters long', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'new-username',
      name: 'Superuser',
      password: 'ab',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('Password must be at least 3 characters long'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})
