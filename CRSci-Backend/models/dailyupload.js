'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DailyUpload extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DailyUpload.belongsTo(models.Standard, { foreignKey: 'standardId', as: 'standard' });
      DailyUpload.belongsTo(models.Resource, { foreignKey: 'resourceId', as: 'resource' });
      DailyUpload.hasMany(models.TopicDailyUpload, { foreignKey: 'dailyUploadId'});
    }
  }
  DailyUpload.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    topicName:{
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue:[],
      allowNull: false,
    },
    standardId: {
      type: DataTypes.UUID,
      defaultValue:'',
      allowNull: false,
    },
    resourceId: {
      type: DataTypes.UUID,
      defaultValue:'',
      allowNull: false,
    },
    accessDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    weightage: {
      type: DataTypes.INTEGER,
      defaultValue:0,
      allowNull: false,
    },
    accessibleDay: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    dayName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    }
  }, {
    sequelize,
    modelName: 'DailyUpload',
  });
  return DailyUpload;
};