<template>
  <div
    id="app"
    class="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 text-gray-800 font-sans"
  >
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

html,
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
  scroll-behavior: smooth;
  background-color: #f9fafb;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
