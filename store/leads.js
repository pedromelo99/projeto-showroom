export const useLeadsStore = defineStore('leads', () => {
    const leads = ref([])
    const currentLead = ref(null)
    const loading = ref(false)

    const fetchLeads = async (params = {}) => {
        loading.value = true
        try {
            const { data } = await $fetch('/api/leads', {
                query: params
            })

            leads.value = data.leads || data
            return data
        } catch (error) {
            console.error('Erro ao buscar leads:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    const fetchLeadById = async (id) => {
        loading.value = true
        try {
            const { data } = await $fetch(`/api/leads/${id}`)

            currentLead.value = data.lead || data
            return data
        } catch (error) {
            console.error('Erro ao buscar lead:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    const createLead = async (leadData) => {
        try {
            const { data } = await $fetch('/api/leads', {
                method: 'POST',
                body: leadData
            })

            leads.value.unshift(data.lead || data)
            return data
        } catch (error) {
            console.error('Erro ao criar lead:', error)
            throw error
        }
    }

    const updateLead = async (id, leadData) => {
        try {
            const { data } = await $fetch(`/api/leads/${id}`, {
                method: 'PUT',
                body: leadData
            })

            const index = leads.value.findIndex(lead => lead.id === id)
            if (index !== -1) {
                leads.value[index] = { ...leads.value[index], ...data.lead }
            }

            if (currentLead.value && currentLead.value.id === id) {
                currentLead.value = { ...currentLead.value, ...data.lead }
            }

            return data
        } catch (error) {
            console.error('Erro ao atualizar lead:', error)
            throw error
        }
    }

    const deleteLead = async (id) => {
        try {
            await $fetch(`/api/leads/${id}`, {
                method: 'DELETE'
            })

            leads.value = leads.value.filter(lead => lead.id !== id)

            if (currentLead.value && currentLead.value.id === id) {
                currentLead.value = null
            }

            return true
        } catch (error) {
            console.error('Erro ao excluir lead:', error)
            throw error
        }
    }

    const updateLeadStatus = async (id, status) => {
        try {
            const { data } = await $fetch(`/api/leads/${id}/status`, {
                method: 'PATCH',
                body: { status }
            })

            const index = leads.value.findIndex(lead => lead.id === id)
            if (index !== -1) {
                leads.value[index].status = status
            }

            if (currentLead.value && currentLead.value.id === id) {
                currentLead.value.status = status
            }

            return data
        } catch (error) {
            console.error('Erro ao atualizar status do lead:', error)
            throw error
        }
    }

    const getLeadById = (id) => {
        return leads.value.find(lead => lead.id === id)
    }

    const getLeadsByStatus = (status) => {
        return leads.value.filter(lead => lead.status === status)
    }

    const getLeadsByCar = (carId) => {
        return leads.value.filter(lead => lead.car_id === carId)
    }

    const getRecentLeads = (limit = 10) => {
        return leads.value
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, limit)
    }

    const getLeadsStats = () => {
        const stats = {
            total: leads.value.length,
            new: 0,
            contacted: 0,
            interested: 0,
            not_interested: 0
        }

        leads.value.forEach(lead => {
            if (stats[lead.status] !== undefined) {
                stats[lead.status]++
            }
        })

        return stats
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
        updateLeadStatus,
        getLeadById,
        getLeadsByStatus,
        getLeadsByCar,
        getRecentLeads,
        getLeadsStats
    }
})
