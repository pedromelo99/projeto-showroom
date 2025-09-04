<template>
  <div>
    <!-- Main Image -->
    <v-img
      :src="currentImage"
      height="400"
      cover
      class="cursor-pointer"
      @click="openDialog"
    >
      <template v-slot:placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-icon size="64" color="grey-lighten-2">mdi-car</v-icon>
        </div>
      </template>
      
      <v-overlay
        :model-value="true"
        class="d-flex align-center justify-center"
        style="background: rgba(0,0,0,0.3);"
      >
        <v-icon size="48" color="white">mdi-magnify-plus</v-icon>
      </v-overlay>
    </v-img>

    <!-- Thumbnail Images -->
    <div v-if="images && images.length > 1" class="pa-4">
      <v-row>
        <v-col
          v-for="(image, index) in images"
          :key="index"
          cols="3"
          class="pa-1"
        >
          <v-img
            :src="image.image_url"
            height="80"
            cover
            class="cursor-pointer rounded"
            :class="{ 'selected-thumbnail': index === currentImageIndex }"
            @click="setCurrentImage(index)"
          >
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-icon size="24" color="grey-lighten-2">mdi-car</v-icon>
              </div>
            </template>
          </v-img>
        </v-col>
      </v-row>
    </div>

    <!-- Image Counter -->
    <div v-if="images && images.length > 1" class="pa-4 pt-0">
      <v-chip
        color="primary"
        variant="flat"
        size="small"
      >
        {{ currentImageIndex + 1 }} de {{ images.length }}
      </v-chip>
    </div>

    <!-- Full Screen Dialog -->
    <v-dialog
      v-model="dialog"
      fullscreen
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          color="primary"
          dark
        >
          <v-toolbar-title>{{ carName }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-container fluid class="pa-0">
          <v-row no-gutters>
            <!-- Main Image Area -->
            <v-col cols="12" md="9">
              <div class="d-flex align-center justify-center" style="height: 100vh;">
                <v-img
                  :src="currentImage"
                  contain
                  max-height="100vh"
                  class="cursor-pointer"
                  @click="nextImage"
                >
                  <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-icon size="64" color="grey-lighten-2">mdi-car</v-icon>
                    </div>
                  </template>
                </v-img>
              </div>
            </v-col>

            <!-- Thumbnail Sidebar -->
            <v-col cols="12" md="3" class="bg-grey-lighten-4">
              <div class="pa-4">
                <h3 class="text-h6 mb-4">Imagens</h3>
                <v-row>
                  <v-col
                    v-for="(image, index) in images"
                    :key="index"
                    cols="12"
                    class="pa-1"
                  >
                    <v-img
                      :src="image.image_url"
                      height="120"
                      cover
                      class="cursor-pointer rounded"
                      :class="{ 'selected-thumbnail': index === currentImageIndex }"
                      @click="setCurrentImage(index)"
                    >
                      <template v-slot:placeholder>
                        <div class="d-flex align-center justify-center fill-height">
                          <v-icon size="24" color="grey-lighten-2">mdi-car</v-icon>
                        </div>
                      </template>
                    </v-img>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </v-container>

        <!-- Navigation Arrows -->
        <v-btn
          v-if="images && images.length > 1"
          icon
          size="large"
          color="white"
          class="nav-arrow nav-arrow-left"
          @click="previousImage"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>

        <v-btn
          v-if="images && images.length > 1"
          icon
          size="large"
          color="white"
          class="nav-arrow nav-arrow-right"
          @click="nextImage"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  carName: {
    type: String,
    default: 'Carro'
  }
})

const dialog = ref(false)
const currentImageIndex = ref(0)

const currentImage = computed(() => {
  if (!props.images || props.images.length === 0) {
    return 'https://via.placeholder.com/600x400/f0f0f0/999999?text=Sem+Imagem'
  }
  return props.images[currentImageIndex.value]?.image_url || 'https://via.placeholder.com/600x400/f0f0f0/999999?text=Sem+Imagem'
})

const setCurrentImage = (index) => {
  currentImageIndex.value = index
}

const nextImage = () => {
  if (props.images && props.images.length > 1) {
    currentImageIndex.value = (currentImageIndex.value + 1) % props.images.length
  }
}

const previousImage = () => {
  if (props.images && props.images.length > 1) {
    currentImageIndex.value = currentImageIndex.value === 0 
      ? props.images.length - 1 
      : currentImageIndex.value - 1
  }
}

const openDialog = () => {
  dialog.value = true
}

// Keyboard navigation
onMounted(() => {
  const handleKeydown = (e) => {
    if (dialog.value) {
      if (e.key === 'ArrowLeft') {
        previousImage()
      } else if (e.key === 'ArrowRight') {
        nextImage()
      } else if (e.key === 'Escape') {
        dialog.value = false
      }
    }
  }
  
  document.addEventListener('keydown', handleKeydown)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
})
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.selected-thumbnail {
  border: 3px solid rgb(var(--v-theme-primary));
}

.nav-arrow {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5) !important;
}

.nav-arrow-left {
  left: 20px;
}

.nav-arrow-right {
  right: 20px;
}
</style>
