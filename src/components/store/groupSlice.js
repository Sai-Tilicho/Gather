import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
    groupData: { aa: "bbb" },
    new: "nw one",
    products: [],
    error: '',
    pending: false,
}

export const productsList = createAsyncThunk('group/productsList', async (params, { rejectWithValue }) => {
    const response = await fetch(`https://api.finefoods.refine.dev/${params.name}`)
    if (response.status != 200) {
        return rejectWithValue('Error comes...');
    }
    const json = await response.json()
    return json
})

export const productsListnew = createAsyncThunk('group/productsListnew', async (params, { rejectWithValue }) => {
    const response = await fetch(`https://api.finefoods.refine.dev/${params.name}`)
    if (response.status != 200) {
        return rejectWithValue('Error comes...');
    }
    const json = await response.json()
    return json
})


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
    extraReducers: builder => {
        builder
            // productsList
            .addCase(productsList.pending, (state, action) => {
                state.pending = true
                state.products = []
            })
            .addCase(productsList.rejected, (state, action) => {
                state.pending = false
                state.error = action.payload
            })
            .addCase(productsList.fulfilled, (state, action) => {
                state.pending = false
                state.products = action.payload
            })
            // productsList Now
            .addCase(productsListnew.pending, (state, action) => {
                state.pending = true
                state.products = []
            })
            .addCase(productsListnew.rejected, (state, action) => {
                state.pending = false
                state.error = action.payload
            })
            .addCase(productsListnew.fulfilled, (state, action) => {
                state.pending = false
                state.products = action.payload
            })
    }
})

export const { setGroupData, setNew } = groupSlice.actions

export default groupSlice.reducer