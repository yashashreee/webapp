const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs/database');

const TrackEmail = sequelize.define('TrackEmail', {
  uuid: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false
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
