<script>
import { Button, Col, FormModel, Icon, Row } from "ant-design-vue";
import "ant-design-vue/es/button/style/css";
import "ant-design-vue/es/grid/style/css";
import "ant-design-vue/es/form-model/style/css";
import "ant-design-vue/es/icon/style/css";
import _QFormItem from "./BFormItem.vue";

export default {
  name: "BaseForm",

  components: {
    Button,
    Col,
    FormItem: _QFormItem,
    FormModel,
    Icon,
    Row,
  },

  props: {
    params: { type: Object, default: () => ({}) },
    loading: { type: Boolean, default: false },
    dicts: { type: Object, default: () => ({}) },
    span: { type: Number, default: 4 },
    fields: { type: Array, default: () => [] },
  },

  data: () => ({
    collapsed: false,

    form: {},
  }),

  computed: {
    layout: () => ({
      label: { span: 5 },
      wrapper: { span: 19 },
    }),
    min() {
      return Math.max(this.span - 1, 1);
    },
    end() {
      return ((this.fields.length % 4) / this.span) * 24;
    },
  },

  methods: {
    onChange(name, value) {
      if (name in this.params) return;
      this.$set(this.form, name, value);
    },
  },
};
</script>

<template>
  <FormModel :model="form" :label-col="layout.label" :wrapper-col="layout.wrapper">
    <Row type="flex">
      <FormItem v-for="(x, i) in fields" :key="x.key" :field="x.key" :index="i" :span="span" :dict="dicts[x.key]" @change="onChange" />

      <Col>
        <Row type="flex" justify="end" :gutter="8">
          <Col><Button type="primary">查询</Button></Col>
          <Col><Button>重置</Button></Col>
          <Col>
            <Button v-if="collapsed" key="up" type="link">收起 <Icon type="up" /></Button>
            <Button v-else key="down" type="link">展开 <Icon type="down" /></Button>
          </Col>
        </Row>
      </Col>
    </Row>
  </FormModel>
</template>
