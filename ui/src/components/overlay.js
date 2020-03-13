import React from 'react'
import styled from 'styled-components'
import { CrossWithLeftMargin, Bar } from './common'

const OverlayContainer = styled.div`
  height: 100vh;
  width: 100%;
  background-color: rgba(56, 53, 53, 0.65);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`

const Content = styled.div`
  height: 80%;
  width: 80%;
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Overlay = ({
  children,
  style = {},
  onButtonPress,
}) => (
  <OverlayContainer className="overlay-container" style={style}>
    <Bar onButtonPress={onButtonPress} Icon={CrossWithLeftMargin} />
    <Content>{children}</Content>
  </OverlayContainer>
)

