const { test, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
]

let listWithMultipleBlogs

// Start each test case with a fresh copy of blog list
beforeEach(() => {
  listWithMultipleBlogs = [...initialBlogs]
})

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0,
    },
  ]

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('when list has multiple blogs equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs)
    assert.strictEqual(result, 36)
  })
})

describe('favorite blog', () => {
  const testBlog = {
    title: 'test-title',
    author: 'test-author',
    url: 'test-url',
    likes: 12,
    __v: 0,
  }

  const expected = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  }

  test('when list has one blog with max likes, return the favorite blog', () => {
    const result = listHelper.favoriteBlog(listWithMultipleBlogs)
    assert.deepStrictEqual(result, expected)
  })

  test('when list has multiple blogs with max likes, return the first favorite blog', () => {
    listWithMultipleBlogs.push(testBlog)
    listWithMultipleBlogs.push(testBlog)
    const result = listHelper.favoriteBlog(listWithMultipleBlogs)
    assert.deepStrictEqual(result, expected)
  })

  test('when list has new favorite blog with max likes, return it', () => {
    testBlog.likes = 13
    listWithMultipleBlogs.push(testBlog)
    const result = listHelper.favoriteBlog(listWithMultipleBlogs)
    assert.deepStrictEqual(result, testBlog)
  })
})

describe('author with most blogs', () => {
  test('when list has one author with max blogs, return the author with most blogs', () => {
    const result = listHelper.mostBlogs(listWithMultipleBlogs)
    const expected = {
      author: 'Robert C. Martin',
      blogs: 3,
    }
    assert.deepStrictEqual(result, expected)
  })

  test('when blog list is empty, return null', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })
})

describe('author with most likes on their blogs', () => {
  test('when list has one author with most likes on their blogs, return the author and likes', () => {
    const result = listHelper.mostLikes(listWithMultipleBlogs)
    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    }
    assert.deepStrictEqual(result, expected)
  })

  test('when list has multiple authors with most likes on their blogs, return the first author with most likes', () => {
    const testBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 5,
      __v: 0,
    }
    listWithMultipleBlogs.push(testBlog)

    const result = listHelper.mostLikes(listWithMultipleBlogs)
    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    }
    assert.deepStrictEqual(result, expected)
  })

  test('when blog list is empty, return null', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })
})
