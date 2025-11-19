# AI Blog Post Generator - OpenRouter

Generate high-quality, SEO-optimized blog posts using advanced AI models (GPT-4o, Claude 3.5, Gemini). Perfect for content marketers, SEO agencies, and automated content creation.

## Features

- **Multiple AI Models**: Choose from GPT-4o, Claude 3.5 Sonnet, or Gemini 2.0 Flash
- **SEO Optimized**: Automatically includes meta descriptions, keywords, and proper heading structure
- **Customizable**: Control tone, length, and style
- **Image Suggestions**: Get AI-generated suggestions for blog images
- **HTML Formatted**: Ready-to-publish HTML content
- **Cost Tracking**: Transparent API cost tracking and profit margins

## Pricing

- **Cost per blog post**: $0.01 (average, varies by model and length)
- **Recommended charge**: $1.00 per blog post
- **Profit margin**: ~99% ($0.99 profit per post)

## Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `topic` | String | Yes | Main topic/subject for the blog post |
| `keywords` | Array | No | Target SEO keywords (default: []) |
| `tone` | String | No | Writing tone: professional, casual, technical, friendly, authoritative (default: professional) |
| `length` | Integer | No | Target word count: 100-5000 (default: 1000) |
| `includeImageSuggestions` | Boolean | No | Generate image suggestions (default: true) |
| `seoOptimized` | Boolean | No | Optimize for SEO (default: true) |
| `model` | String | No | AI model to use (default: openai/gpt-4o) |
| `openrouterApiKey` | String | Yes | Your OpenRouter API key |

## Example Input

```json
{
  "topic": "The Future of AI in Content Marketing",
  "keywords": ["AI content", "content marketing", "automation"],
  "tone": "professional",
  "length": 1000,
  "includeImageSuggestions": true,
  "seoOptimized": true,
  "model": "openai/gpt-4o",
  "openrouterApiKey": "sk-or-v1-..."
}
```

## Output

Each generated blog post includes:

```json
{
  "title": "Blog post title",
  "metaDescription": "SEO meta description",
  "content": "Full HTML formatted content",
  "keywords": ["extracted", "keywords"],
  "wordCount": 1050,
  "readingTime": 5,
  "imageSuggestions": ["Image 1 description", "Image 2 description"],
  "cost": 0.0087,
  "chargePrice": 1.00,
  "profit": 0.9913,
  "profitMargin": 99.13,
  "generatedAt": "2025-01-15T10:30:00.000Z"
}
```

## Available Models

### GPT-4o (Best Quality)
- **Model ID**: `openai/gpt-4o`
- **Cost**: ~$0.01 per 1000-word article
- **Best for**: High-quality, engaging content

### Claude 3.5 Sonnet (Balanced)
- **Model ID**: `anthropic/claude-3.5-sonnet`
- **Cost**: ~$0.012 per 1000-word article
- **Best for**: Accurate, well-structured content

### Gemini 2.0 Flash (Free/Fast)
- **Model ID**: `google/gemini-2.0-flash-exp:free`
- **Cost**: FREE
- **Best for**: High-volume content generation

## How to Get OpenRouter API Key

1. Visit [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. Sign up or log in
3. Create a new API key
4. Add credits to your account
5. Use the key in the `openrouterApiKey` field

## Use Cases

- **Content Marketing**: Generate blog posts at scale
- **SEO Agencies**: Create optimized content for clients
- **Automated Blogging**: Build content pipelines
- **Research**: Generate outlines and drafts
- **Marketing Teams**: Speed up content production

## Cost Estimation

Based on typical usage:

| Volume | API Cost | Revenue (@ $1.00/post) | Profit |
|--------|----------|------------------------|--------|
| 100 posts | ~$1.00 | $100 | ~$99 |
| 1,000 posts | ~$10 | $1,000 | ~$990 |
| 10,000 posts | ~$100 | $10,000 | ~$9,900 |

## Legal Considerations

This actor generates AI content. Users are responsible for:
- Reviewing and editing generated content
- Ensuring content accuracy
- Complying with copyright and plagiarism policies
- Following platform-specific AI content disclosure requirements

## Support

- **Documentation**: [Apify Actors Docs](https://docs.apify.com/actors)
- **OpenRouter Docs**: [https://openrouter.ai/docs](https://openrouter.ai/docs)
- **Issues**: [GitHub Issues](https://github.com/yourusername/blog-post-generator)

## Version History

### 1.0.0 (2025-01-15)
- Initial release
- Support for GPT-4o, Claude 3.5, and Gemini 2.0
- SEO optimization
- Image suggestions
- Cost tracking

## License

Apache-2.0

## Author

Created for the Apify Store
