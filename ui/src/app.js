import React from 'react'
import styled from 'styled-components'
import { Sidebar } from './components/sidebar.js'
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
          {/*<Sidebar />*/}
    <MainContent />
    </ApplicationContainer>
  )
}

export default App
