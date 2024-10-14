"use client"

import React, { createContext, useState, useEffect, useContext } from 'react'

type UserContent = {
  [key: string]: any
}

type UserContentContextType = {
  content: UserContent
  setContent: (key: string, value: any) => void
  removeContent: (key: string) => void
}

const UserContentContext = createContext<UserContentContextType | undefined>(undefined)

export const UserContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<UserContent>({})

  useEffect(() => {
    // Load content from localStorage on initial render
    const storedContent = localStorage.getItem('userContent')
    if (storedContent) {
      setContent(JSON.parse(storedContent))
    }
  }, [])

  const updateContent = (key: string, value: any) => {
    setContent(prevContent => {
      const newContent = { ...prevContent, [key]: value }
      // Save to localStorage
      localStorage.setItem('userContent', JSON.stringify(newContent))
      return newContent
    })
  }

  const removeContentItem = (key: string) => {
    setContent(prevContent => {
      const newContent = { ...prevContent }
      delete newContent[key]
      // Update localStorage
      localStorage.setItem('userContent', JSON.stringify(newContent))
      return newContent
    })
  }

  return (
    <UserContentContext.Provider value={{ content, setContent: updateContent, removeContent: removeContentItem }}>
      {children}
    </UserContentContext.Provider>
  )
}

export const useUserContent = () => {
  const context = useContext(UserContentContext)
  if (context === undefined) {
    throw new Error('useUserContent must be used within a UserContentProvider')
  }
  return context
}