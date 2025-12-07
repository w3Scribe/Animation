async function test() {
  try {
    const response = await fetch(
      'http://localhost:3000/learn/framer-motion/introduction'
    );
    const html = await response.text();

    const hasDataMeta = html.includes('data-meta');
    const hasPlayground = html.includes('Playground');
    const hasInteractive = html.includes('framer-motion-basic');

    console.log('Has data-meta:', hasDataMeta);
    console.log('Has Playground button:', hasPlayground);
    console.log('Has interactive="framer-motion-basic":', hasInteractive);

    // Show a snippet around 'interactive'
    if (hasInteractive || hasDataMeta) {
      const regex = /(data-meta|interactive|Playground).{0,100}/gi;
      const matches = html.match(regex) || [];
      console.log('\nMatches found:');
      matches.slice(0, 5).forEach(m => console.log(' -', m.substring(0, 100)));
    }
  } catch (e) {
    console.error('Error:', e.message);
  }
}

test();
