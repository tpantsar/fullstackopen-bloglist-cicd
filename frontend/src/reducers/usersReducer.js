import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'
import { setNotification } from './notificationReducer'

const logReducerState = (state, action) => {
  console.log('state', JSON.parse(JSON.stringify(state)))
  console.log('action', action)
}

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers: (state, action) => {
      logReducerState(state, action)
      return action.payload
    },
  },
})

// Fetch all users from the server
export const initUsers = () => {
  return async (dispatch) => {
    try {
      const users = await userService.getAll()
      dispatch(setUsers(users))
    } catch (error) {
      console.error('Error fetching users:', error)
      dispatch(setNotification('Error fetching users', 'error', 5))
    }
  }
}

// Create new user
export const createUser = (newUser) => {
  return async (dispatch) => {
    try {
      const user = await userService.createUser(newUser)
      initUsers()
      dispatch(setNotification(`User ${user.username} created`, 'success', 5))
    } catch (error) {
      console.error('Error creating user:', error)
      dispatch(setNotification('Error creating user', 'error', 5))
    }
  }
}

export const { setUsers } = usersSlice.actions
export default usersSlice.reducer
