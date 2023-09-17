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
  const [prompt,setPrompt] = useState('')
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
          prompt={prompt}
          setPrompt={setPrompt}
          generatingImg={generatingImg}
          handleSubmit={handleSubmit}
        />
      default:
        return null
    }
  }

  const handleSubmit = async (type) => {
    if(!prompt) return alert('Please enter a prompt')

    try{
      setGeneratingImg(true);

      const response = await fetch('http://localhost:8080/api/v1/dalle', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt
        })
      })

      const data = await response.json()
      if (data.text === 'Trial is out'){
        return alert('Trial is out. You can`t use Dalle')
      }

      handleDecals(type, `data:image/png;base64,${data.photo}`)
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
        break;
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