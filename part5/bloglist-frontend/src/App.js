import React, { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const addBlog = (id, blogObject) => {
    blogService
      .create(id, blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      })
    alert('added new blog')
  }

  const blogForm = () => {
    const hideWhenVisible = { display: loginVisible ? '' : 'none' }
    const showWhenVisible = { display: loginVisible ? 'none' : '' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(false)}>New blog</button>
        </div>
        <div style={showWhenVisible}>
          <BlogForm
            createBlog={addBlog}
            setVisibility={() => setLoginVisible(false)}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }


  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={showWhenVisible}>
          <button onClick={() => setLoginVisible(false)}>log in</button>
        </div>
        <div style={hideWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            setUsername={({ target }) => setUsername(target.value)}
            setPassword={({ target }) => setPassword(target.value)}
            handleLogin={handleLogin}
          />
          <button onClick={() => setLoginVisible(true)}>cancel</button>
        </div>
      </div>
    )
  }

  const logOut = (event) => {
    event.preventDefault()
    console.log('uloskirjautuminen ok!')
    window.localStorage.removeItem('loggedBlogappUser')
    window.localStorage.clear()
    window.location = '/'
  }

  const logOutClick = (event) => {
    logOut(event)
    alert(`Logging out ${user.name}`)
  }

  const likeBlog = ((blog) => {
    console.log('toimii', blog)
    blogService.update(blog.id, blog)
      .then(returnedBlog => {
        blogs.concat(returnedBlog)
        console.log('blogit', blogs)
        setBlogs(blogs)
      })
  })

  const deleteBlog = (id) => {
    const deletingBlog = blogs.find((n) => n.id === id.id)
    console.log(deletingBlog)
    blogService
      .erase(id)
      .then((response) => {
        console.log(response)
        setBlogs(blogs)
      })
    window.confirm(`deleting blog ${deletingBlog.title} by ${deletingBlog.author}`)
    window.location = '/'
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={errorMessage} />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h1>Blogs</h1>
      <p>{user.name} logged in</p>
      <button onClick={logOutClick}>Log Out</button>
      <span id="blogs">
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map(blog =>
            <Blog key={blog.id} blog={blog} updateBlog={likeBlog} eraseBlog={deleteBlog} user={user} />
          )}
        {blogForm()}
      </span>
    </div>
  )
}

export default App