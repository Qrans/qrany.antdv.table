<template>
  <Card>
    <QTable :table="table" :columns="columns" :request="request" auto-select-all>
      <template #action>
        <Button type="primary">按钮 1</Button>
        <Button>按钮 2</Button>
      </template>

      <template #layout="{ Component, vnodes }">
        <Tabs :active-key="+table.form.select.join(',')" @change="onChange">
          <TabPane :key="0" tab="ling" />
          <TabPane :key="1" tab="yi" />
        </Tabs>

        <component :is="Component" :vnodes="vnodes" />
      </template>

      <template #body="{ column }">
        <template v-if="column.key === 'action'">
          <QAction>
            <a>0</a>
            <a>1</a>
            <a>2</a>
          </QAction>
        </template>
      </template>
    </QTable>
  </Card>
</template>

<script>
import { Button, Card, Tabs } from "ant-design-vue";
import "ant-design-vue/es/button/style/index";
import "ant-design-vue/es/card/style/index";
// import "ant-design-vue/es/grid/style/index";
import { createTable, QAction, QTable } from "/lib";

export default {
  name: "App",
  components: {
    Button,
    // Col,
    Card,
    QAction,
    QTable,
    // Row,
    Tabs,
    TabPane: Tabs.TabPane,
  },

  computed: {
    columns() {
      return [
        { key: "text", title: "Text", width: 180, tip: "默认提示", ellipsis: 2, formType: "input", query: { default: "123" } },
        {
          key: "input",
          title: "Input",
          width: 180,
          tip: "默认提示",
          ellipsis: 2,
          formType: "select-input",
          props: {
            options: [
              { value: 0, label: "ling" },
              { value: 1, label: "yi" },
            ],
          },
        },
        { key: "number", title: "Number", sorter: true, formType: "range-number" },
        {
          key: "select",
          title: "Select",
          formType: "select",
          props: { mode: "multiple", showSearch: true },
          query: { request: this.createDict(Array.from({ length: 320 }, (_, i) => [i, `ling ${i}`])), default: [0] },
        },
        { key: "cascader", title: "Cascader", formType: "cascader", query: { request: this.createDict([[0, "ling"]]) } },
        { key: "tree", title: "Tree", formType: "tree", query: { request: this.createDict([[0, "ling"]]) } },
        { key: "image", title: "Image", formType: "image" },
        { key: "images", title: "Images", formType: "images" },
        { key: "date", title: "Date", formType: "range-picker" },
        { key: "action", title: "Action", formType: "action", width: 100, fixed: "right" },
      ];
    },
  },

  methods: {
    createDict: (dict) => () => new Promise((resolve) => setTimeout(() => resolve(dict.map((x) => ({ value: x[0], label: x[1] }))), 1000)),
    async request(q, f, s) {
      console.log(q, f, s);
      const n = (q.current - 1) * q.pageSize;
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        data: Array.from({ length: 10 }, (_, i) => ({
          id: n + i,
          text: `Text ${i} 啊介绍了肯德基阿拉山口到家啦可是建档立卡解放了卡就是六块腹肌阿拉山口大家阿莱克斯金德拉克绝世独立看见阿福`,
          input: `Input ${i} 啊介绍了肯德基阿拉山口到家啦可是建档立卡解放了卡就是六块腹肌阿拉山口大家阿莱克斯金德拉克绝世独立看见阿福`,
          number: Math.random() * 1e9,
          select: i % 2,
          cascader: 0,
          tree: 0,
          image: "https://ae01.alicdn.com/kf/HTB1F.bVaXY7gK0jSZKzq6yikpXan.jpg",
          images: "https://ae01.alicdn.com/kf/HTB1F.bVaXY7gK0jSZKzq6yikpXan.jpg,https://ae01.alicdn.com/kf/HTB1F.bVaXY7gK0jSZKzq6yikpXan.jpg",
          date: new Date().toLocaleString(),
        })),
        total: 20,
      };
    },

    onChange(v = "") {
      this.table.form.select = [v];
      this.table.query(1);
    },
  },

  created() {
    this.table = createTable();
  },
};
</script>

<style>
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  background-color: #f0f0f0;
  padding: 32px;
}
</style>
