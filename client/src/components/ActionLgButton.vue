<template>
  <div class='d-flex align-items-center action-button action-button-container'>
    <div @click='$router.push(link.to)' class='d-flex justify-content-center w-100'>
      <div>
        <div><font-awesome-icon class="action-button-icon" :icon="icon.src" /></div>
        <div>
          <span class='action-button-text'>
            {{ typeof title === "string" ? title : title.text }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActionLgButton',
  props: {
    icon: {
      type: [Object],
      src: {
        type: Object
      }
    },
    title: {
      type: [Object, String],
      text: {
        type: [String]
      },
      default: 'Button title'
    },
    link: {
      type: [Object],
      to: {
        type: [String]
      }
    }
  }
}
</script>
