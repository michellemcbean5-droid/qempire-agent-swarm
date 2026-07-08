import { aiService } from '../services/aiService';

jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ data: [{ generated_text: 'Test response' }] })),
}));

describe('AI Service', () => {
  it('should generate text', async () => {
    const result = await aiService.generateText('Hello world');
    expect(result).toBe('Test response');
  });

  it('should generate market insight', async () => {
    const insight = await aiService.generateMarketInsight('Technology');
    expect(insight.type).toBe('market');
    expect(insight.title).toContain('Technology');
    expect(insight.confidence).toBeGreaterThan(0);
  });

  it('should generate competitor insight', async () => {
    const insight = await aiService.generateCompetitorInsight('MyBiz', 'E-commerce');
    expect(insight.type).toBe('competitor');
    expect(insight.title).toContain('MyBiz');
  });

  it('should handle generation errors gracefully', async () => {
    jest.resetModules();
    const result = await aiService.generateText('');
    expect(result).toBeDefined();
  });
});
