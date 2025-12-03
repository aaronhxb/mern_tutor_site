import { 
    createApi, 
    fetchBaseQuery 
} from '@reduxjs/toolkit/query/react'
import { signIn } from '../../features/auth/authSlice'

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3500',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const accessToken = getState().auth.token
        if(accessToken) {
            headers.set("authorization", `Bearer ${accessToken}`)
        }
        return headers
    }
})

const baseQueryWithRefresh = async(args, api, extraOptions) => {
    console.log(args) // request url, method, body
    console.log(api) // signal, dispatch, getState()
    console.log(extraOptions) //custom like {shout: true}

    let result = await baseQuery(args, api, extraOptions)

    console.log(result) 

    if (result?.error?.status === 403){
        console.log("Refreshing...")
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)
        if(refreshResult?.data) {
            api.dispatch(signIn({ ...refreshResult.data }))
            result = await baseQuery(args, api, extraOptions)
        } else {
            if (refreshResult?.error?.status === 403) {
                refreshResult.error.data = 'Your login has expired. '
            }
            return refreshResult
        }
    }
    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithRefresh,
    tagTypes: [ 'User', 'Video' ],
    endpoints: builder => ({})
})