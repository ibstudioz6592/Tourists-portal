// api/ai.js
export default async function handler(req, res) {
  const { message, context } = req.body;
  
  // Get API key from environment variables
  const apiKey = process.env.OPENAI_API_KEY || process.env.XAI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ 
      response: "I'm sorry, the AI service is not properly configured. Please contact the administrator." 
    });
  }
  
  try {
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
      
      const xaiData = await xaiResponse.json();
      response = xaiData.choices[0].message.content;
    }
    else {
      // Fallback to mock response if no API key is available
      response = `I understand you're asking about: "${message}". As a tourist safety assistant for India, I recommend checking with local authorities or your embassy for the most current information. For emergencies, dial 100 for police, 108 for ambulance, or 101 for fire services.`;
    }
    
    res.status(200).json({ response });
  } catch (error) {
    console.error('AI API Error:', error);
    res.status(500).json({ 
      response: "I'm sorry, I'm having trouble processing your request right now. Please try again later." 
    });
  }
}
