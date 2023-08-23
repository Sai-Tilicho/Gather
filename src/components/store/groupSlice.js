import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    groupData: { aa: "bbb" },
    new: "nw one",
}

export const groupSlice = createSlice({
    name: 'group',
    initialState,
    reducers: {
        setGroupData: (state, action) => {
            state.groupData = action.payload
        },
        setNew: (state, action) => {
            state.new = action.payload
        },
    },
})

export const { setGroupData, setNew } = groupSlice.actions

export default groupSlice.reducer