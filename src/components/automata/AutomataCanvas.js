import React, { useRef, useEffect, useState, useCallback, memo } from 'react';
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
  height: 550px; /* Increased height for better visualization */
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

/**
 * AutomataCanvasBase component
 * 
 * Canvas component for visualizing automata with performance optimizations.
 * 
 * @param {Object} props Component props
 * @param {Function} props.initRef Function to initialize the canvas
 * @param {Object} props.canvasManager Canvas manager instance
 * @param {Function} props.renderFunction Function to render the automaton
 * @param {boolean} props.isLoading Whether the canvas is loading
 * @param {string} props.variant The variant of the automaton ('dfa' or 'nfa')
 * @param {string} props.loadingMessage Loading message to display
 */
const AutomataCanvasBase = ({
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
  const resizeTimeoutRef = useRef(null);
  
  // Initialize canvas with proper size
  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current || !containerRef.current) return;
    
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
  }, [initRef]);

  // Initialize canvas on mount
  useEffect(() => {
    initializeCanvas();
    
    // Cleanup
    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [initializeCanvas]);
  
  // Handle window resize efficiently with debouncing
  useEffect(() => {
    const handleResize = () => {
      // Clear any existing timeout to debounce the resize
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      
      // Set up a new timeout for 100ms
      resizeTimeoutRef.current = setTimeout(() => {
        setIsInitialized(false);
        initializeCanvas();
      }, 150);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [initializeCanvas]);
  
  // Render when initialized or when renderFunction changes
  useEffect(() => {
    if (isInitialized && renderFunction) {
      renderFunction();
    }
  }, [isInitialized, renderFunction]);
  
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
        // Use requestAnimationFrame for smoother panning
        requestAnimationFrame(renderFunction);
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
  const handleZoomIn = useCallback(() => {
    if (canvasManager) {
      canvasManager.zoomIn();
      if (renderFunction) {
        requestAnimationFrame(renderFunction);
      }
    }
  }, [canvasManager, renderFunction]);
  
  const handleZoomOut = useCallback(() => {
    if (canvasManager) {
      canvasManager.zoomOut();
      if (renderFunction) {
        requestAnimationFrame(renderFunction);
      }
    }
  }, [canvasManager, renderFunction]);
  
  const handleResetZoom = useCallback(() => {
    if (canvasManager) {
      canvasManager.resetZoom();
      if (renderFunction) {
        requestAnimationFrame(renderFunction);
      }
    }
  }, [canvasManager, renderFunction]);

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

// Memoize the component to prevent unnecessary re-renders
const AutomataCanvas = memo(AutomataCanvasBase, (prevProps, nextProps) => {
  // Always re-render if loading state changes
  if (prevProps.isLoading !== nextProps.isLoading) {
    return false;
  }
  
  // Always re-render if canvas manager changes
  if (prevProps.canvasManager !== nextProps.canvasManager) {
    return false;
  }
  
  // Always re-render if initRef changes
  if (prevProps.initRef !== nextProps.initRef) {
    return false;
  }
  
  // Always re-render if variant changes
  if (prevProps.variant !== nextProps.variant) {
    return false;
  }
  
  // If the render function changes, we should re-render
  if (prevProps.renderFunction !== nextProps.renderFunction) {
    return false;
  }
  
  // By default, don't re-render
  return true;
});

export default AutomataCanvas;