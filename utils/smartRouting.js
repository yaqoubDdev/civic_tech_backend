function smartRouting(report) {
  const map = {
    Water: 'Water Utility Co',
    Roads: 'Dept of Public Works',
    Power: 'Power Utility Co'
  };

  report.primaryOwner = map[report.category] || 'City Services';
  return report;
}

module.exports = smartRouting;
