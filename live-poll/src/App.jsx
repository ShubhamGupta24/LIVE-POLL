import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from './components/Home';
import { EnterName } from './components/StudentEnterName';
import { Questions } from './components/Questions';
import { CreateQuestions } from './components/CreateQuestions';
import { PollPreview } from './components/PollPreview';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/enterName' element={<EnterName />} />
          <Route exact path='/questions' element={<Questions />} />
          <Route exact path='/createQuestions' element={<CreateQuestions />} />
          <Route exact path='/poll/:pollId' element={<PollPreview />} />
        </Routes>
      </Router>
    </>
  )
}

export default App