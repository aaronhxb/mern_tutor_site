import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: 'auth',
    initialState: { token: null },
    reducers: {
        signIn: (state, action) => {
            const { accessToken } = action.payload
            state.token = accessToken
        },
        signOut: (state) => {
            state.token = null
        }
    }
})

export const { signIn, signOut } = authSlice.actions

export default authSlice.reducer



