import { getAllNetworksPath } from "@/lib/getAllNetworksPath";
import { IAllNetworksPath } from "@/types/form";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";


const initialTableData = getAllNetworksPath()
const initialRowSelections = () => {

    let obj: {[key: string]: any} = {}
    initialTableData.forEach(item => {
      obj[item.id] = true;
    })
    return obj
  }


interface IRowSelections {
    [key: string]: boolean
}


const initialState: {rowSelections: IRowSelections, tableData: IAllNetworksPath[]} = {
    tableData: [],
    rowSelections: {},

}

const localStorageKey = 'rowSelections'

export const networksPathSlice = createSlice({
    name: 'networksPath',
    initialState,
    reducers: {
        setTableData: (state) => {
            state.tableData = initialTableData
            
            
            const localStorageRowSelections = JSON.parse(localStorage.getItem(localStorageKey) || '{}') // check localStorage
            
            if(Object.keys(localStorageRowSelections).length === 0) {
                
                const originalslRowSelections = initialRowSelections() //get all rowSelections
                localStorage.setItem(localStorageKey, JSON.stringify(originalslRowSelections))
                state.rowSelections = originalslRowSelections
                
            } else {

                state.rowSelections = localStorageRowSelections

            }
            
        },
        setRowSelectionsData: (state, action: PayloadAction<IRowSelections>) => {

            state.rowSelections = {}
            state.rowSelections = action.payload
            localStorage.setItem(localStorageKey, JSON.stringify(action.payload))
            
        }
    }
})

export const {setTableData, setRowSelectionsData} = networksPathSlice.actions
export default networksPathSlice.reducer