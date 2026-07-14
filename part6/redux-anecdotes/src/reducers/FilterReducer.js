import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
  name: 'filter',
  initialState: '',
  reducers: {
    filterChange(state, action) {
      return action.payload
    }
  }
})

// Redux Toolkit genera los action creators automáticamente
export const { filterChange } = filterSlice.actions
export default filterSlice.reducer