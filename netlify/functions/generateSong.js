export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { prompt } = JSON.parse(event.body);

    if (!prompt) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Prompt is required' }) };
    }

    const API_KEY = process.env.SUNO_API_KEY;
    const API_URL = process.env.SUNO_API_URL || 'https://api.sunoapi.org/api/v1/generate'; 

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        prompt: prompt,
        customMode: false,
        instrumental: false,
        model: "V5"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { statusCode: response.status, body: JSON.stringify({ error: `API Error: ${errorText}` }) };
    }

    const data = await response.json();
    
    // Check if the provider returns a custom error code
    if (data.code && data.code !== 200) {
      return { statusCode: 400, body: JSON.stringify({ error: `API Error: ${data.msg || 'Unknown Provider Error'}` }) };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
