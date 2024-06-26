import { getCryptoAddressesBalanceFromItem } from '@/lib/api'
import { IPrimaryResponse } from '@/types/form'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'



const initialState: {data: IPrimaryResponse[]} = {
  data: []
}


export const createCoin = createAsyncThunk<
  IPrimaryResponse,
  IPrimaryResponse
>(
  'generator/createCoin',
  async (item) => {    
    return await item
  }
)

export const updateCoin = createAsyncThunk<
  IPrimaryResponse,
  IPrimaryResponse
>(
  'generator/updateCoin',
  async (item) => {
    return await getCryptoAddressesBalanceFromItem({...item})
  }
)

export const generatorSlice = createSlice({
  name: 'generator',
  initialState,
  reducers: {
    clear: (state) => {
      state.data = []
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createCoin.fulfilled, (state, {payload}) => {  
      const gnr = state.data

      if(Object.keys(payload).length > 0) {

        if(gnr.length > 0) {
          const stateIndex = gnr.findIndex(i => i.id === payload.id)

          if(stateIndex >= 0 ) {
            gnr[stateIndex] = payload

          } else {

            gnr.push(payload)
          }
          
        } else {
          
          gnr.push(payload)
        }

      } 
       
    })
    builder.addCase(updateCoin.fulfilled, (state, {payload}) => {
      const gnr = state.data
      const address = payload.address

      if(gnr.length > 0){
        
        const index = gnr.findIndex(item => item.address === address)
        if(index >= 0) {
          gnr[index] = payload
          // console.log('update Slice', action.payload);
          
        }
      }
    })
  }

})

// Action creators are generated for each case reducer function
// export const { createGenerator } = generatorSlice.actions

export const {clear} = generatorSlice.actions

export default generatorSlice.reducer




