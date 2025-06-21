import { PersonalColorAnalysis } from '../App';

interface ColorFeatures {
  undertone: 'warm' | 'cool';
  skinTone: 'light' | 'medium' | 'dark';
  eyeColor: 'light' | 'dark';
  hairColor: 'light' | 'dark';
  chroma: 'clear' | 'muted';
}

interface SeasonData {
  name: string;
  undertone: 'warm' | 'cool';
  value: 'light' | 'medium' | 'deep';
  chroma: 'clear' | 'muted' | 'bright';
  description: string;
  bestColors: string[];
  avoidColors: string[];
  emoji: string;
}

const SEASON_DATA: Record<string, SeasonData> = {
  'Light Spring': {
    name: 'Light Spring',
    undertone: 'warm',
    value: 'light',
    chroma: 'clear',
    description: 'Fresh, delicate, and warm with light features. Your colors should be warm, light, and clear! 🌸',
    bestColors: ['#FFB6C1', '#98FB98', '#F0E68C', '#FFE4B5', '#DDA0DD', '#87CEEB'],
    avoidColors: ['#000000', '#8B0000', '#800080', '#006400'],
    emoji: '🌸'
  },
  'Warm Spring': {
    name: 'Warm Spring',
    undertone: 'warm',
    value: 'medium',
    chroma: 'clear',
    description: 'Vibrant and warm with golden undertones. You shine in warm, medium-intensity colors! ☀️',
    bestColors: ['#FF6347', '#FFD700', '#32CD32', '#FF7F50', '#DA70D6', '#40E0D0'],
    avoidColors: ['#000000', '#4B0082', '#708090', '#2F4F4F'],
    emoji: '☀️'
  },
  'Bright Spring': {
    name: 'Bright Spring',
    undertone: 'warm',
    value: 'medium',
    chroma: 'bright',
    description: 'High contrast and vibrant! You look amazing in bright, warm, saturated colors! 🔥',
    bestColors: ['#FF4500', '#FFD700', '#00FF7F', '#FF1493', '#00CED1', '#FF69B4'],
    avoidColors: ['#696969', '#A0522D', '#556B2F', '#8B4513'],
    emoji: '🔥'
  },
  'Soft Autumn': {
    name: 'Soft Autumn',
    undertone: 'warm',
    value: 'medium',
    chroma: 'muted',
    description: 'Gentle and earthy with muted warm tones. Your colors are soft, warm, and sophisticated! 🍂',
    bestColors: ['#D2691E', '#CD853F', '#BC8F8F', '#F4A460', '#DEB887', '#D2B48C'],
    avoidColors: ['#FF0000', '#00FF00', '#0000FF', '#FF1493'],
    emoji: '🍂'
  },
  'Warm Autumn': {
    name: 'Warm Autumn',
    undertone: 'warm',
    value: 'deep',
    chroma: 'muted',
    description: 'Rich and earthy with deep warm tones. Perfect for rich, warm, golden colors! 🧡',
    bestColors: ['#B22222', '#FF8C00', '#DAA520', '#8B4513', '#A0522D', '#CD853F'],
    avoidColors: ['#4169E1', '#9370DB', '#FF1493', '#00CED1'],
    emoji: '🧡'
  },
  'Deep Autumn': {
    name: 'Deep Autumn',
    undertone: 'warm',
    value: 'deep',
    chroma: 'clear',
    description: 'Bold and dramatic with deep, rich features. You command attention in deep, warm colors! 💫',
    bestColors: ['#8B0000', '#FF4500', '#B8860B', '#8B4513', '#800000', '#2F4F4F'],
    avoidColors: ['#FFB6C1', '#E6E6FA', '#F0F8FF', '#FFFACD'],
    emoji: '💫'
  },
  'Light Summer': {
    name: 'Light Summer',
    undertone: 'cool',
    value: 'light',
    chroma: 'muted',
    description: 'Soft and delicate with cool undertones. Your colors are light, cool, and gentle! 💙',
    bestColors: ['#B0C4DE', '#DDA0DD', '#F0E68C', '#E0E0E0', '#D8BFD8', '#F5F5DC'],
    avoidColors: ['#FF4500', '#FF0000', '#FFD700', '#32CD32'],
    emoji: '💙'
  },
  'Soft Summer': {
    name: 'Soft Summer',
    undertone: 'cool',
    value: 'medium',
    chroma: 'muted',
    description: 'Gentle and refined with muted cool tones. Perfect for soft, dusty, sophisticated colors! 🌙',
    bestColors: ['#708090', '#9370DB', '#BC8F8F', '#D2B48C', '#C0C0C0', '#DDA0DD'],
    avoidColors: ['#FF4500', '#FFFF00', '#00FF00', '#FF1493'],
    emoji: '🌙'
  },
  'Cool Summer': {
    name: 'Cool Summer',
    undertone: 'cool',
    value: 'medium',
    chroma: 'clear',
    description: 'Fresh and elegant with clear cool tones. You look stunning in cool, medium-intensity colors! 💎',
    bestColors: ['#4169E1', '#9370DB', '#FF69B4', '#00CED1', '#7B68EE', '#DDA0DD'],
    avoidColors: ['#FF4500', '#FFD700', '#8B4513', '#A0522D'],
    emoji: '💎'
  },
  'Deep Winter': {
    name: 'Deep Winter',
    undertone: 'cool',
    value: 'deep',
    chroma: 'clear',
    description: 'Dramatic and striking with deep, cool features. You shine in deep, rich, cool colors! ❄️',
    bestColors: ['#000080', '#8B0000', '#4B0082', '#2F4F4F', '#800080', '#191970'],
    avoidColors: ['#FFB6C1', '#F0E68C', '#98FB98', '#FFE4B5'],
    emoji: '❄️'
  },
  'Cool Winter': {
    name: 'Cool Winter',
    undertone: 'cool',
    value: 'deep',
    chroma: 'clear',
    description: 'Classic and sophisticated with cool depth. Perfect for true, deep, cool colors! 🖤',
    bestColors: ['#000000', '#FFFFFF', '#FF0000', '#0000FF', '#FF1493', '#00CED1'],
    avoidColors: ['#FFD700', '#FF8C00', '#8B4513', '#D2691E'],
    emoji: '🖤'
  },
  'Bright Winter': {
    name: 'Bright Winter',
    undertone: 'cool',
    value: 'medium',
    chroma: 'bright',
    description: 'High contrast and vibrant with cool undertones. You look amazing in bright, cool, saturated colors! ✨',
    bestColors: ['#FF1493', '#00CED1', '#7B68EE', '#00FF7F', '#FF69B4', '#4169E1'],
    avoidColors: ['#8B4513', '#D2691E', '#CD853F', '#A0522D'],
    emoji: '✨'
  }
};

export function analyzePersonalColor(imageData: ImageData): PersonalColorAnalysis {
  console.log('Starting personal color analysis...');
  console.log('Image dimensions:', imageData.width, 'x', imageData.height);
  
  const features = extractColorFeatures(imageData);
  const season = determineSeason(features);
  const seasonData = SEASON_DATA[season];
  
  console.log('Final season determined:', season);

  return {
    season: seasonData.name,
    undertone: seasonData.undertone,
    value: seasonData.value,
    chroma: seasonData.chroma,
    skinTone: features.skinTone,
    description: seasonData.description,
    bestColors: seasonData.bestColors,
    avoidColors: seasonData.avoidColors
  };
}

function extractColorFeatures(imageData: ImageData): ColorFeatures {
  const pixels = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  // Analyze different regions of the image
  const skinRegion = analyzeSkinRegion(pixels, width, height);
  const eyeRegion = analyzeEyeRegion(pixels, width, height);
  const hairRegion = analyzeHairRegion(pixels, width, height);

  const undertone = determineUndertone(skinRegion);
  const skinTone = determineSkinTone(skinRegion);
  const eyeColor = determineEyeColor(eyeRegion);
  const hairColor = determineHairColor(hairRegion);
  const chroma = determineChroma(skinRegion, eyeRegion, hairRegion);

  return {
    undertone,
    skinTone,
    eyeColor,
    hairColor,
    chroma
  };
}

function analyzeSkinRegion(pixels: Uint8ClampedArray, width: number, height: number) {
  const colors: number[][] = [];
  
  // Sample multiple regions for better skin detection
  const regions = [
    { x: 0.3, y: 0.3, size: 0.2 }, // Upper left face
    { x: 0.7, y: 0.3, size: 0.2 }, // Upper right face  
    { x: 0.5, y: 0.5, size: 0.3 }, // Center face
    { x: 0.5, y: 0.7, size: 0.2 }, // Lower face
  ];

  regions.forEach(region => {
    const startX = Math.floor(width * region.x - (width * region.size) / 2);
    const endX = Math.floor(width * region.x + (width * region.size) / 2);
    const startY = Math.floor(height * region.y - (height * region.size) / 2);
    const endY = Math.floor(height * region.y + (height * region.size) / 2);

    for (let y = startY; y < endY; y += 3) {
      for (let x = startX; x < endX; x += 3) {
        if (y >= 0 && y < height && x >= 0 && x < width) {
          const index = (y * width + x) * 4;
          const r = pixels[index];
          const g = pixels[index + 1];
          const b = pixels[index + 2];
          const a = pixels[index + 3];
          
          if (a > 200 && isSkinColor(r, g, b)) {
            colors.push([r, g, b]);
          }
        }
      }
    }
  });

  console.log('Skin colors found:', colors.length);
  return colors.length > 20 ? colors : [[220, 180, 140], [200, 160, 120], [180, 140, 100]];
}

function analyzeEyeRegion(pixels: Uint8ClampedArray, width: number, height: number) {
  const colors: number[][] = [];
  
  // Sample eye regions (left and right)
  const eyeRegions = [
    { x: 0.35, y: 0.35, size: 0.08 }, // Left eye
    { x: 0.65, y: 0.35, size: 0.08 }, // Right eye
  ];

  eyeRegions.forEach(region => {
    const startX = Math.floor(width * region.x - (width * region.size) / 2);
    const endX = Math.floor(width * region.x + (width * region.size) / 2);
    const startY = Math.floor(height * region.y - (height * region.size) / 2);
    const endY = Math.floor(height * region.y + (height * region.size) / 2);

    for (let y = startY; y < endY; y += 2) {
      for (let x = startX; x < endX; x += 2) {
        if (y >= 0 && y < height && x >= 0 && x < width) {
          const index = (y * width + x) * 4;
          const r = pixels[index];
          const g = pixels[index + 1];
          const b = pixels[index + 2];
          const a = pixels[index + 3];
          
          if (a > 200) {
            colors.push([r, g, b]);
          }
        }
      }
    }
  });

  console.log('Eye colors found:', colors.length);
  return colors.length > 10 ? colors : [[80, 60, 40], [120, 100, 80]];
}

function analyzeHairRegion(pixels: Uint8ClampedArray, width: number, height: number) {
  const colors: number[][] = [];
  
  // Sample top and side regions for hair
  const hairRegions = [
    { x: 0.2, y: 0.15, size: 0.15 }, // Top left
    { x: 0.5, y: 0.1, size: 0.2 },  // Top center
    { x: 0.8, y: 0.15, size: 0.15 }, // Top right
    { x: 0.1, y: 0.4, size: 0.1 },  // Left side
    { x: 0.9, y: 0.4, size: 0.1 },  // Right side
  ];

  hairRegions.forEach(region => {
    const startX = Math.floor(width * region.x - (width * region.size) / 2);
    const endX = Math.floor(width * region.x + (width * region.size) / 2);
    const startY = Math.floor(height * region.y - (height * region.size) / 2);
    const endY = Math.floor(height * region.y + (height * region.size) / 2);

    for (let y = startY; y < endY; y += 3) {
      for (let x = startX; x < endX; x += 3) {
        if (y >= 0 && y < height && x >= 0 && x < width) {
          const index = (y * width + x) * 4;
          const r = pixels[index];
          const g = pixels[index + 1];
          const b = pixels[index + 2];
          const a = pixels[index + 3];
          
          if (a > 200) {
            colors.push([r, g, b]);
          }
        }
      }
    }
  });

  console.log('Hair colors found:', colors.length);
  return colors.length > 10 ? colors : [[60, 40, 20], [100, 80, 60]];
}

function isSkinColor(r: number, g: number, b: number): boolean {
  // Improved skin color detection with wider range
  const brightness = (r + g + b) / 3;
  
  // Basic skin tone range
  if (brightness < 50 || brightness > 250) return false;
  
  // Skin typically has red > green > blue, but allow variations
  const redDominance = r >= g * 0.8 && r >= b * 0.9;
  const yellowishness = (r + g) / 2 > b * 1.1;
  
  // Check for typical skin color ratios
  const isFleshTone = (
    (r > 80 && g > 50 && b > 30) && // Minimum values
    (r <= 255 && g <= 220 && b <= 200) && // Maximum values
    (redDominance || yellowishness) // Color characteristics
  );
  
  return isFleshTone;
}

function determineUndertone(skinColors: number[][]): 'warm' | 'cool' {
  if (skinColors.length === 0) return 'warm';

  let warmScore = 0;
  let coolScore = 0;
  let totalPixels = 0;

  skinColors.forEach(([r, g, b]) => {
    totalPixels++;
    
    // Calculate color temperature indicators
    const yellowness = (r + g) / 2 - b; // Higher = more yellow (warm)
    const pinkness = (r + b) / 2 - g;   // Higher = more pink (cool)
    const greenness = g - (r + b) / 2;  // Higher = more green (cool)
    
    // Warm undertone indicators
    if (yellowness > 10) warmScore += 2;
    if (r > g + 5 && g > b + 5) warmScore += 1; // Red > Green > Blue
    if ((r + g) > b * 2.2) warmScore += 1; // Golden ratio
    
    // Cool undertone indicators  
    if (pinkness > 10) coolScore += 2;
    if (greenness > 5) coolScore += 1;
    if (b > r * 0.8) coolScore += 1; // More blue
    if (r > 200 && g > 150 && b > 150) coolScore += 1; // Pink tones
  });

  // Normalize scores
  const warmRatio = warmScore / totalPixels;
  const coolRatio = coolScore / totalPixels;
  
  console.log(`Undertone analysis: Warm=${warmRatio.toFixed(2)}, Cool=${coolRatio.toFixed(2)}`);
  
  return warmRatio > coolRatio ? 'warm' : 'cool';
}

function determineSkinTone(skinColors: number[][]): 'light' | 'medium' | 'dark' {
  if (skinColors.length === 0) return 'medium';

  const avgBrightness = skinColors.reduce((sum, [r, g, b]) => {
    return sum + (r + g + b) / 3;
  }, 0) / skinColors.length;

  console.log(`Skin tone brightness: ${avgBrightness.toFixed(1)}`);

  if (avgBrightness > 190) return 'light';
  if (avgBrightness > 140) return 'medium';
  return 'dark';
}

function determineEyeColor(eyeColors: number[][]): 'light' | 'dark' {
  if (eyeColors.length === 0) return 'dark';

  // Sort colors by brightness and take darker ones (likely iris)
  const sortedColors = eyeColors.sort((a, b) => {
    const brightnessA = (a[0] + a[1] + a[2]) / 3;
    const brightnessB = (b[0] + b[1] + b[2]) / 3;
    return brightnessA - brightnessB;
  });
  
  // Take bottom 30% as likely eye color (avoiding white/bright areas)
  const eyeColorSample = sortedColors.slice(0, Math.floor(sortedColors.length * 0.3));
  
  const avgBrightness = eyeColorSample.reduce((sum, [r, g, b]) => {
    return sum + (r + g + b) / 3;
  }, 0) / eyeColorSample.length;

  console.log(`Eye color brightness: ${avgBrightness.toFixed(1)}`);
  
  return avgBrightness > 90 ? 'light' : 'dark';
}

function determineHairColor(hairColors: number[][]): 'light' | 'dark' {
  if (hairColors.length === 0) return 'dark';

  // Filter out very bright colors (likely background/skin)
  const filteredColors = hairColors.filter(([r, g, b]) => {
    const brightness = (r + g + b) / 3;
    return brightness < 200; // Remove very bright pixels
  });
  
  if (filteredColors.length === 0) return 'dark';

  const avgBrightness = filteredColors.reduce((sum, [r, g, b]) => {
    return sum + (r + g + b) / 3;
  }, 0) / filteredColors.length;

  console.log(`Hair color brightness: ${avgBrightness.toFixed(1)}`);
  
  return avgBrightness > 100 ? 'light' : 'dark';
}

function determineChroma(skinColors: number[][], eyeColors: number[][], hairColors: number[][]): 'clear' | 'muted' {
  if (skinColors.length === 0 || eyeColors.length === 0 || hairColors.length === 0) {
    return 'clear';
  }

  // Calculate average colors for each region
  const avgSkin = getAverageColor(skinColors);
  const avgEye = getAverageColor(eyeColors.slice(0, Math.floor(eyeColors.length * 0.3))); // Darker eye colors
  const avgHair = getAverageColor(hairColors.filter(([r, g, b]) => (r + g + b) / 3 < 200));

  // Calculate contrast between features
  const skinEyeContrast = getColorDistance(avgSkin, avgEye);
  const skinHairContrast = getColorDistance(avgSkin, avgHair);
  const eyeHairContrast = getColorDistance(avgEye, avgHair);
  
  const avgContrast = (skinEyeContrast + skinHairContrast + eyeHairContrast) / 3;
  
  // Calculate saturation
  const allColors = [avgSkin, avgEye, avgHair];
  const avgSaturation = allColors.reduce((sum, [r, g, b]) => {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max === 0 ? 0 : (max - min) / max;
    return sum + saturation;
  }, 0) / allColors.length;
  
  console.log(`Contrast: ${avgContrast.toFixed(1)}, Saturation: ${avgSaturation.toFixed(2)}`);
  
  // High contrast and saturation = clear, low = muted
  return (avgContrast > 80 || avgSaturation > 0.3) ? 'clear' : 'muted';
}

function getAverageColor(colors: number[][]): number[] {
  if (colors.length === 0) return [128, 128, 128];
  
  const sum = colors.reduce((acc, [r, g, b]) => {
    acc[0] += r;
    acc[1] += g;
    acc[2] += b;
    return acc;
  }, [0, 0, 0]);
  
  return [sum[0] / colors.length, sum[1] / colors.length, sum[2] / colors.length];
}

function getColorDistance(color1: number[], color2: number[]): number {
  return Math.sqrt(
    Math.pow(color1[0] - color2[0], 2) +
    Math.pow(color1[1] - color2[1], 2) +
    Math.pow(color1[2] - color2[2], 2)
  );
}

function determineSeason(features: ColorFeatures): string {
  const { undertone, skinTone, eyeColor, hairColor, chroma } = features;
  
  console.log('Features:', features);

  if (undertone === 'warm') {
    if (skinTone === 'light') {
      if (hairColor === 'light' && chroma === 'clear') return 'Light Spring';
      if (hairColor === 'light') return 'Warm Spring';
      if (chroma === 'clear') return 'Bright Spring';
      return 'Warm Spring';
    } else if (skinTone === 'medium') {
      if (chroma === 'clear' && (hairColor === 'dark' || eyeColor === 'dark')) return 'Bright Spring';
      if (chroma === 'clear') return 'Warm Spring';
      return 'Soft Autumn';
    } else { // dark skin
      if (chroma === 'clear') return 'Deep Autumn';
      return 'Warm Autumn';
    }
  } else { // cool undertone
    if (skinTone === 'light') {
      if (hairColor === 'light' && chroma === 'muted') return 'Light Summer';
      if (hairColor === 'light') return 'Soft Summer';
      if (chroma === 'clear') return 'Cool Summer';
      return 'Light Summer';
    } else if (skinTone === 'medium') {
      if (chroma === 'clear' && (hairColor === 'dark' || eyeColor === 'dark')) return 'Bright Winter';
      if (chroma === 'clear') return 'Cool Summer';
      return 'Soft Summer';
    } else { // dark skin
      if (chroma === 'clear') return 'Deep Winter';
      return 'Cool Winter';
    }
  }
}