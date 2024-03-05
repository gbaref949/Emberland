import React from 'react';

const Controls = () => {
  return (
    <div className="controls-container">
      <h2>Controls</h2>
      <div className="control-info">
        <p><strong>w:</strong> Walk up</p>
        <p><strong>A:</strong> Walk left</p>
        <p><strong>D:</strong> Walk right</p>
        <p><strong>S:</strong> Walk down</p>
        <p><strong>esc:</strong> Open menu</p>
        <p><strong>Left click:</strong> Slash</p>
        <p><strong>Shift:</strong> Dash</p>
      </div>
    </div>
  );
}

export default Controls;
