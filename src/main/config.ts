import Store from "electron-store";

export type StoreType = {
  lastWindowState: {
    width: number;
    height: number;
  };
};

const store = new Store<StoreType>({
  migrations: {
    "0.1.1": (store) => {
      store.set("lastWindowState.width", 900);
      store.set("lastWindowState.height", 670);
    },
  },
  schema: {
    lastWindowState: {
      type: "object",
      properties: {
        width: {
          type: "number",
        },
        height: {
          type: "number",
        },
      },
    },
  },
});

export default store;
