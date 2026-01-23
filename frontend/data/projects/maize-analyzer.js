// ========================================
// data/projects/maize-analyzer.js
// ========================================
export default {
  id: 'maize-analyzer',
  title: 'Maize Dectection and Maturity classification',
  category: 'Computer Vision / Robotics',
  shortDescription: 'Maize detection and ripeness classification system using YOLO11 and MobileNetV3.',
  fullDescription:
    'An end-to-end pipeline designed for automated harvesting. This system detects maize cobs in real-time and classifies their maturity level to optimize harvest yield.',
  image: 'assets/images/tony_champ_mais.jpg',
  isHero: true,
  challenges: [
    'Robust outdoor dectection',
    'Real-time processing on edge devices',
    'Handling occlusion in dense crop environments',
  ],
  features: [
    'YOLO11 Detection Core',
    'MobileNetV3 Maturity Classification (Ripe/Unripe)',
    'FastAPI Backend',
  ],
};
