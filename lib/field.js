import { Cascader, Col, DatePicker, Input, InputNumber, Row, Select, TreeSelect } from "ant-design-vue";
import "ant-design-vue/es/cascader/style/css";
import "ant-design-vue/es/input/style/css";
import "ant-design-vue/es/input-number/style/css";
import "ant-design-vue/es/date-picker/style/css";
import "ant-design-vue/es/select/style/css";
import "ant-design-vue/es/tree-select/style/css";
import Vue from "vue";
import { isNull } from "./utils";

const SelectInput = Vue.extend({
  name: "SelectInput",

  props: {
    options: { type: Array, required: true },
    value: { type: Array, default: () => [] },
  },

  data: () => ({
    data: [],
  }),

  watch: {
    value: {
      handler(v) {
        if (!isNull(v[0]) && this.data[0] !== v[0]) this.$set(this.data, 0, v[0]);
        if (this.data[1] !== (v[1] || "")) this.$set(this.data, 1, v[1] || "");
      },
      immediate: true,
    },
    options: {
      handler(v) {
        if (v[0]) this.data = [v[0].value, ""];
      },
      immediate: true,
    },
  },

  methods: {
    onUpdate() {
      this.$emit("update:value", this.data[1] ? [...this.data] : undefined);
    },
    onSelect(v) {
      this.data = [v, this.data[1]];
      this.onUpdate();
    },
    onInput(e) {
      this.data = [this.data[0], e.target.value];
      this.onUpdate();
    },
  },

  render(h) {
    return h(Row, { props: { type: "flex" } }, [
      h(Col, { props: { span: 8 } }, [
        h(Select, { style: { width: "100%" }, props: { options: this.options, value: this.data[0], placeholder: "请选择" }, on: { change: this.onSelect } }),
      ]),
      h(Col, { props: { span: 16 } }, [h(Input, { props: { value: this.data[1], placeholder: "请输入", allowClear: true }, on: { change: this.onInput } })]),
    ]);
  },
});

export const RangeNumber = Vue.extend({
  name: "RangeNumber",

  props: {
    value: { type: Array, default: () => [] },
  },

  data: () => ({
    data: [],
  }),

  watch: {
    value: {
      handler(v) {
        if (this.data[0] !== v[0]) this.$set(this.data, 0, v[0]);
        if (this.data[1] !== v[1]) this.$set(this.data, 1, v[1]);
      },
      immediate: true,
    },
  },

  methods: {
    onUpdate() {
      this.$emit("update:value", [...this.data].filter((x) => !isNull(x)).sort());
    },
    onChange1(v) {
      this.$set(this.data, 0, v);
    },
    onChange2(v) {
      this.$set(this.data, 1, v);
    },
  },

  render(h) {
    return h(Row, { props: { type: "flex", gutter: 8 } }, [
      h(Col, { props: { span: 12 } }, [
        h(InputNumber, { style: { width: "100%" }, props: { value: this.data[0], placeholder: "请输入" }, on: { change: this.onChange1, blur: this.onUpdate } }),
      ]),
      h(Col, { props: { span: 12 } }, [
        h(InputNumber, { style: { width: "100%" }, props: { value: this.data[1], placeholder: "请输入" }, on: { change: this.onChange2, blur: this.onUpdate } }),
      ]),
    ]);
  },
});

export const QField = Vue.extend({
  name: "QranyField",

  props: {
    name: { type: String, required: true },
    type: { type: String, default: "input" },
    options: { type: Array, default: () => [] },
    props: { type: Object, default: () => ({}) },
    value: { type: [String, Number, Array], default: () => undefined },
  },

  data: () => ({
    data: undefined,
    search: undefined,
  }),

  watch: {
    value: {
      handler(v) {
        if (JSON.stringify(this.data) === JSON.stringify(v)) return;
        if (Array.isArray(v)) this.data = [...v];
        else if (v !== null && typeof v === "object") this.data = { ...v };
        else this.data = v;
      },
      immediate: true,
    },
    options: {
      handler() {
        if (this.props.showSearch) this.onSearch();
      },
      immediate: true,
    },
  },

  methods: {
    onSearch(v = "") {
      const [keys, now] = [[], []];
      if (!Array.isArray(this.data)) {
        if (this.data) keys.push(this.data);
      } else keys.push(...this.data);
      const o = this.options || [];
      const r = new RegExp(v.replace(/ /g, ""));
      for (const x of o) {
        if (keys.indexOf(x.value) >= 0) now.push({ ...x });
        if (now.length >= 30) break;
      }
      if (now.length < 30)
        for (const x of o) {
          if (keys.indexOf(x.value) < 0 && r.test(x.label)) now.push({ ...x });
          if (now.length >= 30) break;
        }
      this.search = now;
    },
    onChange(v) {
      this.data = v;
      if (this.props.showSearch) this.onSearch();
      this.$emit("update:value", { [this.name]: v });
    },
    onChangeValue(e) {
      this.onChange(e.target.value);
    },
  },

  render(h) {
    if (this.type === "number") return h(InputNumber, { style: { width: "100%" }, props: { value: this.data, placeholder: "请输入" }, on: { change: this.onChange } });
    if (this.type === "select")
      return h(Select, {
        props: {
          options: this.search || this.options,
          value: this.data,
          placeholder: "请选择",
          allowClear: true,
          mode: this.props.mode,
          showSearch: this.props.showSearch,
          optionFilterProp: "children",
        },
        on: { change: this.onChange, search: this.onSearch },
      });
    if (this.type === "cascader") return h(Cascader, { props: { options: this.search || this.options, value: this.data, placeholder: "请选择" }, on: { change: this.onChange } });
    if (this.type === "tree") return h(TreeSelect, { props: { treeData: this.search || this.options, value: this.data, placeholder: "请选择" }, on: { change: this.onChange } });
    if (this.type === "select-input") return h(SelectInput, { props: { options: this.options, value: this.data, placeholder: "请选择" }, on: { "update:value": this.onChange } });
    if (this.type === "range-number") return h(RangeNumber, { props: { value: this.data }, on: { "update:value": this.onChange } });
    if (this.type === "month-picker")
      return h(DatePicker.MonthPicker, { staticStyle: { width: "100%" }, props: { value: this.data, valueFormat: "YYYY-MM" }, on: { change: this.onChange } });
    if (this.type === "range-picker")
      return h(DatePicker.RangePicker, {
        style: { width: "100%" },
        props: { value: this.data, showTime: true, valueFormat: "YYYY-MM-DD HH:mm:ss" },
        on: { change: this.onChange },
      });
    return h(Input, { props: { value: this.data, placeholder: "请输入", allowClear: true }, on: { change: this.onChangeValue } });
  },
});
