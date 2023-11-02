import React, { createContext, useContext } from "react"

export interface IUserContext {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

export interface IUserProviderProps {
  children: React.ReactNode
}

export const UserContext = createContext({} as IUserContext)

export function UserProvider({ children }: IUserProviderProps) {
  const [user, setUser] = React.useState<User | null>(null)

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext)

//

export type User = {
  username: string
}
