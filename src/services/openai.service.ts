import OpenAI from 'openai';

export class OpenAIService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    public async getLatestNews(topic?: string): Promise<string> {
        try {
            console.log('Getting news about:', topic || 'latest breaking news');
            
            // Using Azure OpenAI responses API with Bing Search grounding
            const response = await this.openai.responses.create({
                model: "gpt-4o",
                tools: [{ type: "web_search_preview" }],
                input: topic 
                    ? `What are the latest developments and news about ${topic} today? Provide a brief summary of the most important points.`
                    : `What are the top breaking news stories today? Provide a brief summary of the most important developments.`
            });

            console.log('OpenAI Response received');
            
            return response.output_text || 'No news available';
        } catch (error) {
            console.error('Error getting latest news:', error);
            throw error;
        }
    }

    public async analyzeInterests(interests: string[]): Promise<string> {
        try {
            const prompt = `Analyze these interests and provide a brief summary of the main topics and themes:\n${interests.join('\n')}`;
            
            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant that analyzes user interests and provides concise summaries."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 150,
                temperature: 0.7
            });

            return response.choices[0]?.message?.content || 'No analysis available';
        } catch (error) {
            console.error('Error analyzing interests with OpenAI:', error);
            throw error;
        }
    }

    public async categorizeInterest(interest: string): Promise<string[]> {
        try {
            const prompt = `Categorize this interest into 2-3 relevant topics or categories: "${interest}"`;
            
            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant that categorizes user interests into relevant topics. Return only the categories as a comma-separated list."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 50,
                temperature: 0.3
            });

            const categories = response.choices[0]?.message?.content || '';
            return categories.split(',').map((cat: string) => cat.trim());
        } catch (error) {
            console.error('Error categorizing interest with OpenAI:', error);
            throw error;
        }
    }
} 