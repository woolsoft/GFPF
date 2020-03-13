import React from 'react'
import { compose, withState, lifecycle } from 'recompose'
import { CustomImage } from './image-view'
import { ImageWrapper } from './common.js'

const enhance = compose(
  withState('currentImage', 'setCurrentImage', ''),
  lifecycle({
    componentDidMount() {
      let imageIndex = 0
      const images = this.props.images
      const amountOfImages = images.length
      this.props.setCurrentImage(this.props.images[imageIndex])
      this.interval = setInterval(() => {
        // "Looping" trough the images array
        imageIndex = (imageIndex + 1) % amountOfImages
          this.props.setCurrentImage(images[imageIndex])
      }, 2000)
    },

    componentWillUnmount() {
      clearInterval(this.interval)
    },
  }),
)

const StatelessImageCirculation = ({ currentImage }) => (
  <ImageWrapper fillParent>
    <CustomImage src={encodeURI(`http://localhost:5000${currentImage}`)} />
  </ImageWrapper>
)

export const ImageCirculation = enhance(StatelessImageCirculation)
