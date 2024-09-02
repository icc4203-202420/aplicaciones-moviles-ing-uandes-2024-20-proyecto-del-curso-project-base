import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/beers" element={<Beers />} />
        <Route path="/bars" element={<Bars />} />
        <Route path="/bars/:id/events" element={<Events />} />
        <Route path="/search" element={<SearchUser />} />
      </Routes>
    </Router>
  )
}

export default App
