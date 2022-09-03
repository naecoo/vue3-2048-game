<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { LOCALE } from '@src/i18n';

const { locale } = useI18n();

const switchLocale = (value: LOCALE) => {
  locale.value = value;
  document.documentElement.setAttribute('lang', value);
}
</script>

<template>
  <!-- todo: -->
</template>
