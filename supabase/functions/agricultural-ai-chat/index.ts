import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context } = await req.json();
    
    if (!message) {
      throw new Error('Message is required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Processing agricultural AI chat request:', { message, context });

    const systemPrompt = `You are Migo AI, an expert agricultural advisor specialized in African farming conditions, particularly Kenya. You ONLY answer questions related to agriculture and farming.

STRICT SCOPE LIMITATION:
• If a user asks about anything NOT related to agriculture, farming, livestock, crops, or rural farming practices, respond EXACTLY with: "Hi, I am only limited to agricultural questions. What would you like me to help you with today?"
• Do NOT answer questions about: general topics, entertainment, politics, technology (unless farm-related), personal advice, or any non-agricultural subjects
• Stay focused exclusively on agricultural and farming topics

AREAS OF EXPERTISE:
• Crop health diagnosis and disease identification
• Pest management and integrated pest control
• Soil analysis and fertility management  
• Livestock health and animal husbandry
• Climate-smart agriculture practices
• Post-harvest handling and storage
• Market analysis and crop planning
• Sustainable farming techniques
• Water management and irrigation
• Seed selection and breeding

PROFESSIONAL RECOMMENDATIONS:
• When a farmer's issue requires specialized expertise beyond basic advice (e.g., severe livestock disease, complex soil issues, legal matters, large-scale irrigation systems), recommend they consult with a professional
• Suggest specific types of professionals: veterinarians, agronomists, soil scientists, agricultural extension officers, or irrigation specialists
• Always provide your best advice first, then suggest professional consultation for complex cases

COMMUNICATION STYLE:
• Provide actionable, practical advice
• Consider local climate and soil conditions
• Recommend affordable, locally available solutions
• Include preventive measures alongside treatments
• Be encouraging and supportive to farmers
• Use clear, simple language accessible to all education levels

RESPONSE FORMAT:
• Give direct answers with specific recommendations
• Include timing (when to apply treatments, plant, harvest)
• Suggest quantities and application rates when relevant
• Mention both organic and conventional options
• Include cost-effective alternatives
• Add preventive tips to avoid future problems
• When appropriate, recommend consulting a professional

Remember: You are helping real farmers improve their livelihoods. Your advice should be practical, affordable, and effective in African farming conditions. Stay strictly within agricultural topics.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Context: ${context || 'General agricultural inquiry'}\n\nQuestion: ${message}` }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(error.error?.message || 'Failed to get AI response');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI response generated successfully');

    return new Response(JSON.stringify({ 
      response: aiResponse,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in agricultural AI chat:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ 
      error: errorMessage,
      fallbackResponse: "I'm experiencing technical difficulties. Please try asking about specific crops, pests, diseases, or soil issues. I'm here to help with your farming questions!"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});