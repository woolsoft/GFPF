import React from 'react'
import { Route } from 'react-router-dom'
import styled from 'styled-components'
import { ImageView } from './image-view.js'
import { Text } from './common.js'

const MainContentContainer = styled.div`
  flex: 5;
  background: #333333;
`

export const MainContent = () => {
  return (
    <MainContentContainer>
          {/*//<Route exact path="/" component={DefaultMainContent} />
      //<Route path="/:folder" component={ImageView} />*/}
      <Route path="/" component={ImageView} />
    </MainContentContainer>
  )
}

const DefaultMainContent = () => (
  <div
    style={{
      height: '100vh',
      flex: 5,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
                                  {/*}<Text size="large" color="white" style={{ textAlign: 'center' }}>
      Select a folder on the left to view your images!
                                    </Text>*/}
  </div>
)
