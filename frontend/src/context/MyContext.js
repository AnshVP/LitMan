import { createContext } from "react"

const ToastContext = createContext() // creating a context for user notes and methods to manipulate it
const UserContext = createContext()
const PostContext = createContext()
const FollowContext = createContext()

export {ToastContext,UserContext,PostContext,FollowContext} 