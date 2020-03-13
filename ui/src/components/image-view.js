import React from 'react'
import fetch from 'isomorphic-fetch'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import lifecycle from 'recompose/lifecycle'
import withState from 'recompose/withState'
import { ImageCirculation } from './image-circulation'
import { PlayButtonWithLeftMargin, Bar, CrossWithLeftMargin, ImageWrapper } from './common'

const ImageContainer = styled.div`
  height: 100vh;
  overflow: scroll;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
`

const Section = styled.div`
  flex: ${props => props.flex};
`

const TopSection = styled(Section)`
  display: flex;
  align-items: center;
`

const BottomSection = styled(Section)`
  display: flex;
  flex-wrap: wrap;
  height: 100%;
`

const enhance = compose(
  withState('images', 'setImages', []),
  withState('activeImage', 'setActiveImage', ''),
  withState('displayCirculation', 'setDisplayCirculation', false),
  withHandlers({
    fetchImages: ({ location, setImages }) => () => {
        fetch(`http://localhost:5000/images/omi`)
        .then(res => (res.ok ? res.json() : Promise.reject(res)))
        .then(({ body }) => setImages(body))
        .catch(error => {
          console.log(error)
        })
    },
  }),
  lifecycle({
    componentDidMount() {
      this.props.fetchImages()
    },

    componentDidUpdate(prevProps) {
      if (prevProps.images !== this.props.images) {
        // Closing preview if route changes
        //if (this.props.activeImage) this.props.setActiveImage('')

        // If switch from one route to another
        // stop image circulation
        //if (this.props.display) this.props.setDisplayCirculation(true)
          this.props.setDisplayCirculation(true)

        //this.props.fetchImages()
      }
    },
  }),
)

const Images = ({ images, onImageClick }) =>
  images.map((imagePath, i) => {
    const fullPath = `http://localhost:5000${imagePath}`
    return (
      <Image onClick={() => onImageClick(fullPath)} key={i} src={fullPath} />
    )
  })

const ImageViewTopbar = ({
  displayActiveImageBar,
  displayCirculationBar,
  toggleImageCirculation,
  resetImage,
}) =>
  displayActiveImageBar ? (
    <Bar onButtonPress={resetImage} Icon={CrossWithLeftMargin} />
  ) : (
    <Bar
      onButtonPress={() => toggleImageCirculation(!displayCirculationBar)}
      Icon={
        displayCirculationBar ? CrossWithLeftMargin : PlayButtonWithLeftMargin
      }
    />
  )

const ImageViewMainContent = ({
  activeImageCirculation,
  images,
  activeImage,
  onImageClick,
}) => {
  if (activeImageCirculation) {
    return <ImageCirculation images={images} />
  }

  return activeImage ? (
    <ImageWrapper fillParent>
      <CustomImage src={activeImage} />
    </ImageWrapper>
  ) : (
       <Images images={images} onImageClick={image => onImageClick(image)} />
  )
}

export const ImageView = enhance(
  ({
    images,
    activeImage,
    setActiveImage,
    displayCirculation,
    setDisplayCirculation,
  }) => {
    return (
      <ImageContainer>
        {/*HW Topsection muss weg
        <TopSection flex={1}>
          <ImageViewTopbar
            toggleImageCirculation={setDisplayCirculation}
            displayActiveImageBar={activeImage}
            displayCirculationBar={displayCirculation}
            resetImage={() => setActiveImage('')}
          />
        </TopSection>
          */}
        <BottomSection flex={6}>
          <ImageViewMainContent
            images={images}
            activeImage={activeImage}
            onImageClick={setActiveImage}
            activeImageCirculation={displayCirculation}
          />
        </BottomSection>
      </ImageContainer>
    )
  },
)

export const Image = ({ src, onClick = () => {} }) => (
  <ImageWrapper>
    <CustomImage src={src} onClick={onClick} />
  </ImageWrapper>
)

export const CustomImage = styled.img`
  width: 100%;
  height: auto;
`
