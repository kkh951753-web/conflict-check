// pages/stats.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function StatsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("test_results")
        .select("main_type, mbti");
      if (!error && data) {
        setRows(data);
      }
      setLoading(false);
    }
    load();
  }, []);

  const countByType = rows.reduce((acc, row) => {
    const key = row.main_type || "기타";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <main className="page">
      <div className="card">
        <h1 className="title">사용자 통계</h1>
        {loading ? (
          <p>불러오는 중...</p>
        ) : (
          <>
            <h2 style={{ fontSize: "18px", marginBottom: "8px" }}>대표 유형 분포</h2>
            <ul style={{ listStyle: "none", padding: 0, lineHeight: 1.8 }}>
              {Object.entries(countByType).map(([type, count]) => (
                <li key={type}>
                  {type} : {count} 명
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </main>
  );
}
