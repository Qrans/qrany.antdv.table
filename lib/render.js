import { Divider, Dropdown, Icon, Menu, Tooltip } from "ant-design-vue";
import "ant-design-vue/es/tooltip/style/css";
import "ant-design-vue/es/divider/style/css";
import "ant-design-vue/es/dropdown/style/css";
import "ant-design-vue/es/menu/style/css";
import Vue from "vue";
import { parseImages } from "./utils";
import style from "./render.module.css";

export const QAction = Vue.extend({
  name: "QranyAction",

  methods: {
    dropdown$(h, rest) {
      const item = rest.map((x) => h(Menu.Item, [x]));
      return h(Dropdown, { scopedSlots: { overlay: () => h(Menu, item) } }, [h("a", { attrs: { href: "javascript:;" } }, ["更多 ", h(Icon, { props: { type: "down" } })])]);
    },
  },

  render(h) {
    const s = this.$slots.default;
    if (s.length < 1) return;
    if (s.length < 2) return s[0];
    const d = h(Divider, { props: { type: "vertical" } });
    if (s.length < 3) return h("div", [s[0], d, s[1]]);
    const [s0, ...rest] = s;
    return h("div", [s0, d, this.dropdown$(h, rest)]);
  },
});

export const QImage = Vue.extend({
  name: "TableImage",

  props: {
    value: { type: [String, Array], required: true },
  },

  computed: {
    image() {
      return parseImages(this.value)[0];
    },
  },

  render(h) {
    return h("div", { class: style["value-image"] }, [
      h(Tooltip, { props: { title: this.image.name } }, [
        h("a", { class: style["value-image-link"], attrs: { href: this.image.url, target: "_blank" } }, [
          h("img", { class: style["value-image-img"], attrs: { title: this.image.name, src: this.image.url } }),
        ]),
      ]),
    ]);
  },
});

export const QImages = Vue.extend({
  name: "QranyImages",

  props: {
    value: { type: [String, Array], required: true },
  },

  computed: {
    images() {
      return parseImages(this.value);
    },
  },

  render(h) {
    return h(
      "div",
      { class: style["value-image"] },
      this.images.map((x) =>
        h(Tooltip, { props: { title: x.name } }, [
          h("a", { class: style["value-image-link"], attrs: { href: x.url, target: "_blank" } }, [
            h("img", { class: style["value-image-img"], attrs: { title: x.name, src: x.url } }),
          ]),
        ])
      )
    );
  },
});

export const QEllipsis = Vue.extend({
  name: "QranyEllipsis",
  props: {
    value: { type: String, default: "" },
    ellipsis: { type: Number, default: 2 },
  },
  render(h) {
    return h(Tooltip, { props: { title: this.value } }, [
      h("div", { class: style["ellipsis"], style: { "-webkit-line-clamp": this.ellipsis, "line-clamp": this.ellipsis } }, [this.value]),
    ]);
  },
});
