import { Col, ConfigProvider, Icon, Row, Space, Table, Tooltip } from "ant-design-vue";
import zh from "ant-design-vue/es/locale/zh_CN";
import "ant-design-vue/es/grid/style/css";
import "ant-design-vue/es/icon/style/css";
import "ant-design-vue/es/space/style/css";
import "ant-design-vue/es/table/style/css";
import "ant-design-vue/es/tooltip/style/css";
import Vue from "vue";

import { getTableContext, createTable } from "./create";
import { ctx_menu } from "./menu";
import { QQuery } from "./query";
import { QTips } from "./tips";
import { TableEllipsis, TableImage, TableImages } from "./render";
import { digit, is_null, omit, pick } from "./utils";
import style from "./table.module.css";

let pagination = {};

export const defaultPagination = () => {
  pagination = {
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条`,
  };
};

defaultPagination();

export const setPagination = (config) => {
  pagination = { ...pagination, ...config };
};

const ProTableLayout = Vue.extend({
  name: "TableLayout",

  props: {
    vnodes: { type: Array, required: true },
  },

  render(h) {
    return h("div", { class: "pro-table-layout" }, this.vnodes);
  },
});

export const QTable = Vue.extend({
  name: "QranyTable",

  props: {
    table: { type: Object, default: () => createTable() },
    rowKey: { type: [Function, String], default: "id" },
    formSpan: { type: Number, default: 4 },
    params: { type: Object, default: () => ({}) },
    columns: { type: Array, required: true },
    request: { type: Function, required: true },
    select: { type: String, default: "checkbox" },
    initial: { type: Boolean, default: true },
  },

  data: () => ({
    loading: false,

    settings: [],
    sorts: [],
    cols: {},
    data: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
    selectedRowKeys: [],

    options: {},
    enums: {},
  }),

  computed: {
    ctx() {
      return getTableContext(this.table);
    },
  },

  provide() {
    return {
      ctx: this.ctx,
    };
  },

  watch: {
    columns: {
      handler(now) {
        const [def, cols, sets, sorts] = [{}, {}, [], []];
        this.unwatchForm();
        for (const c of now) {
          const x = this.getCol(c);
          this.watchForm(c, x);
          this.setDicts(c, x);
          this.setDef(c, x, def);
          cols[x.key] = x;
          if (c.hideTable === true) continue;
          sets.push([x.key, x.title]);
          sorts.push(x.key);
        }
        this.ctx.config({ def });
        this.ctx.form();
        this.cols = cols;
        this.sorts = sorts;
        this.settings = sets;
      },
      immediate: true,
      deep: true,
    },
    params: {
      handler(params) {
        this.ctx.config({ params });
        this.ctx.form();
        if (this.initial !== false) this.query(1);
      },
      immediate: true,
      deep: true,
    },
    "table.selectedRowKeys": {
      handler(v) {
        if (v.length === this.selectedRowKeys.length) return;
        this.selectedRowKeys = [...v];
      },
      immediate: true,
    },
  },

  methods: {
    onSorts(v) {
      this.sorts = v;
    },
    getCol(c) {
      const x = pick(c, "key", "title", "tip", "width", "align", "fixed", "ellipsis", "sorter", "filter", "render");
      x.type = c.formType;
      return x;
    },
    getDicts(options = []) {
      const res = { enum: {}, options: [] };
      for (const x of options) {
        res.enum[x.value] = x.label;
        const o = { ...x, title: x.label };
        res.options.push(o);
        if (!x.children) continue;
        const r = this.getDicts(x.children);
        res.enum = { ...res.enum, ...r.enum };
        o.children = r.options;
      }
      return res;
    },
    async setDicts(c, x) {
      if (!(c.props && c.props.options) && !(c.query && c.query.request)) return;
      const before = this.getDicts(c.props && c.props.options);
      this.$set(this.enums, c.key, before.enum);
      this.$set(this.options, c.key, before.options);
      if (!(c.query && c.query.request)) return;
      const d = await c.query.request(this.table.form);
      const after = this.getDicts(d);
      this.$set(this.enums, c.key, after.enum);
      this.$set(this.options, c.key, after.options);
      if (x && c.filters) x.filters = this.options[c.key];
    },
    unwatchForm() {
      if (!this["watch:form"]) return;
      for (const f of this["watch:form"]) f();
      delete this["watch:form"];
    },
    watchForm(c) {
      if (!(c.query && c.query.dependencies && c.query.request)) return;
      this["watch:form"] = this["watch:form"] || [];
      for (const w of c.query.dependencies) {
        const watch = () => {
          this.ctx.form({ [c.key]: void 0 });
          this.setDicts(c);
        };
        const un = this.$watch(`table.form.${w}`, watch);
        this["watch:form"].push(un);
      }
    },
    setDef(c, x, def) {
      if (is_null(c.query && c.query.default)) return;
      x.filterDefault = def[x.key] = c.query.default;
    },
    onClearSelect() {
      this.ctx.select([], []);
    },
    onSelection(keys, rows) {
      const map = typeof this.rowKey === "function" ? this.rowKey : (x) => x[this.rowKey];
      const old_rows = this.table.selections;
      const old_keys = old_rows.map(map);
      const out_rows = rows.filter((x) => !old_keys.includes(map(x)));
      const new_rows = [...old_rows, ...out_rows].filter((x) => keys.indexOf(map(x)) >= 0);
      this.selectedRowKeys = [...keys];
      this.ctx.select(keys, new_rows);
    },
    diffSelect(rows) {
      if (!this.table.selections.length) return;
      const map = typeof this.rowKey === "function" ? this.rowKey : (x) => x[this.rowKey];
      const old_json = this.table.selections.reduce((c, x) => ({ ...c, [map(x)]: JSON.stringify(x) }), {});
      const new_json = rows.reduce((c, x) => ({ ...c, [map(x)]: JSON.stringify(x) }), {});
      const new_rows = [];
      for (const x of this.table.selections) {
        const k = map(x);
        if (!new_json[k]) new_rows.push(x);
        else if (old_json[k] !== new_json[k]) new_rows.push(JSON.parse(new_json[k]));
      }
      this.ctx.select(this.selectedRowKeys, new_rows);
    },
    async onChange(p, f, s) {
      const pag = this.pagination;
      if (pag.current !== p.current) pag.current = p.current;
      if (pag.pageSize !== p.pageSize) pag.pageSize = p.pageSize;
      this.filter = { ...f };
      this.sorter = { field: s.field, order: s.order };
      const { data } = await this.query();
      this.diffSelect(data);
    },
    parseForm(form = {}) {
      const now = { ...this.table.form, ...form };
      for (const c of this.columns) {
        if (is_null(now[c.key])) continue;
        if (!(c.query && c.query.transform)) continue;
        Object.assign(now, c.query.transform(now[c.key]));
      }
      const p = this.pagination;
      now.current = p.current;
      now.pageSize = p.pageSize;
      return now;
    },

    onRow() {
      return { on: { contextmenu: ctx_menu } };
    },

    action$(h) {
      const action = this.$scopedSlots.action && this.$scopedSlots.action();
      return action && h("div", { class: ["action", style["action"]] }, [h(Space, [action])]);
    },

    tabs$() {
      return this.$scopedSlots.tabs && this.$scopedSlots.tabs();
    },

    tips$(h) {
      return h(QTips, {
        props: { settings: this.settings, select: this.selectedRowKeys.length, options: this.sorts },
        on: { "update:options": this.onSorts, reload: this.reload, empty: this.onClearSelect },
      });
    },

    column$(h, x) {
      const title = () => {
        if (!x.tip) return x.title;
        return h(Row, { props: { type: "flex", gutter: 8 } }, [
          h(Col, [x.title]),
          h(Col, [h(Tooltip, { props: { title: x.tip } }, [h(Icon, { props: { type: "question-circle" } })])]),
        ]);
      };
      const child = (v, r, i) => {
        if (typeof x.render === "function") return x.render({ value: v, record: r, index: i });
        const body = this.$scopedSlots.body && this.$scopedSlots.body({ value: v, column: x, record: r, index: i });
        if (body) return body || v;
        if (x.type === "image") return h(TableImage, { props: { value: v } });
        if (x.type === "images") return h(TableImages, { props: { value: v } });
        if (/number/.test(x.type)) return digit(v);
        if (!is_null(x.ellipsis)) return h(TableEllipsis, { props: { value: v, ellipsis: x.ellipsis } });
        if (this.enums[x.key]) return this.enums[x.key][v] || v;
        return v;
      };
      return h(Table.Column, { key: x.key, props: { dataIndex: x.key, ...omit(x, "title", "tip", "ellipsis", "render") }, scopedSlots: { title, default: child } });
    },

    table$(h) {
      const table = [
        this.tips$(h),
        h(
          Table,
          {
            props: {
              rowKey: this.rowKey,
              dataSource: this.data,
              loading: this.loading,
              pagination: { ...pagination, ...this.pagination },
              rowSelection: { type: this.select, fixed: true, selectedRowKeys: this.selectedRowKeys, onChange: this.onSelection },
              scroll: { x: true },
              customRow: this.onRow,
            },
            on: { change: this.onChange },
          },
          this.sorts.map((k) => this.column$(h, this.cols[k]))
        ),
      ];
      if (!this.$scopedSlots.layout) return table;
      return [this.$scopedSlots.layout({ Component: ProTableLayout, vnodes: table })];
    },

    async query(page = this.pagination.current, form = {}) {
      try {
        if (!this.request) return;
        this.loading = true;
        if (page !== this.pagination.current) this.pagination.current = page;
        const promise = this.request(this.parseForm(form), this.filter, this.sorter);
        this.data = (await promise).data;
        this.pagination.total = (await promise).total;
        return await promise;
      } finally {
        await this.$nextTick();
        this.loading = false;
      }
    },
    async reload() {
      this.ctx.form(void 0, "set");
      this.ctx.select([], []);
      return await this.query(1);
    },
  },
  beforeCreate() {
    this.filter = {};
    this.sorter = {};
  },
  created() {
    this.ctx.config({
      query: this.query,
      reload: this.reload,
    });
  },

  render(h) {
    return h(ConfigProvider, { props: { locale: zh } }, [
      h("div", { class: ["pro-table", style["pro-table"]] }, [
        h(QQuery, {
          props: { loading: this.loading, columns: this.columns, form: this.table.form, dicts: this.options, max: this.formSpan },
          on: { query: this.query, reset: this.reload },
        }),
        this.action$(h),
        ...this.table$(h),
      ]),
    ]);
  },
});
