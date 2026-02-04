import { useState, useEffect } from "react"
import { getUserGroups } from "../services/groupService"

/**
 * Hook personalitzat per gestionar la càrrega dels grups als quals pertany l'usuari actual.
 * @param userId 
 * @returns Object amb els grups de l'usuari, un indicador de càrrega i una funció per recarregar els grups
 */
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