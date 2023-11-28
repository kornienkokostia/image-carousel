<template>
  <div class="images-carousel-wrapper">
    <button
      class="images-carousel-btn images-carousel-btn-left"
      @click="onBtnClick(true)"
      :disabled="turnOffBtns">
      <ArrowIcon class="images-carousel-btn-left-icon" />
    </button>
    <div class="images-carousel">
      <div class="images-carousel-container" ref="carouselRef">
        <div
          class="images-carousel-item-wrapper"
          v-for="image in props.data"
          :key="image.id"
          ref="imageRef"
          @click="
            !checkIfItemIsSelected(image.id)
              ? props.add(image)
              : props.remove(image.id)
          ">
          <img
            :src="getImageLink(image)"
            alt="carousel-image"
            class="images-carousel-item" />
          <div
            class="images-carousel-item-selected"
            v-if="checkIfItemIsSelected(image.id)">
            <SelectedItemIcon class="images-carousel-item-selected-icon" />
          </div>
        </div>
      </div>
    </div>
    <button
      class="images-carousel-btn images-carousel-btn-right"
      @click="onBtnClick(false)"
      :disabled="turnOffBtns">
      <ArrowIcon class="images-carousel-btn-right-icon" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { Image, SelectedImage } from '../types';
import {
  defineAsyncComponent,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
} from 'vue';

interface Props {
  data: Image[];
  selectedImages: SelectedImage[];
  add: (image: Image) => void;
  remove: (id: string) => void;
}

const props = defineProps<Props>();
const ArrowIcon = defineAsyncComponent(
  () => import(`../assets/icons/arrow.svg`),
);
const SelectedItemIcon = defineAsyncComponent(
  () => import(`../assets/icons/selected-item.svg`),
);
const carouselRef = ref<HTMLDivElement>();
const imageRef = ref<HTMLDivElement[]>();
const turnOffBtns = ref<boolean>(false);

watch(
  () => props.data,
  () => {
    setTimeout(() => {
      recalcLeft();
    });
  },
);

onMounted(() => {
  window.addEventListener('resize', recalcLeft);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', recalcLeft);
});

const getImageLink = (image: Image) => {
  const splited = image.download_url.split('/');
  return `${splited[0]}//${splited[2]}/${splited[3]}/${splited[4]}/${Math.round(
    image.width / 3,
  )}/${Math.round(image.height / 3)}`;
};

const recalcLeft = () => {
  const carousel = carouselRef.value;
  const images = imageRef.value;
  carousel!.style.left = `-${images![0].clientWidth + 20}px`;
};

const onBtnClick = (isLeftDirection: boolean) => {
  turnOffBtns.value = true;
  const carousel = carouselRef.value;
  const images = imageRef.value;
  carousel!.style.transform = `translateX(${isLeftDirection ? '' : '-'}${
    images![0].clientWidth + 20
  }px)`;
  setTimeout(() => {
    const el = isLeftDirection ? props.data.pop() : props.data.shift();
    isLeftDirection ? props.data.unshift(el!) : props.data.push(el!);
    carousel!.style.transition = 'none';
    carousel!.style.transform = `translateX(0)`;
    turnOffBtns.value = false;
  }, 700);
  carousel!.style.transition =
    'transform 0.7s cubic-bezier(0.645, 0.045, 0.355, 1)';
};

const checkIfItemIsSelected = (id: string) =>
  props.selectedImages.findIndex(el => el.id === id) !== -1;
</script>

<style scoped lang="scss">
.images-carousel {
  display: flex;
  overflow: hidden;
  &-wrapper {
    position: relative;
    width: calc(100% - 40px);
    margin-top: 20px;
    height: 250px;
  }
  &-container {
    display: flex;
    gap: 20px;
    transition: transform 0.7s cubic-bezier(0.645, 0.045, 0.355, 1);
    position: relative;
  }
  &-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 50%;
    top: 50%;
    margin-top: -26px;
    border: none;
    height: 52px;
    width: 52px;
    padding: 0;
    color: #ffffff;
    cursor: pointer;
    transition: background-color 0.1s linear;
    z-index: 3;
    &:hover {
      background-color: rgba(0, 0, 0, 0.5);
    }
    &:active {
      background-color: rgba(0, 0, 0, 0.6);
    }
    &-left {
      left: 20px;
      &-icon {
        padding-right: 2px;
      }
    }
    &-right {
      right: 20px;
      &-icon {
        transform: rotate(180deg);
        padding-right: 2px;
      }
    }
  }
  &-item {
    width: 100%;
    height: 100%;
    object-fit: cover;
    &-wrapper {
      display: flex;
      min-width: calc(33vw - 22.5px);
      height: 250px;
      position: relative;
      cursor: pointer;
    }
    &-selected {
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.3);
      position: absolute;
      &-icon {
        position: absolute;
        bottom: 10px;
        right: 10px;
        z-index: 5;
        border-radius: 50%;
      }
    }
  }
}
@media screen and (min-width: 1440px) {
  .images-carousel {
    &-item {
      &-wrapper {
        min-width: calc(25vw - 25px);
      }
    }
  }
}
@media screen and (max-width: 1024px) {
  .images-carousel {
    &-item {
      &-wrapper {
        min-width: calc(50vw - 29px);
      }
    }
  }
}
@media screen and (max-width: 660px) {
  .images-carousel {
    &-item {
      &-wrapper {
        min-width: calc(100vw - 39px);
      }
    }
  }
}
@media screen and (max-width: 425px) {
  .images-carousel {
    &-wrapper {
      height: 200px;
    }
    &-btn {
      margin-top: -21px;
      height: 42px;
      width: 42px;
      &-left {
        &-icon {
          scale: 0.85;
        }
      }
      &-right {
        &-icon {
          scale: 0.85;
        }
      }
    }
  }
  .images-carousel {
    &-item {
      &-wrapper {
        height: 200px;
      }
    }
  }
}
@media screen and (max-width: 375px) {
  .images-carousel {
    &-wrapper {
      height: 170px;
    }
  }
  .images-carousel {
    &-item {
      &-wrapper {
        height: 170px;
      }
    }
  }
}
</style>
