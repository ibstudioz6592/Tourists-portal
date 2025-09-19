// api/ai.js
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Get API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY || process.env.XAI_API_KEY;
    
    if (!apiKey) {
      // Fallback response when no API key is available
      return res.status(200).json({ 
        response: `I understand you're asking about: "${message}". As a tourist safety assistant for India, I recommend checking with local authorities or your embassy for the most current information. For emergencies, dial 100 for police, 108 for ambulance, or 101 for fire services.` 
      });
    }
    
    // Determine which AI service to use
    let response;
    
    if (process.env.OPENAI_API_KEY) {
      // Use OpenAI API
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are AJ, a helpful assistant for a tourist safety system in India. Provide concise, helpful responses about travel safety, emergency procedures, and tourist information in India.' },
            ...(context ? [{ role: 'assistant', content: context }] : []),
            { role: 'user', content: message }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });
      
      if (!openaiResponse.ok) {
        throw new Error(`OpenAI API error: ${openaiResponse.status} ${openaiResponse.statusText}`);
      }
      
      const openaiData = await openaiResponse.json();
      response = openaiData.choices[0].message.content;
    } 
    else if (process.env.XAI_API_KEY) {
      // Use X.AI API (Grok)
      const xaiResponse = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.XAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'grok-beta',
          messages: [
            { role: 'system', content: 'You are AJ, a helpful assistant for a tourist safety system in India. Provide concise, helpful responses about travel safety, emergency procedures, and tourist information in India.' },
            ...(context ? [{ role: 'assistant', content: context }] : []),
            { role: 'user', content: message }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });
      
      if (!xaiResponse.ok) {
        throw new Error(`X.AI API error: ${xaiResponse.status} ${xaiResponse.statusText}`);
      }
      
      const xaiData = await xaiResponse.json();
      response = xaiData.choices[0].message.content;
    }
    
    res.status(200).json({ response });
  } catch (error) {
    console.error('AI API Error:', error);
    res.status(500).json({ 
      response: "I'm sorry, I'm having trouble processing your request right now. Please try again later." 
    });
  }
}
