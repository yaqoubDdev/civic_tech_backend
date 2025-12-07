function smartRouting(report) {
  const map = {
    Water: 'Water Utility Co',
    Roads: 'Dept of Public Works',
    Power: 'Power Utility Co',
    Waste: 'Waste Management Services'
  };

  report.primaryOwner = map[report.category] || 'City Services';
  
  // Auto-generate title if not provided (for low-literacy users)
  if (!report.title && report.category && report.type) {
    report.title = `${report.category} - ${report.type}`;
  }
  
  return report;
}

module.exports = smartRouting;
