import Patient from "../models/Patient.js";
import PatientClinic2 from "../models/PatientClinic2.js";
import PatientClinic3 from "../models/PatientClinic3.js";

const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const mergeAggResults = (arrays, top = 10) => {
  const map = {};
  arrays.flat().forEach(({ _id, count }) => {
    const key = _id ?? "Unknown";
    map[key] = (map[key] || 0) + count;
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, top);
};

const buildMatchStage = (region, district, timeFilter) => {
  const match = {};
  if (region) match.region = region;
  if (district) match.district = district;

  if (timeFilter && timeFilter !== "all") {
    const now = new Date();
    let startDate = new Date();

    if (timeFilter === "week") startDate.setDate(now.getDate() - 7);
    else if (timeFilter === "month") startDate.setMonth(now.getMonth() - 1);
    else if (timeFilter === "year") startDate.setFullYear(now.getFullYear() - 1);

    match.createdAt = { $gte: startDate };
  }

  return match;
};

export const getDashboardStats = async (req, res) => {
  try {
    const { region, district, timeFilter } = req.query;
    const matchStage = buildMatchStage(region, district, timeFilter);
    const models = [Patient, PatientClinic2, PatientClinic3];

    // Total patients
    const counts = await Promise.all(models.map(m => m.countDocuments(matchStage)));
    const totalPatients = counts.reduce((a, b) => a + b, 0);

    // Gender chart
    const genderAgg = await Promise.all(models.map(m =>
      m.aggregate([
        { $match: matchStage },
        { $group: { _id: "$gender", count: { $sum: 1 } } }
      ])
    ));
    const genderChart = mergeAggResults(genderAgg);

    // Diagnosis chart
    const diagnosisAgg = await Promise.all(models.map(m =>
      m.aggregate([
        { $match: matchStage },
        { $group: { _id: "$diagnosis", count: { $sum: 1 } } }
      ])
    ));
    const diagnosisChart = mergeAggResults(diagnosisAgg);

    // Monthly visits
    const monthlyAgg = await Promise.all(models.map(m =>
      m.aggregate([
        { $match: { ...matchStage, createdAt: { $type: "date" } } },
        { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ])
    ));
    const monthlyChart = mergeAggResults(monthlyAgg, 12).map(item => ({
      name: monthNames[item.name - 1] ?? "Unknown",
      value: item.value
    }));

    res.json({
      success: true,
      totals: {
        totalPatients,
        male: genderChart.find(g => g.name === "Male")?.value || 0,
        female: genderChart.find(g => g.name === "Female")?.value || 0,
        totalVisits: totalPatients
      },
      genderChart,
      diagnosisChart,
      monthlyChart
    });

  } catch (err) {
    console.error("Dashboard controller error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
