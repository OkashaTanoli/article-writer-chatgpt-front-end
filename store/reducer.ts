// type IData = {
//     name: string,
//     email: string,
//     token: string
// }

import { IData } from "@/types"

const Reducer = (state: IData, action: { type: string, payload: any }) => {
    switch (action.type) {
        case 'AUTH':
            state.user = action.payload
            return { ...state }

        case 'AUTH_LOGOUT':
            state.user = null
            return { ...state }


        default:
            return state
    }
}
export default Reducer