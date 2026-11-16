import { createSlice } from '@reduxjs/toolkit'




const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: false,
        error: false
    },
    reducers: {

        setUser: (state, payload) => {
            state.user = action.payload

        },
        setLoading: (state, payload) => {
            state.loading = action.payload
        },
        setError: (state, payload) => {
            state.error = action.payload
        }

    }
})


export const {setUser,setLoading,setError } = authSlice.actions


export default authSlice.reducer