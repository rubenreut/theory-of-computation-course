import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import { getRandomDerivation } from '../utils/grammarUtils';

const TreeContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 700px; /* Much larger height for better visibility */
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  margin-top: 0;
  color: #333;
`;

const SVGContainer = styled.div`
  flex: 1;
  overflow: auto; /* Allow scrolling if needed */
  border: 1px solid #eee;
  border-radius: 4px;
  margin: 10px 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 8px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 5px;
  
  &:hover {
    background-color: #45a049;
  }
`;

const TreeNote = styled.div`
  margin-top: 5px;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #e3f2fd;
  border-left: 4px solid #2196f3;
  font-size: 14px;
  line-height: 1.5;
`;

const LegendContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
  gap: 15px;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 15px;
`;

const LegendColor = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: 5px;
`;

function DerivationTree({ grammar }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  
  const generateTree = () => {
    if (!grammar || !grammar.productions || grammar.productions.length === 0) {
      return;
    }
    
    // Generate a random derivation tree
    const maxDepth = 3;
    const rootNode = getRandomDerivation(grammar, grammar.startSymbol, maxDepth);
    
    renderTree(rootNode);
  };
  
  const renderTree = (root) => {
    if (!svgRef.current || !containerRef.current) return;
    
    // Store the root for later use (e.g., for window resize)
    svgRef.current.__data__ = root;
    
    // Clear previous tree
    d3.select(svgRef.current).selectAll('*').remove();
    
    // Calculate dimensions with extra space for larger trees
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight - 120; // Account for notes and buttons
    
    // Create the SVG element with zooming capability
    const svg = d3.select(svgRef.current)
      .attr('width', containerWidth)
      .attr('height', containerHeight);
    
    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    
    svg.call(zoom);
    
    // Create a group to hold the tree
    const g = svg.append('g')
      .attr('transform', `translate(${containerWidth / 2},40)`);
    
    // Calculate a dynamic width based on the number of leaf nodes
    const leafCount = countLeafNodes(root);
    const widthPerLeaf = 80; // More space per leaf
    const treeWidth = Math.max(containerWidth - 80, leafCount * widthPerLeaf);
    
    // Tree layout with adjusted size
    const treeLayout = d3.tree()
      .size([treeWidth * 0.8, containerHeight - 100]); // Adjustable width based on complexity
    
    // Create hierarchy and apply layout
    const hierarchy = d3.hierarchy(root);
    const treeData = treeLayout(hierarchy);
    
    // Add links with smoother curves
    g.selectAll('.link')
      .data(treeData.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d => {
        return `M${d.source.x},${d.source.y}C${d.source.x},${(d.source.y + d.target.y) / 2} ${d.target.x},${(d.source.y + d.target.y) / 2} ${d.target.x},${d.target.y}`;
      })
      .attr('fill', 'none')
      .attr('stroke', '#999')
      .attr('stroke-width', 1.5);
    
    // Add nodes with enhanced styling
    const nodes = g.selectAll('.node')
      .data(treeData.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`);
    
    // Node circles with different size based on level
    nodes.append('circle')
      .attr('r', d => Math.max(20 - d.depth * 2, 15)) // Slightly smaller as we go deeper
      .attr('fill', d => {
        // Non-terminals are blue, terminals are green
        const symbol = d.data.symbol;
        if (grammar.nonTerminals.includes(symbol)) {
          return '#4682B4'; // SteelBlue
        } else if (grammar.terminals.includes(symbol)) {
          return '#66BB6A'; // Green
        } else {
          return '#FFA726'; // Orange (epsilon)
        }
      })
      .attr('stroke', '#333')
      .attr('stroke-width', 1.5);
    
    // Node labels with better visibility
    nodes.append('text')
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-weight', 'bold')
      .text(d => d.data.symbol);
    
    // Center the tree if it's not too wide
    if (treeWidth < containerWidth * 2) {
      const initialTransform = d3.zoomIdentity
        .translate((containerWidth - treeWidth) / 2, 20)
        .scale(0.9);
      
      svg.call(zoom.transform, initialTransform);
    }
  };
  
  // Helper function to count leaf nodes
  const countLeafNodes = (node) => {
    if (!node.children || node.children.length === 0) {
      return 1;
    }
    return node.children.reduce((sum, child) => sum + countLeafNodes(child), 0);
  };
  
  useEffect(() => {
    generateTree();
    
    // Handle window resize
    const handleResize = () => {
      if (svgRef.current) {
        renderTree(svgRef.current.__data__);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [grammar]);
  
  return (
    <TreeContainer ref={containerRef}>
      <Title>Derivation Tree</Title>
      
      <TreeNote>
        A derivation tree shows how a string can be derived from the grammar, starting with the start symbol. 
        Each node represents a symbol, with non-terminals branching out according to production rules.
      </TreeNote>
      
      <LegendContainer>
        <LegendItem>
          <LegendColor color="#4682B4" />
          <span>Non-terminal</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#66BB6A" />
          <span>Terminal</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#FFA726" />
          <span>ε (epsilon)</span>
        </LegendItem>
      </LegendContainer>
      
      <SVGContainer>
        <svg ref={svgRef} width="100%" height="100%"></svg>
      </SVGContainer>
      
      <TreeNote>
        Click "Generate Random Tree" to create a new random derivation using your grammar rules.
        Trees are created with a maximum depth of 3 to avoid excessive complexity.
      </TreeNote>
      
      <ButtonContainer>
        <Button onClick={generateTree}>Generate Random Tree</Button>
      </ButtonContainer>
    </TreeContainer>
  );
}

export default DerivationTree;