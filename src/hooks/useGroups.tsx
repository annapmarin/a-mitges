import { useState, useEffect } from "react"
import { getUserGroups } from "../services/groupService"

export function useGroups(userId: string | undefined) {
  const [groups, setGroups] = useState<Array<any>>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!userId) return

    loadGroups()
  }, [userId])

  const loadGroups = async () => {
    setLoading(true)
    
    try {
      setLoading(true)
      const userGroups = await getUserGroups(userId!)
      setGroups(userGroups)
    } catch (error) {
      console.error("Error carregant els grups de l'usuari:", error)
    } finally {
      setLoading(false)
    }
  }

  return { groups, loading, refetch: loadGroups }
}