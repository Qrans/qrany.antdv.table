import { Alert, Checkbox, Col, Icon, Popover, Row, Space, Tooltip } from "ant-design-vue";
import Vue from "vue";
import "ant-design-vue/es/alert/style/css";
import "ant-design-vue/es/checkbox/style/css";
import "ant-design-vue/es/grid/style/css";
import "ant-design-vue/es/icon/style/css";
import "ant-design-vue/es/popover/style/css";
import "ant-design-vue/es/space/style/css";
import "ant-design-vue/es/tooltip/style/css";

export const QTips = Vue.extend({
  name: "QranyTips",

  props: {
    settings: { type: Array, required: true },
    auto: { type: Boolean, default: false },
    select: { type: Boolean, default: false },
    count: { type: Number, default: 0 },
    options: { type: Array, required: true },
  },

  data: () => ({
    autoSelect: false,
    values: [],
  }),

  watch: {
    select(v) {
      if (v !== this.autoSelect) this.autoSelect = v;
    },
    options: {
      handler(v) {
        if (v.join(",") === this.values.join(",")) return;
        this.values = [...v];
      },
      immediate: true,
      deep: true,
    },
  },

  methods: {
    onAutoSelect(e) {
      this.autoSelect = e.target.checked;
      this.$emit("update:select", e.target.checked);
    },
    onReload() {
      this.$emit("reload");
    },
    onAllChange(e) {
      if (!e.target.checked) this.values = [];
      else this.values = this.settings.map((x) => x[0]);
      this.$emit("update:options", this.values);
    },
    onChange(v) {
      const now = [];
      for (const [k] of this.settings) {
        if (v.indexOf(k) > -1) now.push(k);
      }
      this.values = now;
      this.$emit("update:options", now);
    },

    select$(h) {
      const s = [h("span", "已选择"), h("a", { attrs: { href: "javascript:;" } }, `${this.count}`), h("span", "项"), h("a", { attrs: { href: "javascript:;" } }, "清空")];
      if (this.auto) s.unshift(h(Checkbox, { props: { checked: this.autoSelect }, on: { change: this.onAutoSelect } }, "跨页全选"));
      return s;
    },

    title$(h) {
      const indeterminate = this.values.length > 0 && this.values.length < this.settings.length;
      return h(Row, { props: { type: "flex", justify: "space-between" } }, [
        h(Col, [h(Checkbox, { props: { indeterminate, checked: this.values.length > 0 }, on: { change: this.onAllChange } }, "列展示")]),
        h(Col, [h("a", { attrs: { href: "javascript:;" } }, `重置`)]),
      ]);
    },
    popover$(h) {
      const title = () => this.title$(h);
      title.proxy = true;
      return h(
        Popover,
        {
          props: { placement: "bottomRight", trigger: "click" },
          scopedSlots: {
            title,
            content: () => this.content$(h),
          },
        },
        [h(Tooltip, { props: { title: "列设置" } }, [h(Icon, { props: { type: "setting" } })])]
      );
    },
    content$(h) {
      return h(
        Checkbox.Group,
        { props: { value: this.values }, on: { change: this.onChange } },
        this.settings.map((x) => {
          return h("div", { key: x[0] }, [h(Checkbox, { props: { value: x[0] } }, x[1])]);
        })
      );
    },
    message$(h) {
      return h(Row, { props: { type: "flex", justify: "space-between" } }, [
        h(Col, [h(Space, this.select$(h))]),
        h(Col, [h(Space, [h(Tooltip, { props: { title: "刷新" } }, [h(Icon, { props: { type: "reload" }, on: { click: this.onReload } })]), this.popover$(h)])]),
      ]);
    },
  },

  render(h) {
    return h(Alert, { style: { marginBottom: "24px" }, props: { type: "info" }, scopedSlots: { message: () => this.message$(h) } });
  },
});
