import React from 'react'
import styled from 'styled-components'
import { MainContent } from './components/main-content.js'

const ApplicationContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
`

export const App = () => {
  return (
    <ApplicationContainer>
      <MainContent />
    </ApplicationContainer>
  )
}

export default App
