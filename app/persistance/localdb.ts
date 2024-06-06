import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

export default class LocalDB {
  static async connect() {
    return SQLite.openDatabase({name: 'inventario'});
  }

  static async init() {
    const db = await LocalDB.connect();
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS productos (
          id            INTEGER       PRIMARY KEY   AUTOINCREMENT,
          nombre        VARCHAR(64)   NOT NULL,
          precio        DECIMAL(10,2) NOT NULL      DEFAULT '0.0',
          minStock      INTEGER       NOT NULL      DEFAULT 0,
          currentStock  INTEGER       NOT NULL      DEFAULT 0,
          maxStock      INTEGER       NOT NULL      DEFAULT 0
        );`,
        [],
        () => {
          console.log('Tabla productos creada exitosamente');
        },
        error => {
          console.error('Error al crear la tabla productos:', error);
        },
      );
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS movimientos (
          id_movimiento INTEGER     PRIMARY KEY   AUTOINCREMENT,
          id_producto   INTEGER     NOT NULL,
          fecha_hora    DATETIME    NOT NULL,
          cantidad      INTEGER     NOT NULL
        );`,
        [],
        () => {
          console.log('Tabla movimientos creada exitosamente');
        },
        error => {
          console.error('Error al crear la tabla movimientos:', error);
        },
      );
    });
  }
}
