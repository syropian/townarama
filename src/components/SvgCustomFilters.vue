<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="0"
    height="0"
  >
    <defs>
      <filter id="duotone-valid">
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0
                  0 1 0 0 0
                  0 0 0 0 0
                  0 0 0 0.75 0"
        ></feColorMatrix>
      </filter>
    </defs>
  </svg>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="0"
    height="0"
  >
    <defs>
      <filter id="duotone-invalid">
        <feColorMatrix
          type="matrix"
          values="1 0 0 0 0
                  0 0 0 0 0
                  0 0 0 0 0
                  0 0 0 0.75 0"
        ></feColorMatrix>
      </filter>
    </defs>
  </svg>
</template>
