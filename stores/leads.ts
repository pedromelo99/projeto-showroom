export const useLeadsStore = defineStore('leads', () => {
    const leads = ref<any[]>([])
    const currentLead = ref<any | null>(null)
    const loading = ref<boolean>(false)

    const fetchLeads = async (params: any = {}) => {
        loading.value = true
        try {
            const config = useRuntimeConfig()
            const { data } = await $fetch(`${config.public.apiBase}/leads`, { query: params })
            leads.value = (data as any).leads || (data as any)
            return data
        } finally {
            loading.value = false
        }
    }

    const fetchLeadById = async (id: number | string) => {
        loading.value = true
        try {
            const config = useRuntimeConfig()
            const { data } = await $fetch(`${config.public.apiBase}/leads/${id}`)
            currentLead.value = (data as any).lead || (data as any)
            return data
        } finally {
            loading.value = false
        }
    }

    const createLead = async (leadData: any) => {
        const config = useRuntimeConfig()
        const { data } = await $fetch(`${config.public.apiBase}/leads`, { method: 'POST', body: leadData })
        leads.value.unshift((data as any).lead || (data as any))
        return data
    }

    const updateLead = async (id: number | string, leadData: any) => {
        const config = useRuntimeConfig()
        const { data } = await $fetch(`${config.public.apiBase}/leads/${id}`, { method: 'PUT', body: leadData })
        const index = leads.value.findIndex(l => l.id === id)
        if (index !== -1) leads.value[index] = { ...leads.value[index], ...(data as any).lead }
        if (currentLead.value && currentLead.value.id === id) currentLead.value = { ...currentLead.value, ...(data as any).lead }
        return data
    }

    const deleteLead = async (id: number | string) => {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/leads/${id}`, { method: 'DELETE' })
        leads.value = leads.value.filter(l => l.id !== id)
        if (currentLead.value && currentLead.value.id === id) currentLead.value = null
        return true
    }

    const updateLeadStatus = async (id: number | string, status: string) => {
        const config = useRuntimeConfig()
        const { data } = await $fetch(`${config.public.apiBase}/leads/${id}/status`, { method: 'PATCH', body: { status } })
        const index = leads.value.findIndex(l => l.id === id)
        if (index !== -1) leads.value[index].status = status
        if (currentLead.value && currentLead.value.id === id) currentLead.value.status = status
        return data
    }

    return {
        leads: readonly(leads),
        currentLead: readonly(currentLead),
        loading: readonly(loading),
        fetchLeads,
        fetchLeadById,
        createLead,
        updateLead,
        deleteLead,
        updateLeadStatus
    }
})


