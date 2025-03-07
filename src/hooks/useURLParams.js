import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

/**
 * Custom hook to extract and use URL parameters
 * @param {Object} options Configuration options
 * @param {Function} options.setInputString Function to set the input string
 * @param {Function} options.setGrammar Function to set the grammar
 * @returns {Object} URL parameters and utility functions
 */
const useURLParams = ({ setInputString, setGrammar } = {}) => {
  const location = useLocation();

  useEffect(() => {
    // Parse URL search params
    const searchParams = new URLSearchParams(location.search);
    
    // Extract input string if present
    if (searchParams.has('input') && setInputString) {
      setInputString(searchParams.get('input'));
    }
    
    // Extract grammar if present
    if (searchParams.has('grammar') && setGrammar) {
      try {
        const decodedGrammar = JSON.parse(
          decodeURIComponent(searchParams.get('grammar'))
        );
        setGrammar(decodedGrammar);
      } catch (error) {
        console.error('Failed to parse grammar from URL:', error);
      }
    }
  }, [location.search, setInputString, setGrammar]);

  /**
   * Creates a shareable URL with the current grammar and input string
   * @param {Object} grammar The current grammar object
   * @param {string} inputString The current input string
   * @returns {string} The full shareable URL
   */
  const createShareableURL = (grammar, inputString) => {
    const params = new URLSearchParams();
    
    if (inputString) {
      params.set('input', inputString);
    }
    
    if (grammar) {
      params.set('grammar', encodeURIComponent(JSON.stringify(grammar)));
    }
    
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  return {
    createShareableURL
  };
};

export default useURLParams;