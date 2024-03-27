const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs/database');

const TrackEmail = sequelize.define('TrackEmail', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  verification_token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sent_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
}, {
  timestamps: false,
});

module.exports = TrackEmail;
