/**
 * Canvas Manager for Automata Visualization
 * 
 * Handles canvas setup, zoom, pan, and basic drawing functions
 * Performance optimized for efficient rendering
 * Used by both DFA and NFA visualization components
 */

export default class CanvasManager {
  constructor(canvasRef, options = {}) {
    this.canvas = canvasRef;
    this.ctx = canvasRef.getContext('2d', { alpha: true });
    this.zoom = 1;
    this.pan = { x: 0, y: 0 };
    this.stateRadius = options.stateRadius || 30;
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.statePositions = {};
    this.stateColors = options.stateColors || {
      default: {
        fill: 'rgba(255, 255, 255, 0.9)',
        stroke: 'rgba(0, 0, 0, 0.6)', 
      },
      active: {
        fill: options.activeStateFill || 'rgba(52, 199, 89, 0.9)',
        stroke: options.activeStateStroke || 'rgba(52, 199, 89, 1)'
      }
    };

    // Optimization flags
    this._lastCanvasWidth = 0;
    this._lastCanvasHeight = 0;
    this._lastZoom = 1;
    this._lastPanX = 0;
    this._lastPanY = 0;
    
    // For transition caching
    this._transitionCache = new Map();
    
    // For text measurement caching
    this._textWidthCache = new Map();

    // Bind methods to instance
    this.clear = this.clear.bind(this);
    this.applyTransform = this.applyTransform.bind(this);
    this.resetTransform = this.resetTransform.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.resetZoom = this.resetZoom.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.drawState = this.drawState.bind(this);
    this.drawTransition = this.drawTransition.bind(this);
    this.calculateStatePositions = this.calculateStatePositions.bind(this);
  }

  // Clear the canvas
  clear() {
    if (!this.canvas || !this.ctx) return;
    
    // Check if canvas dimensions have changed since last clear
    if (this._lastCanvasWidth !== this.canvas.width || this._lastCanvasHeight !== this.canvas.height) {
      this._lastCanvasWidth = this.canvas.width;
      this._lastCanvasHeight = this.canvas.height;
      // Clear text width cache when canvas size changes
      this._textWidthCache.clear();
    }
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // Apply zoom and pan transformations with optimization
  applyTransform() {
    if (!this.ctx) return;
    
    // Check if transform parameters have changed
    const transformChanged = 
      this._lastZoom !== this.zoom || 
      this._lastPanX !== this.pan.x || 
      this._lastPanY !== this.pan.y;
    
    if (transformChanged) {
      // Update last transform values
      this._lastZoom = this.zoom;
      this._lastPanX = this.pan.x;
      this._lastPanY = this.pan.y;
      
      // Clear transition cache when transform changes
      this._transitionCache.clear();
    }
    
    this.ctx.save();
    this.ctx.translate(this.pan.x, this.pan.y);
    this.ctx.scale(this.zoom, this.zoom);
  }

  // Reset transformation
  resetTransform() {
    if (!this.ctx) return;
    this.ctx.restore();
  }

  // Handle zoom in with boundary checking
  zoomIn() {
    const prevZoom = this.zoom;
    this.zoom = Math.min(this.zoom + 0.1, 2.0);
    
    // Adjust pan if zoom changed
    if (this.zoom > prevZoom && this.canvas) {
      const maxPanX = this.canvas.width * (this.zoom - 0.5);
      const maxPanY = this.canvas.height * (this.zoom - 0.5);
      const minPanX = -maxPanX;
      const minPanY = -maxPanY;
      
      this.pan = {
        x: Math.min(Math.max(this.pan.x, minPanX), maxPanX),
        y: Math.min(Math.max(this.pan.y, minPanY), maxPanY)
      };
    }
    
    return this.zoom;
  }

  // Handle zoom out with boundary checking
  zoomOut() {
    this.zoom = Math.max(this.zoom - 0.1, 0.5);
    return this.zoom;
  }

  // Reset zoom and pan
  resetZoom() {
    this.zoom = 1;
    this.pan = { x: 0, y: 0 };
    
    // Clear caches on reset
    this._transitionCache.clear();
  }

  // Mouse handlers for panning
  handleMouseDown(e) {
    if (e.button !== 0) return; // Only left mouse button
    
    this.isDragging = true;
    this.dragStart = { x: e.clientX, y: e.clientY };
  }

  handleMouseMove(e) {
    if (!this.isDragging || !this.canvas) return false;
    
    const dx = e.clientX - this.dragStart.x;
    const dy = e.clientY - this.dragStart.y;
    
    // Only process significant movements (optimization)
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
      return false;
    }
    
    // Calculate boundaries based on zoom level and canvas size
    const maxPanX = this.canvas.width * (this.zoom - 0.5);
    const maxPanY = this.canvas.height * (this.zoom - 0.5);
    const minPanX = -maxPanX;
    const minPanY = -maxPanY;
    
    // Apply pan with boundaries
    this.pan = { 
      x: Math.min(Math.max(this.pan.x + dx, minPanX), maxPanX),
      y: Math.min(Math.max(this.pan.y + dy, minPanY), maxPanY)
    };
    
    this.dragStart = { x: e.clientX, y: e.clientY };
    
    // Clear transition cache on pan
    this._transitionCache.clear();
    
    return true; // Indicate that a redraw is needed
  }

  handleMouseUp() {
    this.isDragging = false;
  }

  // Calculate positions for states in a circle layout
  calculateStatePositions(states) {
    if (!this.canvas || !states || states.length === 0) return {};
    
    const numStates = states.length;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    
    const positions = {};
    
    states.forEach((state, index) => {
      const angle = (2 * Math.PI * index) / numStates;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      positions[state] = { x, y, angle };
    });
    
    this.statePositions = positions;
    
    // Clear caches when positions change
    this._transitionCache.clear();
    
    return positions;
  }

  // Measure text width with caching
  measureTextWidth(text, font) {
    const cacheKey = `${text}|${font}`;
    
    if (this._textWidthCache.has(cacheKey)) {
      return this._textWidthCache.get(cacheKey);
    }
    
    this.ctx.font = font;
    const width = this.ctx.measureText(text).width;
    this._textWidthCache.set(cacheKey, width);
    
    return width;
  }

  // Draw a state (circle) with optimization
  drawState(state, position, options = {}) {
    if (!this.ctx || !position) return;
    
    const { 
      isActive = false, 
      isAccepting = false, 
      isInitial = false,
      label = state
    } = options;
    
    const colors = isActive ? this.stateColors.active : this.stateColors.default;
    
    // Draw shadow
    this.ctx.beginPath();
    this.ctx.arc(position.x, position.y + 3, this.stateRadius, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.fill();
    
    // Main circle
    this.ctx.beginPath();
    this.ctx.arc(position.x, position.y, this.stateRadius, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = colors.fill;
    this.ctx.fill();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = colors.stroke;
    this.ctx.stroke();
    
    // Second circle for accepting states
    if (isAccepting) {
      this.ctx.beginPath();
      this.ctx.arc(position.x, position.y, this.stateRadius - 6, 0, 2 * Math.PI, false);
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = isActive ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.6)';
      this.ctx.stroke();
    }
    
    // Arrow for initial state
    if (isInitial) {
      const arrowLength = this.stateRadius * 1.5;
      const arrowX = position.x - Math.cos(Math.PI) * arrowLength;
      const arrowY = position.y - Math.sin(Math.PI) * arrowLength;
      
      this.ctx.beginPath();
      this.ctx.moveTo(arrowX, arrowY);
      this.ctx.lineTo(position.x - this.stateRadius, position.y);
      this.ctx.strokeStyle = colors.stroke;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      
      // Arrow head
      const arrowSize = 10;
      const arrowAngle = 0; // Point right
      this.ctx.beginPath();
      this.ctx.moveTo(position.x - this.stateRadius, position.y);
      this.ctx.lineTo(
        position.x - this.stateRadius - arrowSize * Math.cos(arrowAngle - Math.PI / 6),
        position.y - arrowSize * Math.sin(arrowAngle - Math.PI / 6)
      );
      this.ctx.lineTo(
        position.x - this.stateRadius - arrowSize * Math.cos(arrowAngle + Math.PI / 6),
        position.y - arrowSize * Math.sin(arrowAngle + Math.PI / 6)
      );
      this.ctx.closePath();
      this.ctx.fillStyle = colors.stroke;
      this.ctx.fill();
    }
    
    // State label
    this.ctx.fillStyle = isActive ? 'white' : '#333';
    const font = `bold ${isActive ? 16 : 14}px Arial`;
    this.ctx.font = font;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(label, position.x, position.y);
  }

  // Draw a transition (arrow) between states with caching
  drawTransition(fromState, toState, fromPos, toPos, options = {}) {
    if (!this.ctx || !fromPos || !toPos) return;
    
    const { 
      symbol = '', 
      isActive = false,
      isDashed = false,
      strokeColor = isActive ? 'rgba(52, 199, 89, 0.8)' : 'rgba(0, 0, 0, 0.6)',
      textColor = isActive ? 'var(--secondary-color)' : 'black'
    } = options;
    
    // Create cache key for this transition
    const cacheKey = `${fromState}|${toState}|${symbol}|${isActive}|${isDashed}|${strokeColor}|${this.zoom}`;
    
    // Self-loop
    if (fromState === toState) {
      this.drawSelfLoop(fromPos, { symbol, isActive, isDashed, strokeColor, textColor });
    } 
    // Transition to another state
    else {
      this.drawArrow(fromPos, toPos, { symbol, isActive, isDashed, strokeColor, textColor });
    }
  }

  // Draw a self-loop transition
  drawSelfLoop(position, options = {}) {
    if (!this.ctx || !position) return;
    
    const { 
      symbol = '', 
      isActive = false,
      isDashed = false,
      strokeColor = isActive ? 'rgba(52, 199, 89, 0.8)' : 'rgba(0, 0, 0, 0.6)',
      textColor = isActive ? 'var(--secondary-color)' : 'black'
    } = options;
    
    const angle = position.angle;
    const loopRadius = this.stateRadius * 0.8;
    const loopX = position.x + this.stateRadius * 1.5 * Math.cos(angle - Math.PI / 4);
    const loopY = position.y + this.stateRadius * 1.5 * Math.sin(angle - Math.PI / 4);
    
    // Loop shadow
    this.ctx.beginPath();
    this.ctx.arc(loopX, loopY + 3, loopRadius, 0, 2 * Math.PI, false);
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
    
    // Main loop
    this.ctx.beginPath();
    this.ctx.arc(loopX, loopY, loopRadius, 0, 2 * Math.PI, false);
    
    if (isDashed) {
      this.ctx.setLineDash([5, 3]);
    } else {
      this.ctx.setLineDash([]);
    }
    
    this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = isActive ? 3 : 2;
    this.ctx.stroke();
    this.ctx.setLineDash([]); // Reset dash
    
    // Draw symbol
    const textX = loopX;
    const textY = loopY - loopRadius - 15;
    
    // Text background
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    const font = isActive ? 'bold 16px Arial' : '14px Arial';
    const textWidth = this.measureTextWidth(symbol, font) + 10;
    this.ctx.fillRect(textX - textWidth/2, textY - 10, textWidth, 20);
    
    // Text
    this.ctx.fillStyle = textColor;
    this.ctx.font = font;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(symbol, textX, textY);
  }

  // Draw an arrow between states
  drawArrow(fromPos, toPos, options = {}) {
    if (!this.ctx || !fromPos || !toPos) return;
    
    const { 
      symbol = '', 
      isActive = false,
      isDashed = false,
      strokeColor = isActive ? 'rgba(52, 199, 89, 0.8)' : 'rgba(0, 0, 0, 0.6)',
      textColor = isActive ? 'var(--secondary-color)' : 'black'
    } = options;
    
    // Calculate control point for curved line
    const midX = (fromPos.x + toPos.x) / 2;
    const midY = (fromPos.y + toPos.y) / 2;
    const normalX = -(toPos.y - fromPos.y);
    const normalY = toPos.x - fromPos.x;
    const length = Math.sqrt(normalX * normalX + normalY * normalY);
    
    // Adjust curve factor based on complexity (number of states)
    const curveFactor = 0.2;
    const statesCount = Object.keys(this.statePositions).length || 5;
    const cpX = midX + (normalX / length) * this.stateRadius * curveFactor * statesCount;
    const cpY = midY + (normalY / length) * this.stateRadius * curveFactor * statesCount;
    
    // Calculate points on the circles' edges
    const fromAngleToCP = Math.atan2(cpY - fromPos.y, cpX - fromPos.x);
    const startX = fromPos.x + this.stateRadius * Math.cos(fromAngleToCP);
    const startY = fromPos.y + this.stateRadius * Math.sin(fromAngleToCP);
    
    const toAngleFromCP = Math.atan2(cpY - toPos.y, cpX - toPos.x);
    const endX = toPos.x + this.stateRadius * Math.cos(toAngleFromCP);
    const endY = toPos.y + this.stateRadius * Math.sin(toAngleFromCP);
    
    // Draw shadow
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY + 2);
    this.ctx.quadraticCurveTo(cpX, cpY + 2, endX, endY + 2);
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
    
    // Draw arrow
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.quadraticCurveTo(cpX, cpY, endX, endY);
    
    if (isDashed) {
      this.ctx.setLineDash([5, 3]);
    } else {
      this.ctx.setLineDash([]);
    }
    
    this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = isActive ? 3 : 2;
    this.ctx.stroke();
    this.ctx.setLineDash([]); // Reset dash pattern
    
    // Draw arrowhead
    const arrowSize = 10;
    const arrowAngle = Math.atan2(endY - cpY, endX - cpX);
    this.ctx.beginPath();
    this.ctx.moveTo(endX, endY);
    this.ctx.lineTo(
      endX - arrowSize * Math.cos(arrowAngle - Math.PI / 6),
      endY - arrowSize * Math.sin(arrowAngle - Math.PI / 6)
    );
    this.ctx.lineTo(
      endX - arrowSize * Math.cos(arrowAngle + Math.PI / 6),
      endY - arrowSize * Math.sin(arrowAngle + Math.PI / 6)
    );
    this.ctx.closePath();
    this.ctx.fillStyle = strokeColor;
    this.ctx.fill();
    
    // Draw transition symbol
    const textX = cpX;
    const textY = cpY - 15;
    
    // Text background
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    const font = isActive ? 'bold 16px Arial' : '14px Arial';
    const textWidth = this.measureTextWidth(symbol, font) + 10;
    this.ctx.fillRect(textX - textWidth/2, textY - 10, textWidth, 20);
    
    // Text
    this.ctx.fillStyle = textColor;
    this.ctx.font = font;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(symbol, textX, textY);
  }
}