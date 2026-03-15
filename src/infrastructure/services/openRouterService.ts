import { AnalysisData } from '@/domain/entities/SensorData';
import { OPENROUTER_API_KEY, OPENROUTER_URL } from '@/domain/constants';

export const createHealthAnalysisPrompt = (data: AnalysisData[]): string => {
  return `You are an advanced biomedical AI analyst specializing in real-time health monitoring and predictive wellness assessment. Your role is to provide clinically-relevant, actionable insights from continuous biometric data streams.

CONTEXT:
You have received a 10-second continuous biometric data stream from a wearable health monitoring system. Each data point represents measurements captured at 1-second intervals. The dataset includes:
- Heart Rate (BPM): Cardiac frequency indicator
- SpO2 (%): Peripheral oxygen saturation level
- Body Temperature (°C): Core/surface temperature measurement
- 3-Axis Acceleration (m/s²): Motion and activity intensity metrics
- GSR (Galvanic Skin Response, arbitrary units): Electrodermal activity indicator of stress/arousal

ANALYSIS REQUIREMENTS:
1. Identify temporal trends: Calculate whether each metric is increasing, decreasing, or stable over the 10-second window
2. Detect anomalies: Flag any values that deviate significantly from normal physiological ranges
3. Correlate patterns: Look for synchronized changes across metrics that indicate specific physiological states (stress, fatigue, exertion, etc.)
4. Assess risk: Evaluate overall wellness status and identify potential health concerns
5. Provide actionable guidance: Deliver a single, concise clinical insight that is immediately useful for the user

BIOMETRIC DATA:
${JSON.stringify(data, null, 2)}

NORMAL PHYSIOLOGICAL RANGES (for reference):
- Heart Rate: 60-100 BPM (varies with activity)
- SpO2: 95-100%
- Temperature: 36.5-37.5°C
- GSR: Baseline varies; elevated values indicate stress/arousal

OUTPUT REQUIREMENTS:
Provide ONLY a single, professional sentence (maximum 20 words) that delivers:
1. A clear observation about the current physiological state
2. A specific health recommendation or warning if applicable
3. Use clinical terminology where appropriate

Example outputs:
- "Heart rate trending upward with elevated GSR suggests acute stress response; recommend brief relaxation exercise."
- "All vitals stable within normal ranges; excellent cardiovascular stability during this monitoring period."
- "SpO2 declining slightly with increased acceleration; ensure adequate ventilation during continued activity."

Respond with ONLY the insight sentence, no additional text.`;
};

export const sendToOpenRouter = async (
  data: AnalysisData[],
  setHealthResponse: (response: string) => void,
  onResponseComplete: () => void
) => {
  const prompt = createHealthAnalysisPrompt(data);

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://vitalink.example.com",
        "X-Title": "VitaLink Health Dashboard"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [
          {
            role: "system",
            content: "You are an advanced biomedical AI analyst specializing in real-time health monitoring and predictive wellness assessment."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("OpenRouter API Error:", response.status, errorBody);
      setHealthResponse("⚠️ Error: Unable to analyze data at this moment. Please try again.");
      onResponseComplete();
      return;
    }

    const result = await response.json();
    const text = result.choices?.[0]?.message?.content;

    if (!text) {
      console.error("OpenRouter API Response Missing Text:", result);
      setHealthResponse("⚠️ Error: Analysis returned empty response. Please try again.");
      onResponseComplete();
      return;
    }

    setHealthResponse(text);
    onResponseComplete();
  } catch (error) {
    console.error("Error sending to OpenRouter:", error);
    setHealthResponse("⚠️ Error: Network error. Please check your connection.");
    onResponseComplete();
  }
};
