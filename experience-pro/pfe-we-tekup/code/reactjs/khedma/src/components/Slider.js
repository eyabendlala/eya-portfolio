import React, { useEffect, useRef, useState } from 'react';
import './Slider.css';
import backgroundImg from '../cssjs/images/backgroundkhedma.png';
import secondbackground from '../cssjs/images/bg2khedma.png';
import SearchBar from '../pages/SearchBar';

function Slider(props) {
  const slideImgRef = useRef(null);
  const images = [backgroundImg, secondbackground];
  const len = images.length;
  let i = 1; // Start from index 1 to skip the initial backgroundImg

  useEffect(() => {
    slideImgRef.current.src = backgroundImg; // Set the initial backgroundImg

    const slider = setInterval(() => {
      if (i > len - 1) {
        i = 0;
      }
      slideImgRef.current.src = images[i];
      i++;
    }, 7000);

    return () => {
      clearInterval(slider);
    };
  }, [images, len]);
  const [selectedType, setSelectedType] = useState('Durable');
  const [selectedRegion, setSelectedRegion] = useState('Tunis');

  return (
    <div className='banner'>
      <div className='slider'>
            <img ref={slideImgRef} id="slideImg" alt="Slider"  />
      </div>
      <div className='overlay'>
        <div className='content'>
        <p>Votre Prochaine Aventure Avec Khedma: Explore, Épanouis-toi, Réussis!</p>                <SearchBar applyFiltering={props.applyFiltering}
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                  selectedRegion={selectedRegion}
                  setSelectedRegion={setSelectedRegion}
                />
        </div>
      </div>
    </div>
  );
}

export default Slider;
