import CheckIcon from '@mui/icons-material/Check'
import ErrorIcon from '@mui/icons-material/Error'
import InfoIcon from '@mui/icons-material/Info'
import Alert from '@mui/material/Alert'
import { useSelector } from 'react-redux'
import '../styles/Notification.css'

const Notification = () => {
  const { message, type } = useSelector((state) => state.notification)

  if (message === null || message === '' || message === undefined) {
    return null
  }

  if (type === 'error') {
    return (
      <Alert
        style={{ marginTop: 10, marginBottom: 10 }}
        icon={<ErrorIcon fontSize="inherit" />}
        severity="error"
      >
        {message}
      </Alert>
    )
  } else if (type === 'success') {
    return (
      <Alert
        style={{ marginTop: 10, marginBottom: 10 }}
        icon={<CheckIcon fontSize="inherit" />}
        severity="success"
      >
        {message}
      </Alert>
    )
  } else {
    return (
      <Alert
        style={{ marginTop: 10, marginBottom: 10 }}
        icon={<InfoIcon fontSize="inherit" />}
        severity="info"
      >
        {message}
      </Alert>
    )
  }
}

export default Notification
