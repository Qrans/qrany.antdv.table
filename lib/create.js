import Vue from "vue";

const PROVIDER = new Map();

export const createTable = () => {
  const opt = {};

  const e = {
    emit(name, ...args) {
      if (opt[name]) return opt[name](...args);
      return new Promise((resolve) => {
        if (!e[name]) e[name] = [];
        e[name].push([resolve, args]);
      });
    },
  };

  const table = Vue.observable({
    form: {},

    selectedRowKeys: [],
    selections: [],

    query: (form) => e.emit("query", form),
    reload: () => e.emit("reload"),
  });

  PROVIDER.set(table, {
    config(config) {
      for (const [k, v] of Object.entries(config)) {
        if (typeof v === "object") opt[k] = { ...v };
        if (typeof v === "function") opt[k] = v;
        if (typeof v !== "function" || !e[k]) continue;
        for (const [r, a] of e[k]) (async () => r(await v(...a)))();
        delete e[k];
      }
    },
    form(form, type = "add") {
      let now = { ...opt.def, ...form, ...opt.params };
      if (type === "set" && JSON.stringify(table.form) !== JSON.stringify(now)) return (table.form = now);
      now = { ...opt.def, ...table.form, ...form, ...opt.params };
      if (type === "add" && JSON.stringify(table.form) !== JSON.stringify(now)) return (table.form = now);
    },
    select(keys, rows) {
      table.selectedRowKeys = keys;
      table.selections = rows;
    },
  });

  return table;
};

export const getTableContext = (table) => PROVIDER.get(table);
