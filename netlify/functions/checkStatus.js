export const handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const taskId = event.queryStringParameters.taskId;
    if (!taskId) {
      return { statusCode: 400, body: JSON.stringify({ error: 'taskId is required' }) };
    }

    const API_KEY = process.env.SUNO_API_KEY;
    const RAW_URL = process.env.SUNO_API_URL || 'https://api.sunoapi.org/api/v1/generate';
    
    // Extract base URL (e.g. from https://api.sunoapi.org/api/v1/generate -> https://api.sunoapi.org)
    const baseUrlMatch = RAW_URL.match(/^(https?:\/\/[^\/]+)/);
    const BASE_URL = baseUrlMatch ? baseUrlMatch[1] : 'https://api.sunoapi.org';
    
    const API_URL = `${BASE_URL}/api/v1/generate/record-info?taskId=${taskId}`;

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { statusCode: response.status, body: JSON.stringify({ error: `API Check Error: ${errorText}` }) };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error("Function error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) };
  }
};
