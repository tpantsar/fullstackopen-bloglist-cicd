import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes, useMatch } from 'react-router-dom'
/* Components */
import BlogPage from './components/BlogPage'
import BlogList from './components/BlogList'
import Menu from './components/Menu'
import Notification from './components/Notification'
import User from './components/User'
import UsersTable from './components/UsersTable'
/* Reducers */
import LoginPage from './components/LoginPage'
import { initBlogs } from './reducers/blogReducer'
import { initUser } from './reducers/userReducer'
import { initUsers } from './reducers/usersReducer'

const App = () => {
  const dispatch = useDispatch()

  const users = useSelector((state) => state.users)
  console.log('users:', users)

  const user = useSelector((state) => state.user)
  console.log('user:', user)

  const blogs = useSelector((state) => state.blogs)

  // Fetch all blogs and users from the server
  useEffect(() => {
    dispatch(initBlogs())
    dispatch(initUsers())
    dispatch(initUser())
  }, [dispatch])

  const userMatch = useMatch('/users/:id')
  const individualUser = userMatch
    ? users.find((user) => user.id === userMatch.params.id)
    : null

  const blogMatch = useMatch('/blogs/:id')
  const individualBlog = blogMatch
    ? blogs.find((blog) => blog.id === blogMatch.params.id)
    : null

  console.log('individualUser:', individualUser)
  console.log('individualBlog:', individualBlog)

  if (user === null || user === undefined || user.length === 0) {
    return <LoginPage />
  }

  return (
    <div className="app-container">
      <Menu user={user} />
      <Notification />
      <Routes>
        <Route path="/" element={<BlogList user={user} />} />
        <Route path="/users" element={<UsersTable users={users} />} />
        <Route path="users/:id" element={<User user={individualUser} />} />
        <Route
          path="blogs/:id"
          element={<BlogPage blog={individualBlog} user={user} />}
        />
      </Routes>
    </div>
  )
}

export default App
