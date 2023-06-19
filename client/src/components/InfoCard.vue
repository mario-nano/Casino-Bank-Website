<template>
  <div class="mb-4 card">
    <div class="p-3 card-body">
      <div class="d-flex" :class="directionReverse ? reverseDirection : ''">
        <div>
          <div class="info-card-icon-bg text-center shadow icon icon-shape bg-success p-2">
            <font-awesome-icon class="ms-1 me-2 info-card-icon" :icon="icon.src" />
          </div>
        </div>
        <div :class="classContent">
          <div class='text-start'>
            <p class="mb-0 text-sm text-capitalize fw-bold"
              :class="title.color"
            >
              {{ typeof title === "string" ? title : title.text }}
            </p>
            <h5 class="text-lg-start fs-3 mb-0 fw-bolder" :class="value.color">
              {{
                typeof value === "string" || typeof value === "number"
                  ? value
                  : value.text
              }}
            </h5>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoCard',
  props: {
    directionReverse: {
      type: Boolean,
      default: false
    },
    title: {
      type: [Object, String],
      default: null,
      text: {
        type: String
      },
      color: {
        type: String
      }
    },
    value: {
      type: [Object, String, Number],
      required: true,
      text: {
        type: [String, Number]
      },
      color: {
        type: String
      }
    },
    icon: {
      type: [Object],
      src: {
        type: Object
      }
    },
    classContent: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      reverseDirection: 'flex-row-reverse justify-content-between'
    }
  }
}
</script>
