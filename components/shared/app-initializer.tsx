import React, { useEffect, useState } from 'react'
import useSettingStore from '@/hooks/use-setting-store'
import { ClientSetting } from '@/types'

export default function AppInitializer({
  setting,
  children,
}: {
  setting: ClientSetting
  children: React.ReactNode
}) {
  const [rendered, setRendered] = useState(true)

  useEffect(() => {
    setRendered(true)
  }, [setting])
  if (!rendered) {
    useSettingStore.setState({
      setting,
    })
  }

  return children
}

