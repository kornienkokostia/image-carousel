<template>
  <div class="main">
    <h2 class="main-title">Image Carousel</h2>
    <Carousel
      :data="images"
      :selectedImages="selectedImages"
      :add="addSelectedImage"
      :remove="removeSelectedImage" />
    <h2 class="main-title">Selected Images</h2>
    <SelectedImages :data="selectedImages" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import Carousel from './components/Carousel.vue';
import SelectedImages from './components/SelectedImages.vue';
import { Image, SelectedImage } from './types';
import axios from 'axios';

const images = ref<Image[]>([]);
const selectedImages = ref<SelectedImage[]>([]);

const fetchImages = async () => {
  try {
    const response = await axios.get<Image[]>('https://picsum.photos/v2/list');
    images.value = response.data;
  } catch (error) {
    alert('error');
  }
};

const addSelectedImage = (image: Image) => {
  selectedImages.value.push({ url: image.download_url, id: image.id });
};

const removeSelectedImage = (id: string) => {
  selectedImages.value = selectedImages.value.filter(el => el.id !== id);
};

onMounted(() => {
  fetchImages();
});
</script>

<style scoped lang="scss">
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  &-title {
    font-size: 30px;
    margin: 0;
    padding-top: 20px;
  }
}
</style>
