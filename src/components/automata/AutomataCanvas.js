import React, { useRef, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

// Animations
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Styled components
export const CanvasContainer = styled.div`
  position: relative;
  width: 100%;
  height: 500px; /* Fixed reasonable height */
  margin-bottom: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  background-color: #f8f9fa;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 2px solid var(--border-color);
`;

export const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
  cursor: move; /* Show move cursor to indicate it can be moved */
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: ${props => props.visible ? 'flex' : 'none'};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

export const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: ${props => props.variant === 'nfa' ? 'var(--tertiary-color)' : 'var(--secondary-color)'};
  animation: ${rotate} 1s linear infinite;
  margin-bottom: var(--spacing-md);
`;

export const LoadingText = styled.p`
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: ${props => props.variant === 'nfa' ? 'var(--tertiary-color)' : 'var(--secondary-color)'};
`;

export const ZoomControls = styled.div`
  position: absolute;
  bottom: var(--spacing-lg);
  right: var(--spacing-lg);
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 5px;
  width: 150px;
  z-index: 10;
`;

export const ZoomButton = styled.button`
  background-color: white;
  border: none;
  padding: var(--spacing-sm);
  font-size: var(--font-size-xl);
  font-weight: bold;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

export const ResetZoomButton = styled(ZoomButton)`
  font-size: var(--font-size-base);
  border-top: 1px solid var(--border-color);
  padding: var(--spacing-md);
`;

// Main component
const AutomataCanvas = ({
  canvasManager,
  initRef,
  renderFunction,
  isLoading = false,
  variant = 'dfa',
  loadingMessage = 'Preparing visualization...'
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    
    // Only initialize once
    if (!isInitialized) {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      const rect = container.getBoundingClientRect();
      
      // Set canvas dimensions
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Initialize canvas manager if provided
      if (initRef) {
        initRef(canvas);
      }
      
      setIsInitialized(true);
    }
    
    // Render initial state
    if (renderFunction) {
      renderFunction();
    }
    
    // Handle cleanup
    return () => {
      // Any cleanup needed for the canvas
    };
  }, [renderFunction, isInitialized, initRef]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsInitialized(false);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Set up event handlers for pan/zoom
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || !canvasManager) return;
    
    const container = containerRef.current;
    
    // Mouse event handlers
    const handleMouseDown = (e) => {
      canvasManager.handleMouseDown(e);
    };
    
    const handleMouseMove = (e) => {
      if (canvasManager.handleMouseMove(e) && renderFunction) {
        renderFunction();
      }
    };
    
    const handleMouseUp = () => {
      canvasManager.handleMouseUp();
    };
    
    const handleMouseLeave = () => {
      canvasManager.handleMouseUp();
    };
    
    // Add event listeners
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    // Cleanup
    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [canvasManager, renderFunction]);

  // Handle zoom controls
  const handleZoomIn = () => {
    if (canvasManager) {
      canvasManager.zoomIn();
      if (renderFunction) renderFunction();
    }
  };
  
  const handleZoomOut = () => {
    if (canvasManager) {
      canvasManager.zoomOut();
      if (renderFunction) renderFunction();
    }
  };
  
  const handleResetZoom = () => {
    if (canvasManager) {
      canvasManager.resetZoom();
      if (renderFunction) renderFunction();
    }
  };

  return (
    <CanvasContainer ref={containerRef}>
      <Canvas ref={canvasRef} />
      
      <LoadingOverlay visible={isLoading}>
        <LoadingSpinner variant={variant} />
        <LoadingText variant={variant}>{loadingMessage}</LoadingText>
      </LoadingOverlay>
      
      <ZoomControls>
        <ZoomButton onClick={handleZoomIn} title="Zoom In">+</ZoomButton>
        <ZoomButton onClick={handleZoomOut} title="Zoom Out">-</ZoomButton>
        <ResetZoomButton onClick={handleResetZoom} title="Reset View">Reset</ResetZoomButton>
        <div style={{ 
          fontSize: '11px', 
          marginTop: '5px', 
          textAlign: 'center', 
          color: 'var(--text-secondary)' 
        }}>
          Drag to move the view
        </div>
      </ZoomControls>
    </CanvasContainer>
  );
};

export default AutomataCanvas;