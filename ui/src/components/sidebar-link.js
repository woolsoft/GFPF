import React from 'react'
import { MdFolder, MdFolderOpen } from 'react-icons/lib/md'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { Text } from './common.js'

const SidebarLinkContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 128px;
  background: #0e1219;
  align-items: center;
`

const Filling = styled.div`
  background: ${props => props.background};
  width: 10px;
  height: 100%;
`
const TextContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props => props.backgroundColor};
  flex-direction: column;
`

export const SidebarLink = withRouter(({ name, path, isActive, history }) => {
  return (
    <SidebarLinkContainer onClick={() => history.push(path)}>
      <Filling background={isActive ? '#feb15f' : '#0e1219'} />
      <TextContainer
        backgroundColor={isActive ? 'rgba(29, 35, 45, 0.85)' : 'inherit'}
      >
        <Text size={'medium'}>{name}</Text>
      </TextContainer>
    </SidebarLinkContainer>
  )
})
