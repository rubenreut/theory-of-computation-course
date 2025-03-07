import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import GlossaryItem from './GlossaryItem';
import glossaryData from './glossaryData';

const GlossaryContainer = styled.div`
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const Title = styled.h2`
  color: #333;
  margin-top: 0;
  margin-bottom: 20px;
`;

const SearchContainer = styled.div`
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const FilterButton = styled.button`
  padding: 8px 15px;
  background-color: ${props => props.active ? '#4CAF50' : '#f1f1f1'};
  color: ${props => props.active ? 'white' : '#333'};
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#43A047' : '#e0e0e0'};
  }
`;

const GlossaryList = styled.div`
  max-height: 600px;
  overflow-y: auto;
  padding-right: 10px;
  margin-right: -10px;
  
  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f5f5f5;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #bdbdbd;
    border-radius: 4px;
  }
`;

const NoResults = styled.div`
  text-align: center;
  color: #757575;
  padding: 30px 0;
  font-style: italic;
`;

const ScrollTopButton = styled.button`
  position: sticky;
  bottom: 20px;
  left: calc(100% - 60px);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #4CAF50;
  color: white;
  border: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  opacity: ${props => props.visible ? '1' : '0'};
  transition: opacity 0.3s ease;
  pointer-events: ${props => props.visible ? 'auto' : 'none'};
  
  &:hover {
    background-color: #43A047;
  }
`;

function Glossary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredTerms, setFilteredTerms] = useState(glossaryData);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const listRef = useRef(null);

  // All unique categories
  const categories = ['All', ...new Set(glossaryData.map(item => item.category))];

  // Filter the terms based on search and category
  useEffect(() => {
    let filtered = glossaryData;
    
    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.term.toLowerCase().includes(lowercasedSearch) || 
        item.definition.toLowerCase().includes(lowercasedSearch)
      );
    }
    
    setFilteredTerms(filtered);
  }, [searchTerm, selectedCategory]);

  // Handle scroll event to show/hide scroll top button
  const handleScroll = () => {
    if (listRef.current) {
      if (listRef.current.scrollTop > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    }
  };

  useEffect(() => {
    const list = listRef.current;
    if (list) {
      list.addEventListener('scroll', handleScroll);
      return () => list.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Handle related term click
  const handleRelatedTermClick = (term) => {
    setSearchTerm(term);
    setSelectedCategory('All');
    
    // Find the index of the term
    const index = glossaryData.findIndex(item => item.term === term);
    if (index !== -1 && listRef.current) {
      // Get all glossary items
      const items = listRef.current.querySelectorAll('.glossary-item');
      if (items[index]) {
        setTimeout(() => {
          // Scroll to the item
          items[index].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Highlight temporarily
          items[index].classList.add('highlight');
          setTimeout(() => {
            items[index].classList.remove('highlight');
          }, 2000);
        }, 100);
      }
    }
  };

  return (
    <GlossaryContainer>
      <Title>CFG Glossary</Title>
      
      <SearchContainer>
        <SearchInput
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search terms or definitions..."
        />
      </SearchContainer>
      
      <FilterContainer>
        {categories.map(category => (
          <FilterButton 
            key={category}
            active={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </FilterButton>
        ))}
      </FilterContainer>
      
      <GlossaryList ref={listRef}>
        {filteredTerms.length > 0 ? (
          filteredTerms.map((item, index) => (
            <div key={index} className="glossary-item">
              <GlossaryItem 
                {...item} 
                onRelatedTermClick={handleRelatedTermClick}
              />
            </div>
          ))
        ) : (
          <NoResults>No matching terms found.</NoResults>
        )}
        
        <ScrollTopButton 
          visible={showScrollTop}
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          ↑
        </ScrollTopButton>
      </GlossaryList>
    </GlossaryContainer>
  );
}

export default Glossary;