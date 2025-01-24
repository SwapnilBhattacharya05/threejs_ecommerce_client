import React from 'react';
import { SketchPicker } from 'react-color';
import { useSnapshot } from 'valtio';
import state from '../store';


const ColorPicker = () => {
  const snap = useSnapshot(state);

  return (
    <div className='absolute left-full ml-3'>
      <SketchPicker
        color={snap.color}
        disableAlpha
        presetColors={[
          "#bcbcbc",
          "#EAB34A",
          "#78D080",
          "#6A61D6",
          "#3E4040",
          "#24C2D1",
          "#FF8065",
          "#6A8FD2",
          "#BA7E6F",
          "#FF85B3",
          "#4A201A",
          "#661244"
        ]}

        // TO ALLOW TO MODIFY COLORS
        onChange={(color) => state.color = color.hex}


      />

    </div>
  )
}

export default ColorPicker