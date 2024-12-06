const CTX = new WeakMap();

export const createTable = () => {
  const e = {
    emit(name, ...args) {
      if (e[`on:${name}`]) return e[`on:${name}`](...args);
    },

    on(name, fn) {
      e[`on:${name}`] = fn;
    },
  };

  const table = Object.freeze({
    auto: () => e.emit("auto"),
    memo: () => e.emit("memo"),
    selected: () => e.emit("selected"),
    query: (page, form) => e.emit("query", page, form),
    reload: () => e.emit("reload"),
  });

  const ctx = Object.freeze({
    auto: (fn) => e.on("auto", fn),
    memo: (fn) => e.on("memo", fn),
    selected: (fn) => e.on("selected", fn),
    query: (fn) => e.on("query", fn),
    reload: (fn) => e.on("reload", fn),
  });

  CTX.set(table, ctx);

  return table;
};

export const getTableContext = (table) => CTX.get(table);
