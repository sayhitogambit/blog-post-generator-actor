import { Actor } from 'apify';
import axios from 'axios';

// OpenRouter API Configuration
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Model pricing per million tokens (input/output)
const MODEL_PRICING = {
    'openai/gpt-4o': { input: 2.50, output: 10.00 },
    'anthropic/claude-3.5-sonnet': { input: 3.00, output: 15.00 },
    'google/gemini-2.0-flash-exp:free': { input: 0, output: 0 }
};

await Actor.main(async () => {
    const input = await Actor.getInput();
    console.log('Input:', input);

    // Validate required inputs
    if (!input?.topic) {
        throw new Error('Topic is required');
    }
    if (!input?.openrouterApiKey) {
        throw new Error('OpenRouter API key is required');
    }

    const {
        topic,
        keywords = [],
        tone = 'professional',
        length = 1000,
        includeImageSuggestions = true,
        seoOptimized = true,
        model = 'openai/gpt-4o',
        openrouterApiKey
    } = input;

    console.log(`Generating blog post about: "${topic}" with ${model}`);
    console.log(`Target length: ${length} words, Tone: ${tone}`);

    try {
        // Build the prompt
        const prompt = buildBlogPrompt({
            topic,
            keywords,
            tone,
            length,
            includeImageSuggestions,
            seoOptimized
        });

        // Call OpenRouter API
        const startTime = Date.now();
        const result = await callOpenRouter(prompt, model, openrouterApiKey);
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log(`API call completed in ${duration}s`);
        console.log(`Tokens used - Input: ${result.usage.prompt_tokens}, Output: ${result.usage.completion_tokens}`);

        // Parse the generated content
        const blogPost = JSON.parse(result.content);

        // Calculate costs
        const cost = calculateCost(result.usage, model);
        const chargePrice = 1.00; // $1.00 charge per blog post

        // Prepare output
        const output = {
            topic,
            title: blogPost.title,
            metaDescription: blogPost.metaDescription,
            content: blogPost.content,
            keywords: blogPost.keywords || keywords,
            readingTime: blogPost.readingTime || Math.ceil(length / 200),
            wordCount: countWords(blogPost.content),
            imageSuggestions: blogPost.imageSuggestions || [],
            tone,
            model,
            usage: result.usage,
            cost: parseFloat(cost.totalCost.toFixed(6)),
            chargePrice,
            profit: parseFloat((chargePrice - cost.totalCost).toFixed(6)),
            profitMargin: parseFloat(((chargePrice - cost.totalCost) / chargePrice * 100).toFixed(2)),
            duration: parseFloat(duration),
            generatedAt: new Date().toISOString()
        };

        // Save to dataset
        await Actor.pushData(output);

        console.log('✓ Blog post generated successfully!');
        console.log(`  Title: ${output.title}`);
        console.log(`  Word Count: ${output.wordCount}`);
        console.log(`  Cost: $${output.cost}`);
        console.log(`  Charge: $${output.chargePrice}`);
        console.log(`  Profit: $${output.profit} (${output.profitMargin}% margin)`);

    } catch (error) {
        console.error('Error generating blog post:', error.message);
        if (error.response) {
            console.error('API Response:', error.response.data);
        }
        throw error;
    }
});

/**
 * Build the blog post generation prompt
 */
function buildBlogPrompt({ topic, keywords, tone, length, includeImageSuggestions, seoOptimized }) {
    const keywordsText = keywords.length > 0
        ? `\nTarget SEO Keywords: ${keywords.join(', ')}`
        : '';

    return `Write a comprehensive, engaging blog post about: "${topic}"

Requirements:
- Tone: ${tone}
- Target length: approximately ${length} words
- SEO optimized: ${seoOptimized ? 'Yes - include natural keyword usage and proper heading structure' : 'No'}${keywordsText}

Structure:
1. Compelling, click-worthy title (60-70 characters)
2. Meta description for SEO (150-160 characters)
3. Engaging introduction that hooks the reader
4. Well-structured body with clear subheadings (H2, H3)
5. Practical examples, tips, or insights
6. Strong conclusion with call-to-action${includeImageSuggestions ? '\n7. 3-5 image suggestions with detailed descriptions' : ''}

Writing Guidelines:
- Use ${tone} language throughout
- Include relevant statistics or data points when appropriate
- Break up text with subheadings every 200-300 words
- Use bullet points or numbered lists for clarity
- Write in HTML format with proper tags (<h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>)
- Ensure content is original, informative, and valuable

Return the result in this exact JSON format:
{
    "title": "Catchy blog post title",
    "metaDescription": "SEO meta description 150-160 chars",
    "content": "Full HTML formatted blog post content",
    "readingTime": 5,
    "keywords": ["extracted", "keywords"],
    "imageSuggestions": ["Image 1: Description", "Image 2: Description"]
}`;
}

/**
 * Call OpenRouter API with retry logic
 */
async function callOpenRouter(prompt, model, apiKey, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await axios.post(
                OPENROUTER_API_URL,
                {
                    model: model,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert content writer and SEO specialist. Create engaging, well-researched blog posts that provide real value to readers. Always return valid JSON.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 4000,
                    response_format: { type: 'json_object' }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'HTTP-Referer': 'https://apify.com',
                        'X-Title': 'Apify Blog Post Generator',
                        'Content-Type': 'application/json'
                    },
                    timeout: 120000 // 2 minutes
                }
            );

            return {
                content: response.data.choices[0].message.content,
                usage: response.data.usage,
                model: response.data.model
            };

        } catch (error) {
            // Handle rate limiting
            if (error.response?.status === 429) {
                const retryAfter = parseInt(error.response.headers['retry-after'] || '5');
                if (attempt < maxRetries) {
                    console.log(`Rate limited. Waiting ${retryAfter}s before retry ${attempt}/${maxRetries}...`);
                    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
                    continue;
                }
            }

            // Handle authentication errors
            if (error.response?.status === 401) {
                throw new Error('Invalid OpenRouter API key. Get your key at https://openrouter.ai/keys');
            }

            // Handle server errors with exponential backoff
            if (error.response?.status >= 500 && attempt < maxRetries) {
                const backoff = Math.pow(2, attempt) * 1000;
                console.log(`Server error. Retrying in ${backoff}ms (attempt ${attempt}/${maxRetries})...`);
                await new Promise(resolve => setTimeout(resolve, backoff));
                continue;
            }

            throw error;
        }
    }

    throw new Error(`Failed after ${maxRetries} attempts`);
}

/**
 * Calculate API cost based on token usage
 */
function calculateCost(usage, model) {
    const pricing = MODEL_PRICING[model] || MODEL_PRICING['openai/gpt-4o'];

    const inputCost = (usage.prompt_tokens / 1000000) * pricing.input;
    const outputCost = (usage.completion_tokens / 1000000) * pricing.output;

    return {
        inputCost,
        outputCost,
        totalCost: inputCost + outputCost,
        currency: 'USD'
    };
}

/**
 * Count words in HTML content
 */
function countWords(html) {
    const text = html.replace(/<[^>]*>/g, '').trim();
    return text.split(/\s+/).filter(word => word.length > 0).length;
}
