import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase/client'

interface SubscriptionAccess {
  loading: boolean
  hasAccess: boolean
  trialEndsAt: string | null
}

/**
 * Checks whether the current user has active access: either an active paid
 * subscription, or an unexpired free trial. Creates a trial row (1 month
 * from now) if the user has none yet, matching BillingPage's own logic.
 */
export function useSubscriptionAccess(): SubscriptionAccess {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(true) // default open while loading, to avoid flashing a block screen
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null)

  useEffect(() => {
    async function check() {
      if (!user) {
        setLoading(false)
        setHasAccess(false)
        return
      }
      setLoading(true)

      const { data: existing } = await supabase
        .from('subscriptions')
        .select('status, trial_ends_at')
        .eq('user_id', user.id)
        .maybeSingle()

      let row = existing
      if (!row) {
        const trialEnd = new Date()
        trialEnd.setMonth(trialEnd.getMonth() + 1)
        const { data: created } = await supabase
          .from('subscriptions')
          .insert({ user_id: user.id, status: 'trialing', trial_ends_at: trialEnd.toISOString() })
          .select('status, trial_ends_at')
          .single()
        row = created
      }

      if (!row) {
        // Couldn't read or create a subscription row — fail open rather than
        // locking someone out due to a transient error.
        setHasAccess(true)
        setLoading(false)
        return
      }

      setTrialEndsAt(row.trial_ends_at)
      const trialActive = row.status === 'trialing' && new Date(row.trial_ends_at) > new Date()
      setHasAccess(row.status === 'active' || trialActive)
      setLoading(false)
    }

    void check()
  }, [user])

  return { loading, hasAccess, trialEndsAt }
}
