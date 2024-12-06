<script>
import { Table } from "ant-design-vue";
import "ant-design-vue/es/table/style/css";
import { TABLE_DATA, TABLE_PROPS } from "./context";

export default {
  name: "BaseTable",

  components: { Table },

  inject: {
    $$props: { from: TABLE_PROPS },
    $$data: { from: TABLE_DATA },
  },

  methods: {},

  beforeCreate() {
    this.pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total) => `共 ${total} 条`,
      pageSizeOptions: ["10", "20", "30", "40", "50", "100", "200"],
    };
  },
};
</script>

<template>
  <Table></Table>
</template>
