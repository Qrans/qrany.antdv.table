<script>
import { Col } from "ant-design-vue";
import "ant-design-vue/es/grid/style/css";

export default {
  name: "BaseFormItem",

  components: { Col },

  props: {
    span: { type: Number, default: 4 },
  },

  computed: {},
};
</script>

<template>
  <Col></Col>
</template>
