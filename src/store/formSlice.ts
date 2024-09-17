import { createSlice } from '@reduxjs/toolkit'
import {defaultValues as defaultFormValues} from '@/types/form'

const initialState = {
    formData: defaultFormValues
}

export const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        updateFormData: (state, action) => {
            const payload = action.payload;       
            state.formData.secre2type = payload.secre2type
            state.formData.secret = {...payload.secret}
            state.formData.checkBalance = payload.checkBalance

        }
    }

})

export const { updateFormData } = formSlice.actions;
export default formSlice.reducer;