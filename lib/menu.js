import { Icon, Menu, message } from "ant-design-vue";
import "ant-design-vue/es/icon/style/index";
import "ant-design-vue/es/menu/style/index";
import "ant-design-vue/es/message/style/index";
import Vue from "vue";
import { copy, isNull } from "./utils";

const QMenu = Vue.extend({
  name: "QranyMenu",

  data: () => ({
    style: { display: "none" },
    content: {
      row: "",
      col: "",
      cells: [],
    },
  }),

  computed: {
    menu() {
      return [
        { key: "col", disabled: !this.content.col, title: "复制" },
        { key: "row", disabled: !this.content.row, title: "复制行" },
        { key: "cell", disabled: !this.content.cells.length, title: "复制列" },
        { key: "format", disabled: !this.content.cells.length, title: "换行复制列" },
      ];
    },
  },

  methods: {
    onClick({ key }) {
      if (key === "col") copy(this.content.col.replace(/^[\t\r\n ]+|[\t\r\n ]+$/, ""));
      else if (key === "row") copy(this.content.row.replace(/[\t\r\n ]+/g, " ").replace(/^ | $/, ""));
      else if (key === "cell") copy(this.content.cells.join(" "));
      else if (key === "format") copy(this.content.cells.join("\t\r\n"));
      message.success("复制成功");
    },

    bind() {
      this.style = { display: "none" };
      removeEventListener("click", this.bind);
    },
    open(position, content) {
      addEventListener("click", this.bind);
      this.content = content;
      this.style = { ...position, position: "absolute", zIndex: 9999, display: "block" };
    },

    item$(h, x) {
      return h(Menu.Item, { key: x.key, props: { disabled: x.disabled } }, [h(Icon, { props: { type: "copy" } }), x.title]);
    },
    menu$(h) {
      return this.menu.map((x) => this.item$(h, x));
    },
  },

  render(h) {
    return h("div", { class: "pro-menu", style: this.style }, [
      h(Menu, { props: { prefixCls: "ant-dropdown-menu", mode: "vertical", selectable: false }, on: { click: this.onClick } }, this.menu$(h)),
    ]);
  },
});

const getDom = (dom, tag) => {
  if (dom.tagName === tag) return dom;
  if (dom.parentElement) return getDom(dom.parentElement, tag);
  return null;
};

export const ctxMenu = (() => {
  let instance = null;
  return (ev) => {
    ev.preventDefault();
    if (!instance) {
      instance = new QMenu();
      instance.$mount(document.createElement("div"));
      document.body.appendChild(instance.$el);
    }
    const pos = { left: `${ev.pageX}px`, top: `${ev.pageY}px` };
    const td = getDom(ev.target, "TD");
    const tr = td.parentElement;
    const rows = [...tr.parentElement.rows];
    const i = [...tr.cells].indexOf(td);
    const content = {
      col: td.innerText,
      row: tr.innerText,
      cells: rows.map((x) => x.cells.item(i).innerText.replace(/^[\t\r\n ]+|[\t\r\n ]+$/, "")).filter((x) => !isNull(x) && x !== ""),
    };
    instance.open(pos, content);
  };
})();
