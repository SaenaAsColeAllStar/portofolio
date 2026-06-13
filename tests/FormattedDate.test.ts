import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test, describe } from 'vitest';
import FormattedDate from '../src/components/FormattedDate.astro';

describe('FormattedDate', () => {
  test('renders the <time> element with the correct datetime attribute', async () => {
    const container = await AstroContainer.create();
    const date = new Date('2023-10-15T00:00:00Z');
    const result = await container.renderToString(FormattedDate, {
      props: { date },
    });

    expect(result).toContain(`<time datetime="2023-10-15T00:00:00.000Z"`);
  });

  test('formats the date string correctly according to en-us locale', async () => {
    const container = await AstroContainer.create();
    const date = new Date('2023-10-15T00:00:00Z');
    const result = await container.renderToString(FormattedDate, {
      props: { date },
    });

    // The rendered date is formatted using toLocaleDateString('en-us')
    // In UTC timezone, 2023-10-15T00:00:00Z is Oct 15, 2023.
    // However, depending on the environment timezone, it might be rendered as Oct 14, 2023.
    // Node.js often defaults to UTC in CI, but to be robust, we match both dates
    expect(result).toMatch(/Oct 1[45], 2023/);
  });
});
