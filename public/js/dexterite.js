import { statsChances } from './stats-config.js';

function getRandomStatValue(race, stat) {
  const chances = statsChances[race]?.[stat];
  if (!chances) {
    console.error(`Aucune table de probabilité trouvée pour ${race} / ${stat}`);
    return null;
  }

  const weighted = [];
  Object.entries(chances).forEach(([value, percentage]) => {
    const count = Math.round(percentage * 10);
    for (let i = 0; i < count; i++) {
      weighted.push(Number(value));
    }
  });

  const index = Math.floor(Math.random() * weighted.length);
  return weighted[index];
}

export function buildDexteriteRouletteList(race, totalItems = 25) {
  const drawnValue = getRandomStatValue(race, "Dextérité");
  const allValues = Array.from({ length: 20 }, (_, i) => i + 1);
  const half = Math.floor(totalItems / 2);
  const list = [];

  for (let i = 0; i < half; i++) {
    list.push(allValues[Math.floor(Math.random() * allValues.length)]);
  }

  list.push(drawnValue);

  for (let i = 0; i < half; i++) {
    list.push(allValues[Math.floor(Math.random() * allValues.length)]);
  }

  return { list, drawnValue };
}
