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

  // Calculate positions for states using force-directed layout
  calculateStatePositions(states) {
    if (!this.canvas || !states || states.length === 0) return {};
    
    const numStates = states.length;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    
    // Initialize positions in a circle (as a starting point)
    const positions = {};
    states.forEach((state, index) => {
      const angle = (2 * Math.PI * index) / numStates;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      positions[state] = { x, y, angle, vx: 0, vy: 0 };
    });
    
    // Skip force-directed calculation for small automata
    if (numStates <= 3) {
      this.statePositions = positions;
      this._transitionCache.clear();
      return positions;
    }
    
    // Force-directed layout parameters
    const REPULSION = 10000; // Repulsive force between nodes
    const ATTRACTION = 0.1;  // Attractive force for graph edges
    const ITERATIONS = 50;   // Number of iterations to run
    const MAX_DISPLACEMENT = this.stateRadius * 2; // Limit movement per iteration
    const MIN_DISTANCE = this.stateRadius * 2.5; // Minimum distance between states
    
    // Get transitions to create attraction forces
    const transitions = this._getTransitionsFromStates(states);
    
    // Run force-directed algorithm
    for (let iter = 0; iter < ITERATIONS; iter++) {
      // Calculate repulsive forces (each state repels all others)
      for (let i = 0; i < states.length; i++) {
        const state1 = states[i];
        const pos1 = positions[state1];
        
        // Initialize force components
        let fx = 0, fy = 0;
        
        // Apply repulsive forces from other states
        for (let j = 0; j < states.length; j++) {
          if (i === j) continue;
          
          const state2 = states[j];
          const pos2 = positions[state2];
          
          // Calculate distance and direction
          const dx = pos1.x - pos2.x;
          const dy = pos1.y - pos2.y;
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq);
          
          // Apply repulsive force (inverse square law)
          if (dist > 0) {
            const force = REPULSION / distSq;
            fx += (dx / dist) * force;
            fy += (dy / dist) * force;
          }
        }
        
        // Apply attractive forces for connected states
        for (const transition of transitions) {
          if (transition.from === state1) {
            const toPos = positions[transition.to];
            const dx = pos1.x - toPos.x;
            const dy = pos1.y - toPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist > 0) {
              fx -= dx * ATTRACTION;
              fy -= dy * ATTRACTION;
            }
          }
        }
        
        // Store calculated force
        pos1.fx = fx;
        pos1.fy = fy;
      }
      
      // Apply forces with damping as iterations progress
      const damping = 1 - (iter / ITERATIONS) * 0.5;
      
      for (const state of states) {
        const pos = positions[state];
        
        // Calculate displacement
        let dx = pos.fx * damping;
        let dy = pos.fy * damping;
        
        // Limit maximum displacement per iteration
        const displacement = Math.sqrt(dx * dx + dy * dy);
        if (displacement > MAX_DISPLACEMENT) {
          dx = (dx / displacement) * MAX_DISPLACEMENT;
          dy = (dy / displacement) * MAX_DISPLACEMENT;
        }
        
        // Update position
        pos.x += dx;
        pos.y += dy;
        
        // Keep within bounds
        pos.x = Math.max(this.stateRadius, Math.min(width - this.stateRadius, pos.x));
        pos.y = Math.max(this.stateRadius, Math.min(height - this.stateRadius, pos.y));
      }
      
      // Prevent overlap
      this._resolveOverlaps(positions, states, MIN_DISTANCE);
    }
    
    // Clean up temporary properties and update angles
    for (const state of states) {
      const pos = positions[state];
      delete pos.fx;
      delete pos.fy;
      delete pos.vx;
      delete pos.vy;
      pos.angle = Math.atan2(pos.y - centerY, pos.x - centerX);
    }
    
    this.statePositions = positions;
    
    // Clear caches when positions change
    this._transitionCache.clear();
    
    return positions;
  }
  
  // Helper to resolve overlapping states
  _resolveOverlaps(positions, states, minDistance) {
    for (let i = 0; i < states.length; i++) {
      const state1 = states[i];
      const pos1 = positions[state1];
      
      for (let j = i + 1; j < states.length; j++) {
        const state2 = states[j];
        const pos2 = positions[state2];
        
        const dx = pos2.x - pos1.x;
        const dy = pos2.y - pos1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < minDistance && dist > 0) {
          const overlap = (minDistance - dist) / 2;
          const adjustX = (dx / dist) * overlap;
          const adjustY = (dy / dist) * overlap;
          
          pos1.x -= adjustX;
          pos1.y -= adjustY;
          pos2.x += adjustX;
          pos2.y += adjustY;
        }
      }
    }
  }
  
  // Helper to get transitions from states (for force-directed layout)
  _getTransitionsFromStates(states) {
    // This needs to be connected to the actual automaton data model
    // For now, we'll use a dummy implementation that will be replaced
    // when integrating with the rest of the code
    const transitions = [];
    
    // The actual implementation will extract transitions from the automaton model
    // For example: automaton.getTransitions().map(t => ({ from: t.from, to: t.to }))
    
    // Try to infer transitions from any existing rendering cache
    if (this._transitionCache && this._transitionCache.size > 0) {
      for (const [key] of this._transitionCache.entries()) {
        const parts = key.split('|');
        if (parts.length >= 2) {
          const from = parts[0];
          const to = parts[1];
          if (states.includes(from) && states.includes(to)) {
            transitions.push({ from, to });
          }
        }
      }
    }
    
    return transitions;
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
      // Find the best angle for the initial arrow - point from the left by default
      // but adjust if the state is at the left edge
      const distToLeftEdge = position.x - this.stateRadius;
      const distToTopEdge = position.y - this.stateRadius;
      
      // Choose appropriate angle based on state position
      let arrowAngle = Math.PI; // Default: from left
      
      // If too close to the left edge, point from top or top-left
      if (distToLeftEdge < this.stateRadius * 3) {
        if (distToTopEdge < this.stateRadius * 3) {
          arrowAngle = Math.PI * 5/4; // From bottom-left
        } else {
          arrowAngle = Math.PI / 2; // From top
        }
      }
      
      const arrowLength = this.stateRadius * 2;
      const arrowX = position.x - Math.cos(arrowAngle) * arrowLength;
      const arrowY = position.y - Math.sin(arrowAngle) * arrowLength;
      
      // First draw arrow shadow
      this.ctx.beginPath();
      this.ctx.moveTo(arrowX, arrowY + 1);
      const edgeX = position.x - Math.cos(arrowAngle) * this.stateRadius;
      const edgeY = position.y - Math.sin(arrowAngle) * this.stateRadius;
      this.ctx.lineTo(edgeX, edgeY + 1);
      this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      this.ctx.lineWidth = 3;
      this.ctx.stroke();
      
      // Then draw the main arrow line
      this.ctx.beginPath();
      this.ctx.moveTo(arrowX, arrowY);
      this.ctx.lineTo(edgeX, edgeY);
      this.ctx.strokeStyle = colors.stroke;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      
      // Draw arrowhead at the edge of the state
      const arrowSize = 10;
      // Reverse angle for the arrowhead since it points opposite to the line direction
      const headAngle = arrowAngle + Math.PI;
      
      this.ctx.beginPath();
      this.ctx.moveTo(edgeX, edgeY);
      this.ctx.lineTo(
        edgeX + arrowSize * Math.cos(headAngle - Math.PI / 6),
        edgeY + arrowSize * Math.sin(headAngle - Math.PI / 6)
      );
      this.ctx.lineTo(
        edgeX + arrowSize * Math.cos(headAngle + Math.PI / 6),
        edgeY + arrowSize * Math.sin(headAngle + Math.PI / 6)
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
    
    // Cache key for transitions
    const cacheKey = `${fromState}|${toState}|${symbol}`;
    
    // Update transition cache for parallel edge detection
    if (!this._transitionCache.has(cacheKey)) {
      this._transitionCache.set(cacheKey, true);
    }
    
    // Self-loop
    if (fromState === toState) {
      this.drawSelfLoop(fromPos, { 
        symbol, 
        isActive, 
        isDashed, 
        strokeColor, 
        textColor,
        state: fromState // Pass state name for multi-loop detection
      });
    } 
    // Transition to another state
    else {
      this.drawArrow(fromPos, toPos, { 
        symbol, 
        isActive, 
        isDashed, 
        strokeColor, 
        textColor,
        from: fromState, // Pass state names for parallel edge detection
        to: toState
      });
    }
  }

  // Draw a self-loop transition with improved positioning
  drawSelfLoop(position, options = {}) {
    if (!this.ctx || !position) return;
    
    const { 
      symbol = '', 
      isActive = false,
      isDashed = false,
      strokeColor = isActive ? 'rgba(52, 199, 89, 0.8)' : 'rgba(0, 0, 0, 0.6)',
      textColor = isActive ? 'var(--secondary-color)' : 'black',
      state = null // For multi-loop detection
    } = options;
    
    // Find best angle for self-loop based on surrounding states
    const bestAngle = this._findBestSelfLoopAngle(position, state);
    
    // For multiple self-loops on the same state, offset them from each other
    const numLoops = this._countSelfLoops(state);
    const angleOffset = numLoops > 1 ? this._getSelfLoopIndex(state, symbol) * (Math.PI / 6) : 0;
    const finalAngle = bestAngle + angleOffset;
    
    // Calculate loop position using the determined angle - move closer to state
    const loopDistance = this.stateRadius * 1.2;
    const loopRadius = this.stateRadius * 0.6;
    const loopX = position.x + loopDistance * Math.cos(finalAngle);
    const loopY = position.y + loopDistance * Math.sin(finalAngle);
    
    // Direction from state to loop
    const directionX = loopX - position.x;
    const directionY = loopY - position.y;
    const dirLen = Math.sqrt(directionX * directionX + directionY * directionY);
    const normalizedDirX = directionX / dirLen;
    const normalizedDirY = directionY / dirLen;
    
    // Calculate the start point on the state's edge
    const startX = position.x + normalizedDirX * this.stateRadius;
    const startY = position.y + normalizedDirY * this.stateRadius;
    
    // Calculate arc angles for curve control - slightly more than half a circle
    const startAngle = finalAngle + Math.PI - Math.PI/3;
    const endAngle = finalAngle + Math.PI + Math.PI/3;
    
    // Determine additional control points using arc angles for better loop shape
    const arcPoint1X = loopX + loopRadius * Math.cos(startAngle);
    const arcPoint1Y = loopY + loopRadius * Math.sin(startAngle);
    const arcPoint2X = loopX + loopRadius * Math.cos(endAngle);
    const arcPoint2Y = loopY + loopRadius * Math.sin(endAngle);
    
    // Draw shadow for the curve using arc points
    this.ctx.beginPath();
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    this.ctx.shadowBlur = 5;
    this.ctx.shadowOffsetY = 2;
    
    // Draw shadow path with arc angles
    this.ctx.moveTo(startX, startY + 2);
    this.ctx.bezierCurveTo(
      arcPoint1X, arcPoint1Y + 2,
      arcPoint2X, arcPoint2Y + 2,
      startX, startY + 2
    );
    
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
    this.ctx.shadowColor = 'transparent';
    this.ctx.shadowBlur = 0;
    this.ctx.shadowOffsetY = 0;
    
    // Main loop - simplified to draw a bezier curve instead of an arc
    this.ctx.beginPath();
    
    if (isDashed) {
      this.ctx.setLineDash([5, 3]);
    } else {
      this.ctx.setLineDash([]);
    }
    
    // These control points are not used anymore since we now use the arc points
    
    // Draw path leaving from and returning to the state
    // Using arc points to create a more natural loop
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.bezierCurveTo(
      arcPoint1X, arcPoint1Y,
      arcPoint2X, arcPoint2Y,
      startX, startY
    );
    
    this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = isActive ? 3 : 2;
    this.ctx.stroke();
    this.ctx.setLineDash([]); // Reset dash
    
    // Add arrow to self-loop - calculate position near state's edge on the returning part
    // Calculate parametric position on the bezier curve (~80% of the way through)
    const t = 0.8; // Position near the end of the curve
    
    // Parametric equation for cubic bezier using actual control points
    const arrowX = Math.pow(1-t, 3) * startX + 
                  3 * Math.pow(1-t, 2) * t * arcPoint1X + 
                  3 * (1-t) * Math.pow(t, 2) * arcPoint2X + 
                  Math.pow(t, 3) * startX;
                  
    const arrowY = Math.pow(1-t, 3) * startY + 
                  3 * Math.pow(1-t, 2) * t * arcPoint1Y + 
                  3 * (1-t) * Math.pow(t, 2) * arcPoint2Y + 
                  Math.pow(t, 3) * startY;
    
    // Calculate tangent at point t using actual control points
    const tangentX = -3 * Math.pow(1-t, 2) * startX + 
                    3 * Math.pow(1-t, 2) * arcPoint1X - 
                    6 * t * (1-t) * arcPoint1X + 
                    6 * t * (1-t) * arcPoint2X - 
                    3 * Math.pow(t, 2) * arcPoint2X + 
                    3 * Math.pow(t, 2) * startX;
                    
    const tangentY = -3 * Math.pow(1-t, 2) * startY + 
                    3 * Math.pow(1-t, 2) * arcPoint1Y - 
                    6 * t * (1-t) * arcPoint1Y + 
                    6 * t * (1-t) * arcPoint2Y - 
                    3 * Math.pow(t, 2) * arcPoint2Y + 
                    3 * Math.pow(t, 2) * startY;
                    
    // Get angle from tangent
    const tangentAngle = Math.atan2(tangentY, tangentX);
    
    // Draw arrowhead
    const arrowSize = 8; // Slightly smaller than regular transitions
    this.ctx.beginPath();
    this.ctx.moveTo(arrowX, arrowY);
    this.ctx.lineTo(
      arrowX - arrowSize * Math.cos(tangentAngle - Math.PI / 6),
      arrowY - arrowSize * Math.sin(tangentAngle - Math.PI / 6)
    );
    this.ctx.lineTo(
      arrowX - arrowSize * Math.cos(tangentAngle + Math.PI / 6),
      arrowY - arrowSize * Math.sin(tangentAngle + Math.PI / 6)
    );
    this.ctx.closePath();
    this.ctx.fillStyle = strokeColor;
    this.ctx.fill();
    
    // Calculate optimal label position - place it near the top of the curve
    // Parametric position at the top of the curve 
    const labelT = 0.5; // Middle of the curve
    const textX = Math.pow(1-labelT, 3) * startX + 
                  3 * Math.pow(1-labelT, 2) * labelT * arcPoint1X + 
                  3 * (1-labelT) * Math.pow(labelT, 2) * arcPoint2X + 
                  Math.pow(labelT, 3) * startX;
                  
    const textY = Math.pow(1-labelT, 3) * startY + 
                  3 * Math.pow(1-labelT, 2) * labelT * arcPoint1Y + 
                  3 * (1-labelT) * Math.pow(labelT, 2) * arcPoint2Y + 
                  Math.pow(labelT, 3) * startY - 20; // Offset up a bit
    
    // Text background with rounded corners
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    const font = isActive ? 'bold 16px Arial' : '14px Arial';
    const textWidth = this.measureTextWidth(symbol, font) + 10;
    const textHeight = 20;
    const cornerRadius = 4;
    
    this._drawRoundedRect(
      textX - textWidth/2, 
      textY - textHeight/2, 
      textWidth, 
      textHeight, 
      cornerRadius
    );
    
    // Text
    this.ctx.fillStyle = textColor;
    this.ctx.font = font;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(symbol, textX, textY);
  }
  
  // Find the best angle for self-loop placement based on surrounding states
  _findBestSelfLoopAngle(position, state) {
    if (!state || Object.keys(this.statePositions).length <= 1) {
      // Default angle if no context or only one state
      return position.angle || 0;
    }
    
    // Calculate angles to all other states
    const angles = [];
    const MIN_ANGLE_SEPARATION = Math.PI / 4; // Minimum desired angle between states
    
    for (const otherState in this.statePositions) {
      if (otherState === state) continue;
      
      const otherPos = this.statePositions[otherState];
      const dx = otherPos.x - position.x;
      const dy = otherPos.y - position.y;
      const angle = Math.atan2(dy, dx);
      angles.push(angle);
    }
    
    if (angles.length === 0) return position.angle || 0;
    
    // Sort angles
    angles.sort((a, b) => a - b);
    
    // Find the largest gap between angles
    let maxGap = angles[0] - angles[angles.length - 1] + 2 * Math.PI;
    let gapStart = angles[angles.length - 1];
    
    for (let i = 1; i < angles.length; i++) {
      const gap = angles[i] - angles[i - 1];
      if (gap > maxGap) {
        maxGap = gap;
        gapStart = angles[i - 1];
      }
    }
    
    // Check if gap is large enough, otherwise use MIN_ANGLE_SEPARATION to force more space
    if (maxGap < MIN_ANGLE_SEPARATION && angles.length > 0) {
      // Place the loop in a direction with more space
      gapStart = (gapStart + Math.PI) % (2 * Math.PI); // Opposite direction
    }
    
    // Return the middle of the largest gap
    return gapStart + maxGap / 2;
  }
  
  // Count the number of self-loops on a given state
  _countSelfLoops(state) {
    if (!state) return 1;
    
    let count = 0;
    
    // Check transition cache for self-loops
    if (this._transitionCache && this._transitionCache.size > 0) {
      for (const [key] of this._transitionCache.entries()) {
        const parts = key.split('|');
        if (parts.length >= 2 && parts[0] === state && parts[1] === state) {
          count++;
        }
      }
    }
    
    return Math.max(1, count);
  }
  
  // Get index for a self-loop to determine its position
  _getSelfLoopIndex(state, symbol) {
    if (!state) return 0;
    
    const loops = [];
    
    // Collect all self-transitions on this state
    if (this._transitionCache && this._transitionCache.size > 0) {
      for (const [key] of this._transitionCache.entries()) {
        const parts = key.split('|');
        if (parts.length >= 3 && parts[0] === state && parts[1] === state) {
          loops.push(parts[2]); // Symbol is the third part
        }
      }
    }
    
    const index = loops.indexOf(symbol);
    return index >= 0 ? index : 0;
  }

  // Draw an arrow between states with smart routing
  drawArrow(fromPos, toPos, options = {}) {
    if (!this.ctx || !fromPos || !toPos) return;
    
    const { 
      symbol = '', 
      isActive = false,
      isDashed = false,
      strokeColor = isActive ? 'rgba(52, 199, 89, 0.8)' : 'rgba(0, 0, 0, 0.6)',
      textColor = isActive ? 'var(--secondary-color)' : 'black',
      from = null, // State name (for parallel edge detection)
      to = null    // State name (for parallel edge detection)
    } = options;
    
    // Check for parallel edges between the same states
    const isParallelEdge = this._isParallelEdge(from, to);
    
    // Calculate the base control point
    const midX = (fromPos.x + toPos.x) / 2;
    const midY = (fromPos.y + toPos.y) / 2;
    const normalX = -(toPos.y - fromPos.y);
    const normalY = toPos.x - fromPos.x;
    let length = Math.sqrt(normalX * normalX + normalY * normalY);
    
    // Prevent division by zero
    if (length === 0) length = 0.0001;
    
    // Calculate the direct distance between states
    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;
    const directDistance = Math.sqrt(dx * dx + dy * dy);
    
    // Adjust curve based on distance and parallel edges
    let curveFactor = 0.2;
    
    // For closer states, increase curve to prevent congestion
    if (directDistance < this.stateRadius * 5) {
      curveFactor = 0.4;
    }
    
    // For parallel edges, offset in alternating directions
    if (isParallelEdge) {
      const parallelIndex = this._getParallelEdgeIndex(from, to, symbol);
      const alternatingFactor = parallelIndex % 2 === 0 ? 1 : -1;
      curveFactor = 0.3 + (parallelIndex * 0.1) * alternatingFactor;
    }
    
    // Apply curve factor to control point
    const statesCount = Object.keys(this.statePositions).length || 5;
    const curveAmount = this.stateRadius * curveFactor * Math.min(statesCount, 10);
    let cpX = midX + (normalX / length) * curveAmount;
    let cpY = midY + (normalY / length) * curveAmount;
    
    // Adjust control point for overlapping transitions
    const { cpX: adjustedCpX, cpY: adjustedCpY } = this._adjustControlPointForOverlaps(cpX, cpY, fromPos, toPos);
    cpX = adjustedCpX;
    cpY = adjustedCpY;
    
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
    
    // Draw arrow with better curve
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    
    // Use quadratic or bezier curve based on distance
    if (directDistance > this.stateRadius * 8) {
      // For longer distances, use cubic Bezier with two control points for smoother curve
      const cp1x = fromPos.x + (cpX - fromPos.x) * 0.5;
      const cp1y = fromPos.y + (cpY - fromPos.y) * 0.5;
      const cp2x = toPos.x + (cpX - toPos.x) * 0.5;
      const cp2y = toPos.y + (cpY - toPos.y) * 0.5;
      
      this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
    } else {
      // For shorter distances, quadratic curve is sufficient
      this.ctx.quadraticCurveTo(cpX, cpY, endX, endY);
    }
    
    if (isDashed) {
      this.ctx.setLineDash([5, 3]);
    } else {
      this.ctx.setLineDash([]);
    }
    
    this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = isActive ? 3 : 2;
    this.ctx.stroke();
    this.ctx.setLineDash([]); // Reset dash pattern
    
    // Draw arrowhead with better angle calculation
    const arrowSize = 10;
    let arrowAngle;
    
    // For cubic bezier, calculate tangent at end point
    if (directDistance > this.stateRadius * 8) {
      const t = 0.95; // Position near the end to calculate tangent
      const cp1x = fromPos.x + (cpX - fromPos.x) * 0.5;
      const cp1y = fromPos.y + (cpY - fromPos.y) * 0.5;
      const cp2x = toPos.x + (cpX - toPos.x) * 0.5;
      const cp2y = toPos.y + (cpY - toPos.y) * 0.5;
      
      // Calculate tangent at point t
      const tangentX = 3 * Math.pow(1-t, 2) * (cp1x - startX) + 
                      6 * (1-t) * t * (cp2x - cp1x) + 
                      3 * Math.pow(t, 2) * (endX - cp2x);
                      
      const tangentY = 3 * Math.pow(1-t, 2) * (cp1y - startY) + 
                      6 * (1-t) * t * (cp2y - cp1y) + 
                      3 * Math.pow(t, 2) * (endY - cp2y);
                      
      arrowAngle = Math.atan2(tangentY, tangentX);
    } else {
      // For quadratic curve, use simple angle calculation
      arrowAngle = Math.atan2(endY - cpY, endX - cpX);
    }
    
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
    
    // Calculate better label position
    // For parallel edges, offset the label
    let textX = cpX;
    let textY = cpY - 15;
    
    // For long distances, position label along the curve
    if (directDistance > this.stateRadius * 8) {
      const t = 0.5; // Position in the middle of the curve
      const cp1x = fromPos.x + (cpX - fromPos.x) * 0.5;
      const cp1y = fromPos.y + (cpY - fromPos.y) * 0.5;
      const cp2x = toPos.x + (cpX - toPos.x) * 0.5;
      const cp2y = toPos.y + (cpY - toPos.y) * 0.5;
      
      // Calculate point on cubic Bezier curve
      textX = Math.pow(1-t, 3) * startX + 
              3 * Math.pow(1-t, 2) * t * cp1x + 
              3 * (1-t) * Math.pow(t, 2) * cp2x + 
              Math.pow(t, 3) * endX;
              
      textY = Math.pow(1-t, 3) * startY + 
              3 * Math.pow(1-t, 2) * t * cp1y + 
              3 * (1-t) * Math.pow(t, 2) * cp2y + 
              Math.pow(t, 3) * endY;
      
      // Offset perpendicular to the curve
      const tangentX = 3 * Math.pow(1-t, 2) * (cp1x - startX) + 
                      6 * (1-t) * t * (cp2x - cp1x) + 
                      3 * Math.pow(t, 2) * (endX - cp2x);
                      
      const tangentY = 3 * Math.pow(1-t, 2) * (cp1y - startY) + 
                      6 * (1-t) * t * (cp2y - cp1y) + 
                      3 * Math.pow(t, 2) * (endY - cp2y);
                      
      const perpX = -tangentY;
      const perpY = tangentX;
      const perpLength = Math.sqrt(perpX * perpX + perpY * perpY);
      
      if (perpLength > 0) {
        textY -= (perpY / perpLength) * 15;
      } else {
        textY -= 15;
      }
    }
    
    // Text background with rounded corners
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    const font = isActive ? 'bold 16px Arial' : '14px Arial';
    const textWidth = this.measureTextWidth(symbol, font) + 10;
    const textHeight = 20;
    const cornerRadius = 4;
    
    this._drawRoundedRect(
      textX - textWidth/2, 
      textY - textHeight/2, 
      textWidth, 
      textHeight, 
      cornerRadius
    );
    
    // Text
    this.ctx.fillStyle = textColor;
    this.ctx.font = font;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(symbol, textX, textY);
  }
  
  // Draw rounded rectangle for improved label aesthetics
  _drawRoundedRect(x, y, width, height, radius) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + width - radius, y);
    this.ctx.arcTo(x + width, y, x + width, y + radius, radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.arcTo(x, y + height, x, y + height - radius, radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.arcTo(x, y, x + radius, y, radius);
    this.ctx.closePath();
    this.ctx.fill();
  }
  
  // Helper to check if there are parallel edges between states
  _isParallelEdge(from, to) {
    if (!from || !to || from === to) return false;
    
    // Count transitions between these states
    let count = 0;
    
    // Check transition cache for parallel edges
    const uniqueEdges = new Set();
    if (this._transitionCache && this._transitionCache.size > 0) {
      for (const [key] of this._transitionCache.entries()) {
        const parts = key.split('|');
        if (parts.length >= 2 && parts[0] === from && parts[1] === to) {
          uniqueEdges.add(key);
          count++;
        }
      }
    }
    
    return count > 1;
  }
  
  // Get index for a parallel edge to determine its curve offset
  _getParallelEdgeIndex(from, to, symbol) {
    if (!from || !to) return 0;
    
    const edges = [];
    
    // Collect all transitions between these states
    if (this._transitionCache && this._transitionCache.size > 0) {
      for (const [key] of this._transitionCache.entries()) {
        const parts = key.split('|');
        if (parts.length >= 3 && parts[0] === from && parts[1] === to) {
          edges.push(parts[2]); // Symbol is the third part
        }
      }
    }
    
    return edges.indexOf(symbol);
  }
  
  // Adjust control point to avoid overlaps with states
  _adjustControlPointForOverlaps(cpX, cpY, fromPos, toPos) {
    // Original control point coordinates for reference
    const originalCpX = cpX;
    const originalCpY = cpY;
    
    // Check if control point overlaps with any state
    for (const stateId in this.statePositions) {
      const pos = this.statePositions[stateId];
      const dx = cpX - pos.x;
      const dy = cpY - pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // If control point is too close to a state, adjust it
      if (dist < this.stateRadius * 1.5) {
        // Move control point away from state
        const moveFactor = (this.stateRadius * 1.5) / dist;
        cpX = pos.x + dx * moveFactor;
        cpY = pos.y + dy * moveFactor;
      }
    }
    
    // Make sure the adjusted control point still creates a good curve
    // If it's been moved too far from the original, blend it
    const adjustmentDistance = Math.sqrt(
      Math.pow(cpX - originalCpX, 2) + 
      Math.pow(cpY - originalCpY, 2)
    );
    
    if (adjustmentDistance > this.stateRadius * 3) {
      // Blend original and adjusted positions
      const blendFactor = 0.7; // 70% original, 30% adjusted
      cpX = originalCpX * blendFactor + cpX * (1 - blendFactor);
      cpY = originalCpY * blendFactor + cpY * (1 - blendFactor);
    }
    
    return { cpX, cpY };
  }
}