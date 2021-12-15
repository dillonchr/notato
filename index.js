const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "/Users/dillon/git/DATAS/notato.sqlite"
});

class Note extends Model {}
Note.init(
  {
    label: DataTypes.STRING,
    note: DataTypes.BLOB,
    user_id: DataTypes.STRING
  },
  { sequelize, modelName: "note" }
);

(async () => {
  await sequelize.sync();
  try {
    const note = await Note.create({
      label: "tv",
      note: "sup with that?",
      user_id: "me"
    });
    console.log({ note });
  } catch (err) {
    console.log({ err });
  }
})();
