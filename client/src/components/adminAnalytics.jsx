import axios from "axios";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/protected/admin/analytics`, {
      withCredentials: true
    }).then(res => setData(res.data));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-white shadow rounded">👥 Users: {data.totalUsers}</div>
      <div className="p-4 bg-white shadow rounded">📚 Courses: {data.totalCourses}</div>
      <div className="p-4 bg-white shadow rounded">✅ Enrollments: {data.totalEnrollments}</div>
      <div className="p-4 bg-white shadow rounded">💼 Jobs: {data.totalJobs}</div>
      <div className="p-4 bg-white shadow rounded">📝 Applications: {data.totalApplications}</div>
      <div className="p-4 bg-white shadow rounded">💰 Revenue: ₹{data.totalRevenue}</div>
    </div>
  );
}


export function ActivityLog() {
    const [logs, setLogs] = useState([]);
  
    useEffect(() => {
      axios.get(`${API_URL}/api/protected/admin/activity`, {
        withCredentials: true
      }).then(res => setLogs(res.data));
    }, []);
  
    return (
      <div className="mt-6">
        <h2 className="text-lg font-bold mb-3">Activity Logs</h2>
        {logs.map(log => (
          <div key={log._id} className="bg-gray-100 p-2 mb-2 rounded">
            {log.userId?.email} → {log.action}
          </div>
        ))}
      </div>
    );
  }
  
export function RevenueReport() {
    const [report, setReport] = useState([]);
  
    useEffect(() => {
      axios.get(`${API_URL}/api/protected/admin/revenue-report`, {
        withCredentials: true
      }).then(res => setReport(res.data));
    }, []);
  
    return (
      <div className="mt-6">
        <h2 className="text-lg font-bold mb-3">Revenue Report</h2>
        {report.map(r => (
          <div key={r._id} className="bg-white shadow p-3 mb-2 rounded">
            {r._id} → ₹{r.revenue}
          </div>
        ))}
      </div>
    );
  }
  
  