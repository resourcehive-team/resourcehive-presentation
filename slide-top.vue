<template>
  <footer v-if="$page > 1" class="deck-footer" aria-hidden="true">
    <span>ResourceHive</span>
    <span>{{ $page }} / {{ $nav.total }}</span>
  </footer>
</template>
