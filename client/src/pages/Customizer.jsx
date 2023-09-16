import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useSnapshot } from "valtio"

import config from '../config/config'
import state from '../store'
import { download } from '../assets'
import { downloadCanvasToImage } from '../config/helpers'
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants'
import { fadeAnimation, slideAnimation } from "../config/motion"
import { AIPicker, ColorPicker, FilePicker, CustomButton, Tab } from "../components"
function Customizer() {
  const snap = useSnapshot(state);

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div className="absolute top-o left-0 z-10" {...slideAnimation('left')}>
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                    <Tab 
                      key={tab.name}
                      tab={tab}
                      handleClick={()=>{}}
                    />
                ))
                }
              </div>
            </div>
          </motion.div>
          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <CustomButton 
              title={'Go back'}
              type={'fillted'}
              handleClick={()=> state.intro = true}
              customStyles={'w-fit px04 py-2.5 font-bold text-sm'}
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
                isFilterTab
                isActiveTab=""
                handleClick={()=>{}}
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