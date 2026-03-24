import type { Config } from '@twocaretcat/astro-snapshot';

type OutputPath = Config['pages'][string][number]['outputPath'];

export const OUTPUT_DIR_NAME = 'output' as const;
export const OUTPUT_IMAGE_NAME: OutputPath = 'basic.png';
