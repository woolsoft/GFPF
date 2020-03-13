import React from 'react'
import { Route } from 'react-router-dom'
import styled from 'styled-components'
import { ImageView } from './image-view.js'

const MainContentContainer = styled.div`
  flex: 5;
  background: #333333;
`

export const MainContent = () => {
  return (
    <MainContentContainer>
      <Route path="/" component={ImageView} />
    </MainContentContainer>
  )
}
