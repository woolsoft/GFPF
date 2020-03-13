import React from 'react'
import fetch from 'isomorphic-fetch'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import lifecycle from 'recompose/lifecycle'
import withState from 'recompose/withState'
import {
  ImageWrapper
} from './common'

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
  withState('imageIndex', 'setImageIndex', 0),
  withHandlers({
    fetchImages: ({
      setImages,
      images,
      imageIndex,
      setImageIndex
    }) => () => {
      fetch(`http://localhost:5000/images/omi`)
        .then(res => (res.ok ? res.json() : Promise.reject(res)))
        .then(({
          body
        }) => {
          const {newImages, newIndex} = newImagestoArrayStart(body, images, imageIndex);
          console.log("set order", newImages)
          setImages(newImages);
          setImageIndex(newIndex);
        })
        .catch(error => {
          console.log(error)
        })
    },
  }),

  lifecycle({
    componentDidMount() {
      // initially load images
      this.props.fetchImages();

      // setup refetching the images
      this.fetchInterval = setInterval(() => {
        console.log("refetch")
        this.props.fetchImages();
      }, 8000); // Millisekunden bis nach neuen Bildern gesucht wird.

      // setup replacing the current image with the next one
      this.updateInterval = setInterval(() => {
        if (this.props.images.length === 0) {
          return;
        }
        console.log("update image", this.props.imageIndex)
        this.props.setActiveImage(this.props.images[this.props.imageIndex])
        this.props.setImageIndex((this.props.imageIndex + 1) % this.props.images.length);
      }, 4000) // Millisekunden bis ein neues Bild angezeigt wird.

    },
    componentDidUpdate(prevProps) {

    },
    componentWillUnmount() {
      clearInterval(this.fetchInterval)
      clearInterval(this.updateInterval)
    },
  }),
)

const ImageViewMainContent = ({
  activeImage,
}) => {
  return (
    <ImageWrapper fillParent>
      <CustomImage src={encodeURI(`http://localhost:5000${activeImage}`)} />
    </ImageWrapper>
  )
}

export const ImageView = enhance(
  ({
    images,
    activeImage,
  }) => {
    return (
      <ImageContainer>
        <BottomSection flex={6}>
          <ImageViewMainContent
            images={images}
            activeImage={activeImage}
          />
        </BottomSection>
      </ImageContainer>
    )
  },
)

export const Image = ({ src }) => {
  return (
  <ImageWrapper>
    <CustomImage src={src}/>
  </ImageWrapper>
)}

export const CustomImage = styled.img`
  width: 100%;
  height: auto;
`


function newImagestoArrayStart(newList, oldList, index) {
  const newEntries = getNewEntries(newList,oldList);
  const {deletedEntries, stayingEntries} = getDeleted(newList, oldList);

  if(newEntries.length > 0) {
    console.log("something new")
    return {
      newImages: newEntries.concat(stayingEntries),
      newIndex: 0
    };
  }

  if(deletedEntries.length > 0) {
    console.log("something left")
    return {
      newImages: stayingEntries,
      newIndex: getNewIndex(oldList,deletedEntries,index)
    };
  }

  console.log("nothing to do")
  return {
    newImages: oldList,
    newIndex: index
  };
}

function getNewEntries(newList, oldList) {
  const newEntries = [];
  newList.forEach(image => {
    if (oldList.filter( x => x === image ).length === 0 ) {
        newEntries.push(image);
    }
  });
  return newEntries;
}

function getDeleted(newList, oldList) {
  const deletedEntries = [];
  const stayingEntries = [];
  oldList.forEach(image => {
    if ( newList.filter( x => x === image ).length === 0 ) {
      deletedEntries.push(image);
    }else {
      stayingEntries.push(image);
    }
  });
  return {deletedEntries, stayingEntries};
}

function getNewIndex(oldList, deletedEntries, index){
  let newIndex = index;
  
  for (let i = 0; i < index; i++) {
    const deletedIndex = oldList.indexOf(deletedEntries[i]);
    if(deletedIndex < index) {
      newIndex--;
    }
  }

  return newIndex;
}