<template>
  <div class="sportmap-wrapper">
    <NuxtPage/>
  </div>
</template>


<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
*{
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body{
  font-family: "Inter", sans-serif;
  font-weight: 400;

}
:root {
    --bg: #0B0F1A;
    /* dark surface */
    --glass: rgba(255, 255, 255, 0.55);
    /* glass panels */
    --stroke: rgba(255, 255, 255, .08);
    --text: #ffffff;
    --muted: #A2B5D9;

    --primary: #ffffff;
    /* saber blue */
    --primary-2: #ffffff;
    /* neon cyan */
    --accent: #7CFFCB;
    /* mint accent */

    --ring: rgba(255, 255, 255, 0.35);
    --shadow: 0 10px 30px rgba(0, 0, 0, 0);
}

.sportmap-wrapper{
  width: 100%;
  height: 100vh;
  position: relative;
}
</style>