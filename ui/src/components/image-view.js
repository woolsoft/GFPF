import React from 'react'
import fetch from 'isomorphic-fetch'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import lifecycle from 'recompose/lifecycle'
import withState from 'recompose/withState'
import { ImageCirculation } from './image-circulation'
import { ImageWrapper } from './common'

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
    fetchImages: ({ setImages, images }) => () => {
        fetch(`http://localhost:5000/images/omi`)
        .then(res => (res.ok ? res.json() : Promise.reject(res)))
        .then(({ body }) => {
          const newImages = newImagestoArrayStart(body, images);
          console.log(images,body,newImages)
          setImages(newImages);
        })
        .catch(error => {
          console.log(error)
        })
    },
  }),

  lifecycle({
    componentDidMount() {
      this.props.fetchImages();
      this.interval = setInterval(() => {
        console.log("fetch")
        this.props.fetchImages();
      }, 8000);
    },
    componentDidUpdate(prevProps) {
      if (prevProps.images !== this.props.images) {
          this.props.setDisplayCirculation(true)
      }
    },
    componentWillUnmount() {
      clearInterval(this.interval)
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
  }) => {
    return (
      <ImageContainer>
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


function newImagestoArrayStart(newList, oldList) {
  const listEnd = [];
  const listStart = [];

  newList.forEach(image => {
    if(oldList.filter(
      x => x === image
    ).length === 1) {
      listEnd.push(image);
    }else{
      listStart.push(image);
    }
  });
  console.log("start - end",listStart,listEnd)
  return listStart.concat(listEnd);
}