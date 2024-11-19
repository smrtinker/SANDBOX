// backend/models/AstroData.js
import mongoose from 'mongoose';

const astroDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  birthDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || (value && value instanceof Date && value < new Date());
      },
      message: 'Birth date must be in the past'
    }
  },
  birthTime: {
    type: String,
    validate: {
      validator: function(value) {
        return !value || /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
      },
      message: 'Birth time must be in HH:MM format'
    }
  },
  birthPlace: {
    type: String,
    trim: true,
    maxlength: [100, 'Birth place cannot exceed 100 characters']
  },
  zodiacSign: {
    type: String,
    enum: [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 
      'Leo', 'Virgo', 'Libra', 'Scorpio',
      'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ]
  },
  ascendant: {
    type: String,
    enum: [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 
      'Leo', 'Virgo', 'Libra', 'Scorpio',
      'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ]
  },
  moonSign: {
    type: String,
    enum: [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 
      'Leo', 'Virgo', 'Libra', 'Scorpio',
      'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ]
  },
  additionalInfo: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

const AstroData = mongoose.model('AstroData', astroDataSchema);

export default AstroData;