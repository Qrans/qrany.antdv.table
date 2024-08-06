import { Button, Col, FormModel, Icon, Row } from "ant-design-vue";
import "ant-design-vue/es/button/style/css";
import "ant-design-vue/es/form-model/style/css";
import "ant-design-vue/es/icon/style/css";
import Vue from "vue";

import { QField } from "./field";
import { pick } from "./utils";

const hasQuery = /input|number|select(-input)?|range(-picker|-number)/;

export const QQuery = Vue.extend({
  name: "QranyQuery",

  inject: {
    ctx: {},
  },

  props: {
    loading: { type: Boolean, default: false },
    columns: { type: Array, required: true },
    form: { type: Object, required: true },
    dicts: { type: Object, default: () => ({}) },
    max: { type: Number, default: 4 },
  },

  data: () => ({
    collapse: false,
    cols: [],
  }),

  watch: {
    columns: {
      handler(now) {
        const cols = [];
        for (const c of now) {
          if (!hasQuery.test(c.formType) || c.hideQuery === true) continue;
          const x = pick(c, "key", "query", "props");
          x.type = c.formType;
          x.name = c.title;
          cols.push(x);
        }
        this.cols = cols;
      },
      immediate: true,
      deep: true,
    },
  },

  methods: {
    parseSpan(collapse, i) {
      return {
        span: collapse || i <= 0 ? 24 : 0,
        xs: collapse || i <= 0 ? 24 : 0,
        sm: collapse || i < Math.max(this.max - 4, 1) ? Math.floor(24 / Math.max(this.max - 3, 1)) : 0,
        md: collapse || i < Math.max(this.max - 3, 1) ? Math.floor(24 / Math.max(this.max - 2, 1)) : 0,
        lg: collapse || i < Math.max(this.max - 2, 1) ? Math.floor(24 / Math.max(this.max - 1, 1)) : 0,
        xl: collapse || i < Math.max(this.max - 1, 1) ? Math.floor(24 / Math.max(this.max, 1)) : 0,
        xxl: collapse || i < Math.max(this.max, 1) ? Math.floor(24 / Math.max(this.max, 1)) : 0,
      };
    },
    collapseSpan() {
      const l = this.cols.length;
      return {
        sm: l >= Math.max(this.max - 3, 0) ? void 0 : 0,
        md: l >= Math.max(this.max - 2, 0) ? void 0 : 0,
        lg: l >= Math.max(this.max - 1, 0) ? void 0 : 0,
        xl: l >= Math.max(this.max, 0) ? void 0 : 0,
      };
    },
    itemProps(type, label) {
      if (type !== "select-input") return { label };
      return { labelCol: { span: 0 }, wrapperCol: { span: 24 } };
    },

    onChange(v) {
      this.ctx.form(v);
    },

    onSearch() {
      this.$emit("query");
    },
    onReset() {
      this.$emit("reset");
    },
    onTigger() {
      this.collapse = !this.collapse;
    },
  },

  render(h) {
    if (this.cols.length === 0) return;
    return h(FormModel, { props: { labelCol: { span: 8 }, wrapperCol: { span: 16 }, model: this.form } }, [
      h(Row, { props: { type: "flex", gutter: 16 } }, [
        ...this.cols.map((c, i) =>
          h(Col, { key: c.key, props: { ...this.parseSpan(this.collapse, i) } }, [
            h(FormModel.Item, { props: this.itemProps(c.type, c.name) }, [
              h(QField, { props: { props: c.props, type: c.type, name: c.key, value: this.form[c.key], options: this.dicts[c.key] }, on: { "update:value": this.onChange } }),
            ]),
          ])
        ),
        h(Col, { key: "actions", props: { flex: 1, ...this.parseSpan(this.collapse, 0) } }, [
          h(FormModel.Item, { props: { wrapperCol: { span: 24 } } }, [
            h(Row, { props: { type: "flex", gutter: 8, justify: "end" } }, [
              h(Col, [h(Button, { props: { type: "primary", loading: this.loading }, on: { click: this.onSearch } }, "查询")]),
              h(Col, [h(Button, { on: { click: this.onReset } }, "重置")]),
              h(Col, { props: { ...this.collapseSpan() } }, [
                h(Button, { props: { type: "link", icon: "" }, on: { click: this.onTigger } }, [
                  this.collapse ? "收起" : "展开",
                  h(Icon, { props: { type: this.collapse ? "up" : "down" } }),
                ]),
              ]),
            ]),
          ]),
        ]),
      ]),
    ]);
  },
});
