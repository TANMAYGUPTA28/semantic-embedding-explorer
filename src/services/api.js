// Frontend API Service with Hybrid MERN Backend & Client Fallback
const BACKEND_URL = 'http://localhost:5000';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/health`, { method: 'GET' });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}
  return null;
}

export async function retrieveTopKFromBackend(queryVector, topK = 10) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/retrieve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ queryVector, topK })
    });
    if (res.ok) {
      const data = await res.json();
      return data.results;
    }
  } catch (e) {}
  return null;
}

export async function ingestDatasetToMongoDB(dataset) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: dataset })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}
  return null;
}
