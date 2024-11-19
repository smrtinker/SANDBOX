import * as astronomia from 'astronomia';

const { solar, moonposition, sidereal, coord } = astronomia;

const calculateJulianDate = (date) => {
  try {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;

    let jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    jd += (hour - 12) / 24 + minute / 1440 + second / 86400;

    return jd;
  } catch (error) {
    console.error('Error calculating Julian date:', error);
    throw new Error(`Failed to calculate Julian date: ${error.message}`);
  }
};

const calculateObliquityOfEcliptic = (T) => {
  const epsilon = 23.43929111 - (46.8150 + (0.00059 - 0.001813 * T) * T) * T / 3600.0;
  return epsilon * Math.PI / 180; // Convert to radians
};

export const calculateSunPosition = (date, latitude, longitude) => {
  try {
    const jd = calculateJulianDate(date);
    const T = (jd - 2451545.0) / 36525; // Julian centuries since J2000.0
    
    // Calculate apparent solar longitude
    const sunLon = solar.apparentLongitude(T);
    
    // Calculate obliquity of the ecliptic
    const epsilon = calculateObliquityOfEcliptic(T);

    // Convert ecliptic coordinates to equatorial coordinates
    const sunRA = Math.atan2(Math.cos(epsilon) * Math.sin(sunLon), Math.cos(sunLon));
    const sunDec = Math.asin(Math.sin(epsilon) * Math.sin(sunLon));

    // Calculate local sidereal time
    const lst = sidereal.apparent(T) - longitude;

    // Calculate hour angle
    const hourAngle = lst - sunRA;

    // Convert to horizontal coordinates
    const sinAlt = Math.sin(latitude) * Math.sin(sunDec) + 
                   Math.cos(latitude) * Math.cos(sunDec) * Math.cos(hourAngle);
    const altitude = Math.asin(sinAlt);
    
    const cosAz = (Math.sin(sunDec) - Math.sin(latitude) * Math.sin(altitude)) / 
                  (Math.cos(latitude) * Math.cos(altitude));
    const azimuth = Math.atan2(Math.sin(hourAngle), cosAz);

    return {
      azimuth: (azimuth * 180 / Math.PI + 360) % 360,
      altitude: altitude * 180 / Math.PI
    };
  } catch (error) {
    console.error('Error calculating sun position:', error);
    throw new Error(`Failed to calculate sun position: ${error.message}`);
  }
};

export const calculateZodiacSign = (date) => {
  try {
    const jd = calculateJulianDate(date);
    const T = (jd - 2451545.0) / 36525; // Julian centuries since J2000.0
    const sunLon = solar.apparentLongitude(T) * 180 / Math.PI;
    
    const zodiacSigns = [
      "Aries", "Taurus", "Gemini", "Cancer",
      "Leo", "Virgo", "Libra", "Scorpio",
      "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ];
    
    const signIndex = Math.floor(sunLon / 30) % 12;
    return zodiacSigns[signIndex];
  } catch (error) {
    console.error('Error calculating zodiac sign:', error);
    throw new Error(`Failed to calculate zodiac sign: ${error.message}`);
  }
};

export const calculateMoonSign = (date) => {
  try {
    const jd = calculateJulianDate(date);
    const T = (jd - 2451545.0) / 36525; // Julian centuries since J2000.0
    const moonPos = moonposition.position(T);
    const moonLon = (moonPos.lon * 180 / Math.PI) % 360;
    
    const zodiacSigns = [
      "Aries", "Taurus", "Gemini", "Cancer",
      "Leo", "Virgo", "Libra", "Scorpio",
      "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ];
    
    const signIndex = Math.floor(moonLon / 30);
    return zodiacSigns[signIndex];
  } catch (error) {
    console.error('Error calculating moon sign:', error);
    throw new Error(`Failed to calculate moon sign: ${error.message}`);
  }
};

export const calculateAscendant = (date, latitude, longitude) => {
  try {
    const jd = calculateJulianDate(date);
    const T = (jd - 2451545.0) / 36525; // Julian centuries since J2000.0
    const lst = sidereal.apparent(T) - longitude;
    
    // Calculate obliquity of the ecliptic
    const epsilon = calculateObliquityOfEcliptic(T);

    // Convert RAMC to ecliptic longitude
    const ascendantLon = Math.atan2(
      Math.cos(lst),
      -(Math.sin(lst) * Math.cos(epsilon) + Math.tan(latitude) * Math.sin(epsilon))
    );
    
    const ascLongitude = (ascendantLon * 180 / Math.PI + 360) % 360;
    
    const zodiacSigns = [
      "Aries", "Taurus", "Gemini", "Cancer",
      "Leo", "Virgo", "Libra", "Scorpio",
      "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ];
    
    const signIndex = Math.floor(ascLongitude / 30);
    return zodiacSigns[signIndex];
  } catch (error) {
    console.error('Error calculating ascendant:', error);
    throw new Error(`Failed to calculate ascendant: ${error.message}`);
  }
};