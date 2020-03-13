import React from 'react'
import styled from 'styled-components'

const sizes = {
  small: '0.8em',
  medium: '1.5em',
  large: '2em',
}

export const Text = styled.p`
  font-size: ${props => (props.size ? sizes[props.size] : sizes.medium)};
  color: ${props => (props.color ? props.color : '#d8d8d8')};
`

export const PlayButton = styled.div`
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-left: 14px solid #000;
  border-bottom: 10px solid transparent;
`

export const Cross = styled.div`
  height: 20px;
  width: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0e1219;

  &:before,
  &:after {
    content: '';
    position: absolute;
    height: 5px;
    width: 20px;
    background: rgba(31, 34, 38, 0.65);
  }

  &:before {
    transform: rotate(45deg);
  }

  &:after {
    transform: rotate(-45deg);
  }
`
export const Bar = ({ onButtonPress, Icon }) => (
  <div
    style={{
      height: '80%',
      width: '100%',
      backgroundColor: 'rgba(31, 34, 38, 0.65)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
    }}
  >
    <Icon onClick={onButtonPress} />
  </div>
)

// Simple helper function to attach margin
const attachMarginTo = Component => styled(Component)`
  margin-left: 6px;
`

export const PlayButtonWithLeftMargin = attachMarginTo(PlayButton)
export const CrossWithLeftMargin = attachMarginTo(Cross)

export const ImageWrapper = ({ fillParent, children }) => {
  const wrapperDefaultStyles = {
    maxHeight: '206px',
    width: '306px',
    backgroundColor: 'rgba(60, 40, 1, 0.5)',
    margin: '3px',
  }
  const styles = fillParent
    ? { ...wrapperDefaultStyles, ...{ height: '100%', width: '100%' } }
    : wrapperDefaultStyles
  return <div style={styles}>{children}</div>
}
