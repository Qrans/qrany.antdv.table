<script>
import { Card } from "ant-design-vue";
import "ant-design-vue/es/card/style/css";
import BTable from "./BTable.vue";
import { TABLE_DATA, TABLE_PROPS } from "./context";
import { createTable, getTableContext } from "./create";

export default {
  name: "QTable",

  components: {
    Card,
  },

  props: {
    table: { type: Object, default: void 0 },
    rowKey: { type: [Function, String], default: "id" },
    formSpan: { type: Number, default: 4 },
    params: { type: Object, default: () => ({}) },
    columns: { type: Array, required: true },
    request: { type: Function, required: true },
    select: { type: [String, Boolean], default: "checkbox" },
    selectProps: { type: Function, validater: (v) => !v || typeof v === "function" },
    page: { type: Boolean, default: true },
    init: { type: Boolean, default: true },
    autoSelectAll: { type: Boolean, default: false },
  },

  data: () => ({
    loading: false,

    data: [],

    dicts: {},
  }),

  computed: {
    BTable: () => BTable,
    ctx() {
      return getTableContext(this.table || createTable());
    },
  },

  methods: {},

  provide() {
    return {
      [TABLE_PROPS]: this.$props,
      [TABLE_DATA]: this.$data,
    };
  },
};
</script>

<template>
  <Card>
    <slot name="layout" :Component="BTable">
      <component :is="BTable" />
    </slot>
  </Card>
</template>
