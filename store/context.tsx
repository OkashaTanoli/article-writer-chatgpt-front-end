'use client'

import React, { createContext, ReactHTMLElement, ReactNode, useReducer } from "react";
import Reducer from "./reducer";
import { IContext, IData, IUser } from "@/types";

const user: IUser = null


const data: IData = {
    user
}




export const ContextApi = createContext<IContext>({
    state: data,
    dispatch: () => null
});

export const CreateContext = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(Reducer, data);
    return (
        <ContextApi.Provider value={{ state, dispatch }}>
            {children}
        </ContextApi.Provider>
    )

}