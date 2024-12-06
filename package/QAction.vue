<script>
import { Divider, Dropdown, Icon, Menu, Space } from "ant-design-vue";
import "ant-design-vue/es/divider/style/css";
import "ant-design-vue/es/dropdown/style/css";
import "ant-design-vue/es/icon/style/css";
import "ant-design-vue/es/menu/style/css";
import "ant-design-vue/es/space/style/css";
import BAction from "./BAction.vue";

export default {
  name: "QAction",

  components: { BAction, Divider, Dropdown, Icon, Menu, MenuItem: Menu.Item, Space },

  computed: {
    _items() {
      return this.$slots.default.filter((n) => !n.isComment);
    },
    _menus() {
      return this._items.slice(1);
    },
  },
};
</script>

<template>
  <Space>
    <template v-if="_items.length > 2">
      <BAction :v="_items[0]" />
      <Divider type="vertical" />
      <Dropdown>
        <template #overlay>
          <Menu>
            <MenuItem v-for="x in _menus" :key="x.key">
              <BAction :v="x" />
            </MenuItem>
          </Menu>
        </template>
        <a href="javascript:;">更多 <Icon type="down" /></a>
      </Dropdown>
    </template>
    <template v-else-if="_items.length > 1">
      <BAction :v="_items[0]" />
      <Divider type="vertical" />
      <BAction :v="_items[1]" />
    </template>
    <template v-else-if="_items.length > 0">
      <BAction :v="_items[0]" />
    </template>
  </Space>
</template>
