import React, { useState } from 'react';
import {
  RIVERS_LIST,
  EVALUATION_CRITERIA,
  calculateComparisonMatrix
} from '../../data/riverEvaluationData';

/**
 * ⚖️ RiverComparisonTable 컴포넌트
 * 부산 전체 하천의 종합 평점 및 항목별 평점을 실시간 매트릭스로 비교하여 보여줍니다.
 */
function RiverComparisonTable({ reviewsList = [], onSelectRiver }) {
  const activeCriteria = EVALUATION_CRITERIA.filter((c) => c.active);
  const matrixData = calculateComparisonMatrix(RIVERS_LIST, reviewsList, EVALUATION_CRITERIA);

  const [sortKey, setSortKey] = useState('overallAverage');
  const [sortDir, setSortDir] = useState('desc');

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const sortedData = [...matrixData].sort((a, b) => {
    let valA = 0;
    let valB = 0;

    if (sortKey === 'overallAverage') {
      valA = a.overallAverage;
      valB = b.overallAverage;
    } else if (sortKey === 'totalCount') {
      valA = a.totalCount;
      valB = b.totalCount;
    } else {
      valA = a.criterionAverages[sortKey] || 0;
      valB = b.criterionAverages[sortKey] || 0;
    }

    if (valA === valB) return 0;
    return sortDir === 'desc' ? valB - valA : valA - valB;
  });

  return (
    <div className="comparison-container">
      <div className="comparison-header">
        <h4>⚖️ 부산 하천 전체 평가 비교 매트릭스</h4>
        <p>실제 시민 평가 데이터를 기반으로 하천별 종합 및 항목별 점수를 실시간 비교합니다.</p>
      </div>

      <div className="table-responsive-box">
        <table className="toss-comparison-table">
          <thead>
            <tr>
              <th className="th-river">하천명</th>
              <th>유형</th>
              <th
                className={`th-sortable ${sortKey === 'overallAverage' ? 'active' : ''}`}
                onClick={() => handleSort('overallAverage')}
              >
                종합평점 {sortKey === 'overallAverage' ? (sortDir === 'desc' ? '▼' : '▲') : ''}
              </th>
              {activeCriteria.map((c) => (
                <th
                  key={c.id}
                  className={`th-sortable ${sortKey === c.id ? 'active' : ''}`}
                  onClick={() => handleSort(c.id)}
                >
                  {c.name} {sortKey === c.id ? (sortDir === 'desc' ? '▼' : '▲') : ''}
                </th>
              ))}
              <th
                className={`th-sortable ${sortKey === 'totalCount' ? 'active' : ''}`}
                onClick={() => handleSort('totalCount')}
              >
                참여수
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row) => (
              <tr
                key={row.id}
                className="tr-interactive"
                onClick={() => onSelectRiver && onSelectRiver(row.id)}
              >
                <td className="td-river-name">
                  <strong>🌊 {row.name}</strong>
                </td>
                <td>
                  <span className="type-chip">{row.typeName}</span>
                </td>
                <td className="td-overall-score">
                  <span className="overall-score-badge">
                    ⭐ {row.overallAverage > 0 ? row.overallAverage.toFixed(1) : '-'}
                  </span>
                </td>
                {activeCriteria.map((c) => {
                  const score = row.criterionAverages[c.id] || 0;
                  return (
                    <td key={c.id} className="td-criterion-score">
                      <span className={`score-tag ${score >= 4 ? 'high' : score >= 3 ? 'mid' : 'low'}`}>
                        {score > 0 ? score.toFixed(1) : '-'}
                      </span>
                    </td>
                  );
                })}
                <td className="td-count">{row.totalCount}개</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="comparison-footer-tip">
        💡 항목 헤더를 클릭하면 원하는 기준(종합점수, 물의 깨끗함 등)으로 정렬할 수 있습니다.
      </div>
    </div>
  );
}

export default RiverComparisonTable;
