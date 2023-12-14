'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DummyClass extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DummyClass.belongsTo(models.DummyCourse, { foreignKey: 'course_id' });
    }
  }
  DummyClass.init({
    name: DataTypes.STRING,
    course_id: DataTypes.STRING,
    isActive: DataTypes.INTEGER,
    isGlobal: DataTypes.INTEGER,
    isNarEnabled: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DummyClass',
    tableName: 'dummy_classes',
  });
  return DummyClass;
};