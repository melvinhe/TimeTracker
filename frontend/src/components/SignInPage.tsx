import { Route, Routes } from 'react-router-dom'
import Auth from '../routes/Auth'

interface SignInPageProp {
  message?: string
}

function SignInPage({ message }: SignInPageProp) {
  return (
    <div className="bg-blue-light w-screen h-screen p-4">
      {message === undefined && (
        <header>
          <p>Sign into your Brown gmail account for unrestricted access.</p>
          <p>Or for a restricted viewing access of the TimeTracker app, </p>
          <p>please use personal '@gmail.com' email for sign in. </p>
          <p>{message}</p>
        </header>
      )}
      <main className="mt-8">
        <Routes>
          <Route path="*" element={<Auth />} />
        </Routes>
      </main>
    </div>
  )
}

export default SignInPage
