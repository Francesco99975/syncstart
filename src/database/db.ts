import Dexie, { Table } from "dexie";

interface Settings {
  id?: number;
  background?: string;
  unit?: boolean;
  clockFormat: boolean;
}

//
// Declare Database
//
class SettingsDatabase extends Dexie {
  public settings!: Table<Settings, number>; // id is number in this case

  public constructor() {
    super("SettingsDatabase");
    this.version(1).stores({
      settings: "++id,background,unit,clockFormat",
    });
  }
}

const db = new SettingsDatabase();

db.transaction("rw", db.settings, async () => {
  if (!(await db.settings.get(1))) {
    return await db.settings.add({
      background: "",
      unit: true,
      clockFormat: true,
    });
  }
});

export default db;
