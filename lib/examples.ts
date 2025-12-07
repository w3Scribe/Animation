export type ExampleConfig = {
  id: string;
  initialCode: string;
};

export const EXAMPLES = {
  'test-example': {
    id: 'test-example',
    initialCode: `console.log("Hello GSAP")`,
  },
} satisfies Record<string, ExampleConfig>;

export function getExample(id: string): ExampleConfig | null {
  return EXAMPLES[id as keyof typeof EXAMPLES] || null;
}

export function hasExample(id: string): boolean {
  return id in EXAMPLES;
}
