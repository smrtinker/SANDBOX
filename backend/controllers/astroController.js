import asyncHandler from 'express-async-handler';
import { 
  calculateSunPosition, 
  calculateZodiacSign, 
  calculateAscendant, 
  calculateMoonSign 
} from '../utils/astroCalculations.js';

// @desc    Get astrology data
// @route   POST /api/astro/data
// @access  Private
const getAstroData = asyncHandler(async (req, res) => {
  const { date, birthTime, birthPlace, latitude, longitude } = req.body;

  if (!date || !birthTime || !birthPlace || latitude === undefined || longitude === undefined) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  try {
    // Parse the date and time
    const [hours, minutes] = birthTime.split(':').map(Number);
    const birthDate = new Date(date);
    birthDate.setHours(hours, minutes, 0, 0);

    console.log('Parsed birth date:', birthDate);

    // Convert latitude and longitude to radians for calculations
    const latRad = parseFloat(latitude) * Math.PI / 180;
    const lonRad = parseFloat(longitude) * Math.PI / 180;

    console.log('Latitude (rad):', latRad, 'Longitude (rad):', lonRad);

    // Calculate all astrological data
    const sunPosition = calculateSunPosition(birthDate, latRad, lonRad);
    console.log('Sun position:', sunPosition);

    const zodiacSign = calculateZodiacSign(birthDate);
    console.log('Zodiac sign:', zodiacSign);

    const ascendant = calculateAscendant(birthDate, latRad, lonRad);
    console.log('Ascendant:', ascendant);

    const moonSign = calculateMoonSign(birthDate);
    console.log('Moon sign:', moonSign);

    res.json({
      sunPosition: {
        azimuth: Number(sunPosition.azimuth.toFixed(2)),
        altitude: Number(sunPosition.altitude.toFixed(2))
      },
      zodiacSign,
      ascendant,
      moonSign,
      birthPlace
    });
  } catch (error) {
    console.error('Astrology calculation error:', error);
    res.status(500);
    throw new Error(`Error calculating astrological data: ${error.message}`);
  }
});

export { getAstroData };