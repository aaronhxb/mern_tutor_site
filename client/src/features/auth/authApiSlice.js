import { apiSlice } from "../../app/api/apiSlice"
import { signIn, signOut } from "./authSlice"

const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        signIn: builder.mutation({
            query: (credentials) => ({
                url: '/auth/signin',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        googleAuth: builder.mutation({
            query: (credentials) => ({
                url: '/auth/google',
                method: 'POST',
                body: { ...credentials },
            })
        }),
        refresh: builder.mutation({
            query: ()=>({
                url: '/auth/refresh',
                method: 'GET',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try{
                    const { accessToken } = await (await queryFulfilled).data
                    dispatch(signIn({ accessToken }))
                } catch(err){
                    console.log(err)
                }
            }
        }),
        logOut: builder.mutation({
            query: () => ({
                url: '/auth/signout',
                method: 'POST'
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                    dispatch(signOut())
                    setTimeout(() => {
                        dispatch(apiSlice.util.resetApiState())
                    }, 1000)
                } catch(err){
                    console.log(err)
                }
            }
        })
    })
})

export const {
    useSignInMutation,
    useGoogleAuthMutation,
    useRefreshMutation,
    useLogOutMutation
} = authApiSlice