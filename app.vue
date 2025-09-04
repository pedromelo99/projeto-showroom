<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// Global app configuration
useHead({
  title: 'AutoShow - Showroom de Carros Premium',
  meta: [
    { name: 'description', content: 'Encontre o carro dos seus sonhos no AutoShow. Carros novos e seminovos com garantia total e financiamento flexível.' },
    { name: 'keywords', content: 'carros, automóveis, showroom, concessionária, veículos, compra, venda' }
  ]
})
</script>
