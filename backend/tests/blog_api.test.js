const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const { mongoose, Blog, User } = require('../mongo')

// Reset the initial state of the database before each test.
// To ensure that the _id values are not hardcoded, let MongoDB generate them automatically.
// This can be done by creating new Blog objects based on the initialBlogs array and saving them to the database.
beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  // The database is dropped and recreated before each test
  await mongoose.connection.dropDatabase()

  // Create test blogs
  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
  const promiseArray = blogObjects.map((blog) => blog.save())
  await Promise.all(promiseArray)

  // Create a test user
  await helper.createUser(api, 'test-username', 'test-name', 'test-password')

  console.log('resetted database')
  console.log('initialBlogs.length:', helper.initialBlogs.length)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two initial blogs', async () => {
  const response = await api.get('/api/blogs')
  console.log('response.body:', response.body)

  assert.strictEqual(response.body.length, 2)
})

test('the first blog is about React patterns', async () => {
  const response = await api.get('/api/blogs')
  console.log('response.body:', response.body)

  const titles = response.body.map((blog) => blog.title)
  assert(titles.includes('React patterns'))
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
  console.log('response.body:', response.body)

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('a specific blog can be viewed', async () => {
  const blogsAtStart = await helper.blogsInDb()
  console.log('Blogs at start:', blogsAtStart)
  const blogToView = blogsAtStart[0]

  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultBlog.body, blogToView)
})

test('a blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  console.log('Blogs at start:', blogsAtStart)
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

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    //const passwordHash = await bcrypt.hash('sekret', 10)
    //const user = new User({ username: 'root', name: 'Superuser', passwordHash: passwordHash })
    //await user.save()

    await helper.createUser(api, 'root', 'Superuser', 'salainen')
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()
    assert.strictEqual(usersAtStart.length, 1)

    const newUser = {
      username: 'test-username',
      name: 'test-name',
      password: 'test-password',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    console.log('response.body:', response.body)

    const usersAtEnd = await helper.usersInDb()
    console.log('usersAtEnd:', usersAtEnd)
    assert.strictEqual(usersAtEnd.length, 2)

    const usernames = usersAtEnd.map((u) => u.username)
    console.log('usernames:', usernames)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username is already taken', async () => {
    const usersAtStart = await helper.usersInDb()
    assert.strictEqual(usersAtStart.length, 1)

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    console.log('response.body:', response.body)

    assert(response.body.error.includes('Username is already taken'))

    const usersAtEnd = await helper.usersInDb()
    console.log('usersAtEnd:', usersAtEnd)

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is less than 3 characters long', async () => {
    const usersAtStart = await helper.usersInDb()
    assert.strictEqual(usersAtStart.length, 1)

    const newUser = {
      username: 'ab',
      name: 'Superuser',
      password: 'salainen',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    console.log('response.body:', response.body)

    assert(response.body.error.includes('Username must be at least 3 characters long'))

    const usersAtEnd = await helper.usersInDb()
    console.log('usersAtEnd:', usersAtEnd)

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is less than 3 characters long', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'new-username',
      name: 'Superuser',
      password: 'ab',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    console.log('response.body:', response.body)

    const usersAtEnd = await helper.usersInDb()
    assert(response.body.error.includes('Password must be at least 3 characters long'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})
