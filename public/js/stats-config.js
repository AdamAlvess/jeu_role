const statsChances = {
  "Humain": {
    "Force": generateBalancedStat(),
    "Agilité": generateBalancedStat(),
    "Dextérité": generateBalancedStat(),
    "Perception": generateBalancedStat(),
    "Constitution": generateBalancedStat(),
    "Charisme": generateBalancedStat(),
    "Intelligence": generateBalancedStat(),
  },
  "Elfe": {
    "Force": generateStat([0.5, 0.5, 1, 1, 2, 3, 4, 6, 8, 10, 12, 12, 10, 8, 7, 5, 4, 3, 2, 0.5]),
    "Agilité": generateStat([0.5, 1, 1.5, 2, 3, 5, 7, 9, 10, 10, 10, 9, 8, 6, 5, 4, 3, 2, 1, 0.5]),
    "Dextérité": generateStat([0.5, 1, 1.5, 2, 3, 6, 8, 10, 10, 10, 10, 8, 6, 5, 4, 3, 2, 1.5, 1, 0.5]),
    "Perception": generateStat([1, 1.5, 2, 3, 4, 6, 8, 10, 10, 10, 10, 8, 6, 5, 4, 3, 2, 1.5, 1, 0.5]),
    "Constitution": generateStat([0.5, 0.5, 1, 1, 2, 3, 5, 8, 9, 10, 10, 10, 8, 7, 5, 4, 3, 1.5, 1, 0.5]),
    "Charisme": generateStat([0.5, 1, 2, 4, 6, 8, 10, 10, 10, 9, 8, 7, 6, 5, 3, 2, 1, 0.5, 0.5, 0.5]),
    "Intelligence": generateStat([0.5, 1, 2, 3, 5, 7, 9, 10, 10, 10, 10, 8, 6, 5, 3, 2, 1.5, 1, 0.5, 0.5]),
  },
  "Orque": {
    "Force": generateStat([0.5, 0.5, 1, 2, 4, 6, 10, 12, 12, 10, 8, 8, 6, 5, 4, 3, 2, 1.5, 1, 0.5]),
    "Agilité": generateStat([1, 2, 3, 4, 5, 7, 8, 9, 10, 10, 10, 8, 6, 5, 3, 2, 1, 0.5, 0.5, 0.5]),
    "Dextérité": generateStat([0.5, 1, 2, 4, 5, 6, 8, 9, 10, 10, 9, 7, 6, 5, 4, 3, 2, 1.5, 1, 0.5]),
    "Perception": generateStat([1, 2, 3, 5, 7, 9, 10, 10, 10, 8, 7, 5, 4, 3, 2, 1, 0.5, 0.5, 0.3, 0.2]),
    "Constitution": generateStat([0.5, 1, 2, 3, 5, 7, 9, 10, 10, 10, 9, 8, 6, 5, 4, 3, 2, 1.5, 1, 0.5]),
    "Charisme": generateStat([2, 2, 4, 6, 8, 10, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 0.5, 0.5, 0.5]),
    "Intelligence": generateStat([1, 2, 3, 4, 5, 7, 9, 10, 10, 10, 8, 6, 5, 3, 2, 1.5, 1, 0.5, 0.3, 0.2]),
  },
  "Nain": {
    "Force": generateStat([0.5, 0.5, 1, 2, 5, 20, 45, 20, 5, 1, 0.5, 0.3, 0.2, 0.1, 0.1, 0.05, 0.05, 0.03, 0.01, 0.01]),
    "Agilité": generateStat([1, 2, 3, 5, 8, 10, 10, 9, 8, 6, 5, 4, 3, 2, 1, 0.8, 0.5, 0.2, 0.1, 0.05]),
    "Dextérité": generateStat([2, 4, 6, 10, 12, 10, 8, 6, 5, 4, 3, 2, 1, 0.8, 0.5, 0.4, 0.3, 0.2, 0.1, 0.05]),
    "Perception": generateStat([3, 5, 7, 9, 10, 10, 9, 8, 7, 5, 4, 3, 2, 1, 0.8, 0.5, 0.3, 0.2, 0.1, 0.05]),
    "Constitution": generateStat([0.5, 0.5, 1, 2, 4, 8, 12, 14, 14, 12, 8, 6, 5, 4, 3, 2, 1, 0.8, 0.5, 0.2]),
    "Charisme": generateStat([1, 2, 4, 6, 8, 9, 9, 8, 7, 6, 5, 4, 3, 2, 1.5, 1, 0.8, 0.5, 0.3, 0.2]),
    "Intelligence": generateStat([1, 2, 4, 6, 9, 10, 10, 9, 8, 7, 6, 4, 3, 2, 1.5, 1, 0.8, 0.5, 0.2, 0.1]),
  },
  "Démon": {
    "Force": generateStat([0.5, 0.5, 1, 2, 3, 4, 6, 8, 10, 12, 12, 10, 8, 6, 4, 2, 1, 0.5, 0.3, 0.2]),
    "Agilité": generateStat([0.5, 1, 2, 4, 6, 9, 10, 10, 10, 8, 6, 5, 4, 3, 2, 1, 0.5, 0.3, 0.2, 0.1]),
    "Dextérité": generateStat([1, 2, 3, 5, 7, 10, 10, 9, 8, 7, 6, 5, 3, 2, 1.5, 1, 0.8, 0.5, 0.3, 0.2]),
    "Perception": generateStat([2, 3, 5, 7, 10, 10, 10, 9, 8, 7, 5, 4, 3, 2, 1, 0.8, 0.6, 0.3, 0.2, 0.1]),
    "Constitution": generateStat([0.5, 1, 2, 4, 7, 10, 10, 10, 9, 8, 7, 5, 4, 3, 2, 1.5, 1, 0.5, 0.3, 0.2]),
    "Charisme": generateStat([1, 2, 3, 6, 10, 10, 10, 9, 8, 6, 5, 4, 3, 2, 1, 0.8, 0.5, 0.3, 0.2, 0.1]),
    "Intelligence": generateStat([1, 2, 4, 6, 8, 10, 10, 10, 9, 7, 6, 4, 3, 2, 1.5, 1, 0.8, 0.5, 0.2, 0.1]),
  }
};

// Fonction utilitaire pour générer des stats équilibrées (ex: pour Humain)
function generateBalancedStat() {
  const base = Array.from({ length: 20 }, (_, i) => (i < 10 ? 4 : 1.5));
  return generateStat(base);
}

// Fonction principale pour convertir tableau brut en distribution
function generateStat(rawValues) {
  const total = rawValues.reduce((sum, val) => sum + val, 0);
  const percent = {};
  rawValues.forEach((val, i) => {
    percent[i + 1] = +(val * 100 / total).toFixed(2);
  });
  return percent;
}
export { statsChances };
