import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Snippet from './components/Snippet'
import ViewSnippet from './components/ViewSnippet'

const router = createBrowserRouter(
  [
    {
      path:"/",
      element:
      <div>
        <Navbar />
        <Home />
      </div>
      
    },
    {
      path:"/snippets",
      element:
      <div>
        <Navbar />
        <Snippet />
      </div>
      
    },{
      path:"/snippets/:id",
      element:
      <div>
        <Navbar />
        <ViewSnippet />
      </div>
      
    },
  ]
  
)

function App() {

  return (
   <div>
    <RouterProvider router={router} />

    
   </div>
  )
}

export default App
