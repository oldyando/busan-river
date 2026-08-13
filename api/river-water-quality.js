/**
 * 🌊 Vercel Serverless Function: 부산 하천 수질 API Proxy (/api/river-water-quality)
 * 
 * Vercel 배포 시 서버리스 함수로 동작하며,
 * 로컬 개발 환경에서도 Vite 개발 서버 미들웨어와 공유됩니다.
 */
export default async function handler(req, res) {
  // CORS & Header 설정
  if (res.setHeader) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
  }

  if (req.method === 'OPTIONS') {
    if (res.status) res.status(200).end();
    else res.end();
    return;
  }

  // 1. 요청 파라미터(riverName) 파싱 (Vercel req.query 또는 URL param 지원)
  let riverName = '온천천';
  if (req.query && req.query.riverName) {
    riverName = req.query.riverName;
  } else if (req.url) {
    try {
      const parsedUrl = new URL(req.url, `http://${req.headers?.host || 'localhost'}`);
      riverName = parsedUrl.searchParams.get('riverName') || '온천천';
    } catch {
      riverName = '온천천';
    }
  }

  // 2. Vercel 환경 변수에서 BUSAN_RIVER_API_KEY 추출
  const apiKey = process.env.BUSAN_RIVER_API_KEY;

  if (!apiKey) {
    const errorBody = {
      ok: false,
      error: 'Vercel 프로젝트 환경 변수(Environment Variables)에 BUSAN_RIVER_API_KEY가 설정되지 않았습니다. Vercel 대시보드 Settings -> Environment Variables에서 등록해 주세요.'
    };
    if (res.status) res.status(500).json(errorBody);
    else {
      res.statusCode = 500;
      res.end(JSON.stringify(errorBody));
    }
    return;
  }

  try {
    // 3. 부산 수질 API 호출: 전체 개수 파악
    const initialUrl = `https://apis.data.go.kr/6260000/BusanRvrwtQltyInfoService/getRvrwtQltyInfo?serviceKey=${apiKey}&numOfRows=1&pageNo=1&resultType=json`;
    const initRes = await fetch(initialUrl);
    if (!initRes.ok) throw new Error(`API HTTP Error: ${initRes.status}`);
    const initJson = await initRes.json();

    const totalCount = parseInt(initJson.response?.body?.totalCount || '0', 10);
    const rows = 500;
    const lastPage = totalCount > 0 ? Math.ceil(totalCount / rows) : 1;

    // 4. 최신 페이지 데이터 가져오기
    const pageUrl = `https://apis.data.go.kr/6260000/BusanRvrwtQltyInfoService/getRvrwtQltyInfo?serviceKey=${apiKey}&numOfRows=${rows}&pageNo=${lastPage}&resultType=json`;
    const pageRes = await fetch(pageUrl);
    const pageJson = await pageRes.json();
    let items = pageJson.response?.body?.items?.item || [];

    if (!Array.isArray(items)) {
      items = items ? [items] : [];
    }

    if (items.length < 500 && lastPage > 1) {
      const prevUrl = `https://apis.data.go.kr/6260000/BusanRvrwtQltyInfoService/getRvrwtQltyInfo?serviceKey=${apiKey}&numOfRows=${rows}&pageNo=${lastPage - 1}&resultType=json`;
      const prevRes = await fetch(prevUrl);
      const prevJson = await prevRes.json();
      let prevItems = prevJson.response?.body?.items?.item || [];
      if (!Array.isArray(prevItems)) prevItems = prevItems ? [prevItems] : [];
      items = [...prevItems, ...items];
    }

    // 5. 해당 하천 매칭 (river_NAME, loc_NAME, area_NAME)
    const matchedItems = items.filter((item) => {
      if (!item) return false;
      const rName = item.river_NAME || '';
      const lName = item.loc_NAME || '';
      const aName = item.area_NAME || '';
      return rName.includes(riverName) || lName.includes(riverName) || aName.includes(riverName);
    });

    const validRecord = matchedItems
      .reverse()
      .find((i) => i.water02 !== null && i.water02 !== undefined && i.water06 !== null && i.water06 !== undefined);

    if (validRecord) {
      const responseData = {
        ok: true,
        data: {
          riverName: riverName,
          matchedRiverName: validRecord.river_NAME,
          locName: validRecord.loc_NAME,
          locAddr: validRecord.loc_ADDR,
          inspecYm: validRecord.inspec_ym,
          bod: parseFloat(validRecord.water02),
          do: parseFloat(validRecord.water06)
        }
      };

      if (res.status) res.status(200).json(responseData);
      else {
        res.statusCode = 200;
        res.end(JSON.stringify(responseData));
      }
    } else {
      const notFoundBody = {
        ok: false,
        error: `'${riverName}' 하천의 실시간 수질 측정 데이터를 찾을 수 없습니다.`
      };
      if (res.status) res.status(404).json(notFoundBody);
      else {
        res.statusCode = 404;
        res.end(JSON.stringify(notFoundBody));
      }
    }
  } catch (err) {
    console.error('Busan River API Serverless Function Error:', err);
    const serverErrBody = {
      ok: false,
      error: '부산 하천 수질 API 호출 중 오류가 발생했습니다.'
    };
    if (res.status) res.status(500).json(serverErrBody);
    else {
      res.statusCode = 500;
      res.end(JSON.stringify(serverErrBody));
    }
  }
}
