import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'
import Home from './components/Home';
import SignIn from './features/auth/SignIn'
import SignUp from './features/users/SignUp'
import Prefetch from './features/auth/Prefetch'

import Video from './features/videos/Video'
import PersistLogIn from './features/auth/PersistLogIn'
import User from './features/users/User';
import Search from './components/Search';
import Tag from './components/Tag';


function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route element={<PersistLogIn />}>
          <Route element={<Prefetch />}>
          
          <Route index element={<Home />}/>
            <Route path='signin'>
              <Route index element={<SignIn />} />
              <Route path='signup' element={<SignUp />} />
            </Route> 
            <Route path='search' element={<Search />} />
            <Route path='tag' element={<Tag />} />
            <Route path="video">
              <Route path=":id" element={<Video />} />
            </Route>
            
            <Route path="user">
              <Route path=":id" element={<User />} />
            </Route> 
            </Route>
          
        </Route>
        
      
      </Route>
      
      
    </Routes>
  );
}

export default App;
