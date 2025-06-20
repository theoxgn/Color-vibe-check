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
  const features = extractColorFeatures(imageData);
  const season = determineSeason(features);
  const seasonData = SEASON_DATA[season];

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
  // Analyze center region of image (likely face area)
  const centerX = Math.floor(width / 2);
  const centerY = Math.floor(height / 2);
  const regionSize = Math.min(width, height) / 4;

  const colors: number[][] = [];

  for (let y = centerY - regionSize / 2; y < centerY + regionSize / 2; y += 2) {
    for (let x = centerX - regionSize / 2; x < centerX + regionSize / 2; x += 2) {
      if (y >= 0 && y < height && x >= 0 && x < width) {
        const index = (y * width + x) * 4;
        const r = pixels[index];
        const g = pixels[index + 1];
        const b = pixels[index + 2];
        
        // Filter for skin-like colors
        if (isSkinColor(r, g, b)) {
          colors.push([r, g, b]);
        }
      }
    }
  }

  return colors.length > 0 ? colors : [[200, 180, 160]]; // Default fallback
}

function analyzeEyeRegion(pixels: Uint8ClampedArray, width: number, height: number) {
  // Analyze upper center region (likely eye area)
  const centerX = Math.floor(width / 2);
  const eyeY = Math.floor(height * 0.4);
  const regionSize = Math.min(width, height) / 8;

  const colors: number[][] = [];

  for (let y = eyeY - regionSize / 2; y < eyeY + regionSize / 2; y++) {
    for (let x = centerX - regionSize; x < centerX + regionSize; x++) {
      if (y >= 0 && y < height && x >= 0 && x < width) {
        const index = (y * width + x) * 4;
        const r = pixels[index];
        const g = pixels[index + 1];
        const b = pixels[index + 2];
        colors.push([r, g, b]);
      }
    }
  }

  return colors.length > 0 ? colors : [[100, 80, 60]]; // Default fallback
}

function analyzeHairRegion(pixels: Uint8ClampedArray, width: number, height: number) {
  // Analyze top region (likely hair area)
  const regionHeight = Math.floor(height * 0.3);
  const colors: number[][] = [];

  for (let y = 0; y < regionHeight; y += 2) {
    for (let x = 0; x < width; x += 2) {
      const index = (y * width + x) * 4;
      const r = pixels[index];
      const g = pixels[index + 1];
      const b = pixels[index + 2];
      colors.push([r, g, b]);
    }
  }

  return colors.length > 0 ? colors : [[80, 60, 40]]; // Default fallback
}

function isSkinColor(r: number, g: number, b: number): boolean {
  // Basic skin color detection
  return (
    r > 95 && g > 40 && b > 20 &&
    r > g && r > b &&
    Math.abs(r - g) > 15 &&
    (r - g) > 15 &&
    (r - b) > 15
  );
}

function determineUndertone(skinColors: number[][]): 'warm' | 'cool' {
  if (skinColors.length === 0) return 'warm';

  let warmScore = 0;
  let coolScore = 0;

  skinColors.forEach(([r, g, b]) => {
    // Warm undertones tend to have more yellow/golden tones
    const yellowishness = (r + g) / 2 - b;
    const pinkishness = (r + b) / 2 - g;

    if (yellowishness > pinkishness) {
      warmScore++;
    } else {
      coolScore++;
    }

    // Additional warm indicators
    if (r > g && g > b) warmScore += 0.5;
    // Additional cool indicators  
    if (b > 100 || (r + b) / 2 > g) coolScore += 0.5;
  });

  return warmScore > coolScore ? 'warm' : 'cool';
}

function determineSkinTone(skinColors: number[][]): 'light' | 'medium' | 'dark' {
  if (skinColors.length === 0) return 'medium';

  const avgBrightness = skinColors.reduce((sum, [r, g, b]) => {
    return sum + (r + g + b) / 3;
  }, 0) / skinColors.length;

  if (avgBrightness > 180) return 'light';
  if (avgBrightness > 120) return 'medium';
  return 'dark';
}

function determineEyeColor(eyeColors: number[][]): 'light' | 'dark' {
  if (eyeColors.length === 0) return 'dark';

  const avgBrightness = eyeColors.reduce((sum, [r, g, b]) => {
    return sum + (r + g + b) / 3;
  }, 0) / eyeColors.length;

  return avgBrightness > 100 ? 'light' : 'dark';
}

function determineHairColor(hairColors: number[][]): 'light' | 'dark' {
  if (hairColors.length === 0) return 'dark';

  const avgBrightness = hairColors.reduce((sum, [r, g, b]) => {
    return sum + (r + g + b) / 3;
  }, 0) / hairColors.length;

  return avgBrightness > 80 ? 'light' : 'dark';
}

function determineChroma(skinColors: number[][], eyeColors: number[][], hairColors: number[][]): 'clear' | 'muted' {
  // Calculate overall contrast and saturation
  const allColors = [...skinColors, ...eyeColors, ...hairColors];
  
  if (allColors.length === 0) return 'clear';

  let totalContrast = 0;
  let contrastCount = 0;

  // Calculate contrast between different regions
  skinColors.forEach(skinColor => {
    eyeColors.forEach(eyeColor => {
      const contrast = Math.abs(
        (skinColor[0] + skinColor[1] + skinColor[2]) / 3 -
        (eyeColor[0] + eyeColor[1] + eyeColor[2]) / 3
      );
      totalContrast += contrast;
      contrastCount++;
    });
  });

  const avgContrast = contrastCount > 0 ? totalContrast / contrastCount : 50;

  return avgContrast > 60 ? 'clear' : 'muted';
}

function determineSeason(features: ColorFeatures): string {
  const { undertone, skinTone, eyeColor, hairColor, chroma } = features;

  if (undertone === 'warm') {
    if (skinTone === 'light' && hairColor === 'light') {
      if (chroma === 'clear') return 'Light Spring';
      else return 'Warm Spring';
    } else if (hairColor === 'dark' || eyeColor === 'dark') {
      if (chroma === 'clear') return 'Bright Spring';
      else return 'Warm Autumn';
    } else {
      return 'Soft Autumn';
    }
  }

  if (undertone === 'cool') {
    if (skinTone === 'light' && hairColor === 'light') {
      if (chroma === 'muted') return 'Soft Summer';
      else return 'Light Summer';
    } else if (hairColor === 'dark' || eyeColor === 'dark') {
      if (chroma === 'clear') return 'Bright Winter';
      else return 'Deep Winter';
    } else {
      return 'Soft Summer';
    }
  }

  return 'Soft Autumn'; // Default fallback
}