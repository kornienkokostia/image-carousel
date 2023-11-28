<template>
  <div class="selected-images-wrapper">
    <span v-if="isEmpty">Empty</span>
    <TransitionGroup name="list" tag="div" class="selected-images">
      <a
        class="selected-image-link"
        v-for="item in props.data"
        :key="item.id"
        :href="item.url"
        target="_blank">
        {{ item.url }}
      </a>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
import { SelectedImage } from '../types';
import { ref, watch } from 'vue';

interface Props {
  data: SelectedImage[];
}

const props = defineProps<Props>();
const isEmpty = ref<boolean>(true);

watch(
  () => props.data,
  (val: SelectedImage[]) => {
    if (val.length) {
      isEmpty.value = false;
    } else {
      setTimeout(() => {
        isEmpty.value = true;
      }, 500);
    }
  },
  { deep: true },
);
</script>

<style lang="scss" scoped>
.selected {
  &-images {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 20px;
    &-wrapper {
      display: flex;
      background-color: #f5f5f7;
      height: fit-content;
      max-height: calc(100vh - 462px);
      border-radius: 12px;
      width: calc(100% - 60px);
      min-height: 20px;
      padding: 20px 0px 20px 20px;
      margin: 20px;
    }
  }

  &-image-link {
    color: #000000;
    height: 20px;
    width: fit-content;
  }
}
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
::-webkit-scrollbar {
  width: 17px;
}
::-webkit-scrollbar-track {
  margin-top: -13px;
  margin-bottom: -13px;
}
::-webkit-scrollbar-thumb {
  border: 5px solid rgba(0, 0, 0, 0);
  background-clip: padding-box;
  border-radius: 9999px;
  background-color: #d5d5d5;
}
</style>
