// GoogleTranslate.js
import React, { useEffect } from 'react';
import './Translate.css'; 


const GoogleTranslate = () => {
  useEffect(() => {
    function googleTranslateElementInit() {
      new window.google.translate.TranslateElement(
        { pageLanguage: 'fr' },
        'google_translate_element'
      );
    }

    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup code if needed (e.g., remove the script tag)
    };
  }, []);

  return <div id="google_translate_element"></div>;
};

export default GoogleTranslate;
