// Simple priority calculation: P = (votes * severity) + (daysOpen * agingFactor)
// severity is expected to be 1-5. agingFactor defaults to 0.1
function calculatePriority({ votes = 1, severity = 1, createdAt = new Date(), agingFactor = 0.1 }) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysOpen = Math.max(0, (Date.now() - new Date(createdAt).getTime()) / msPerDay);
  const score = (votes * severity) + (daysOpen * agingFactor);
  return Number(score.toFixed(3));
}

module.exports = calculatePriority;
