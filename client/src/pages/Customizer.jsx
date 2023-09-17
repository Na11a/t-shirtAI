import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useSnapshot } from "valtio"

import config from '../config/config'
import state from '../store'
import { download } from '../assets'
import { downloadCanvasToImage, reader } from '../config/helpers'
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants'
import { fadeAnimation, slideAnimation } from "../config/motion"
import { AIPicker, ColorPicker, FilePicker, CustomButton, Tab } from "../components"
function Customizer() {
  const snap = useSnapshot(state);

  const [file,setFile] = useState('')
  const [promt,setPromt] = useState('')
  const [generatingImg,setGeneratingImg] = useState(false)

  const [activeEditorTab, setActiveEditorTab] = useState("")
  const [activeFilterTab,setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false
  })

  // show tab content depending on activeTab
  const generateTabContent = () => {
    switch (activeEditorTab){
      case "colorpicker":
        return <ColorPicker />
      case "filepicker": 
        return <FilePicker 
          file={file}
          setFile={setFile}
          readFile={readFile}
          />
      case "aipicker": 
        return <AIPicker 
          promt={promt}
          setPromt={setPromt}
          generatingImg={generatingImg}
          handleSubmit={handleSubmit}
        />
      default:
        return null
    }
  }

  const handleSubmit = async (type) => {
    if(!promt) return alert('Please enter a promt')

    try{

    } catch(error){
      alert(error)
    }
    setGeneratingImg(false)
    setActiveEditorTab("")
  }

  const handleDecals = (type,result) => {
    const decalType = DecalTypes[type]
    state[decalType.stateProperty] = result
    if(!activeFilterTab[decalType.filterType]){
      handleActiveFilterTab(decalType.filterTab)
    }
  }

  const handleActiveFilterTab = (tabname) => {
    switch (tabname) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabname]
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabname]
      
        default:
          state.isFullTexture = false;
          state.isLogoTexture = true;
    }

    //after setting the state, activeFilterTab update the UI
    setActiveFilterTab(prev => {
      return {
        ...prev,
        [tabname]: !prev[tabname]
      }
    })
  }

  const readFile = (type) => {
    reader(file)
      .then(result => { handleDecals(type,result); setActiveFilterTab("") })
  }

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div className="absolute top-0 left-0 z-100" {...slideAnimation('left')}>
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                    <Tab 
                      key={tab.name}
                      tab={tab}
                      handleClick={()=>{setActiveEditorTab(tab.name)}}
                    />
                ))}
                {generateTabContent()}
              </div>
            </div>
          </motion.div>
          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <CustomButton 
              title={'Go back'}
              type={'filled'}
              handleClick={()=> state.intro = true}
              customStyles={'w-fit px-4 py-2.5 font-bold text-sm'}
            />
          </motion.div>
          <motion.div
            className="filtertabs-container"
            {...slideAnimation('up')}
          >
            {FilterTabs.map((tab) => (
              <Tab 
                key={tab.name}
                tab={tab}
                isFilteringTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={()=>{handleActiveFilterTab(tab.name)}}
              />
            ))
          }
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Customizer