import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';
import state from '../store';
import { download, logoShirt } from '../assets';
import { downloadCanvasToImage, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';

import {
  AIPicker,
  ColorPicker,
  CustomButton,
  FilePicker,
  Tab
} from '../components';


// *TO SET URL FOR BACKEND
import config from '../config/config'


const Customizer = () => {
  const snap = useSnapshot(state);
  const [file, setFile] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatingImg, setGeneratingImg] = useState(false);

  const [activeEditorTab, setActiveEditorTab] = useState('');

  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false
  });

  // !SHOW TAB CONTENT DEPENDING ON ACTIVE TAB
  const generateTabContent = () => {

    switch (activeEditorTab) {
      case 'colorpicker':
        return <ColorPicker />
      case 'filepicker':
        return <FilePicker
          file={file}
          setFile={setFile}
          readFile={readFile}
        />
      case 'aipicker':
        return <AIPicker
          prompt={prompt}
          setPrompt={setPrompt}
          generatingImg={generatingImg}
          handleSubmit={handleSubmit}
        />
      default:
        return null;
    };
  };

  // FUNCTION FOR AI PICKER
  const handleSubmit = async (type) => {
    if (!prompt)
      return alert('Please enter a prompt');
    try {

      // CALL BACKEND TO GENERATE AN AI IMAGE
      setGeneratingImg(true);

      const response = await fetch('http://localhost:8080/api/v1/dalle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      const data = await response.json();

      handleDecals(type, `data:image/png;base64,${data.photo}`)

    } catch (error) {
      alert(error)

      // TO RESET THE LOADER
    } finally {
      setGeneratingImg(false);
      setActiveEditorTab('');
    }
  }

  const handleDecals = (type, result) => {

    // TO GET THE TYPE OF DECAL
    const decalType = DecalTypes[type];

    // TO SET THE DECAL, UPDATING THE STATE
    state[decalType.stateProperty] = result;

    // FIGURE OUT OF THAT PARTICULAR DECAL IS CURRENTLY ACTIVE
    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab)
    }
  }

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case 'logoShirt':
        // TO TOGGLE ON/OFF
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case 'stylishShirt':
        // TO TOGGLE ON/OFF
        state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    };

    // AFTER SETTING THE STATE, activeFilterTab IS UPDATED
    setActiveFilterTab((prev) => {
      return {
        ...prev,
        [tabName]: !prev[tabName]
      }
    })
  };



  // TAKE IN TYPE OF THE FILE
  const readFile = (type) => {
    reader(file)
      .then((result) => {

        // !WE WANT TO PASS THAT FILE TO THE DECALS OF THE SHIRT DEPENDING ON TYPE OF IMAGE
        handleDecals(type, result);
        setActiveEditorTab('');
      })
  };

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            className='absolute top-0 left-0 z-10'
            key="custom"
            {...slideAnimation("left")}
          >
            <div className='flex items-center min-h-screen'>
              <div className='editortabs-container tabs'>
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => { setActiveEditorTab(tab.name) }}
                  />
                ))}

                {generateTabContent()}
              </div>
            </div>
          </motion.div>

          {/* BACK BUTTON */}
          <motion.div className='absolute z-10 top-5 right-5' {...fadeAnimation}>
            <CustomButton
              type="filled"
              title="Go Back"
              handleClick={() => state.intro = true}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
          </motion.div>

          {/* TOGGLES/FILTERS TO TURN ON/OFF LOGOS */}
          <motion.div className='filtertabs-container' {...slideAnimation("up")}>
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => { handleActiveFilterTab(tab.name) }}
              />
            ))}

            {/* Download button */}
            <button className='download-btn' onClick={downloadCanvasToImage}>
              <img
                src={download}
                alt='download'
                className='w-3/5 h-3/5 object-contain'
              />
            </button>

          </motion.div>

        </>
      )}
    </AnimatePresence >
  )
}

export default Customizer