export const prerender = false;

import type { APIRoute } from 'astro';

// In-memory storage for demo (in production, use a real database)
let cards = [
  {
    id: '1',
    name: 'Visual Studio Code',
    description: 'A powerful, lightweight code editor with extensive extension support and integrated terminal.',
    icon: 'https://code.visualstudio.com/assets/images/code-stable.png',
    link: 'https://code.visualstudio.com',
    category: 'software'
  },
  {
    id: '2',
    name: 'Prettier',
    description: 'An opinionated code formatter that supports many languages and integrates with most editors.',
    icon: 'https://prettier.io/icon.png',
    link: 'https://prettier.io',
    category: 'plugin'
  },
  {
    id: '3',
    name: 'Auto Deploy Script',
    description: 'Automated deployment script for static sites with built-in optimization and error handling.',
    link: 'https://github.com/example/deploy-script',
    category: 'script'
  }
];

const DEV_PASSWORD = 'Daman@2005';

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(cards), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { password, name, description, icon, link, category } = body;

    // Authenticate developer
    if (password !== DEV_PASSWORD) {
      return new Response(JSON.stringify({ error: 'Invalid password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate required fields
    if (!name || !description || !link || !category) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create new card
    const newCard = {
      id: Date.now().toString(),
      name,
      description,
      icon: icon || '',
      link,
      category
    };

    cards.push(newCard);

    return new Response(JSON.stringify({ success: true, card: newCard }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { password, id } = body;

    // Authenticate developer
    if (password !== DEV_PASSWORD) {
      return new Response(JSON.stringify({ error: 'Invalid password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Find and remove card
    const cardIndex = cards.findIndex(card => card.id === id);
    if (cardIndex === -1) {
      return new Response(JSON.stringify({ error: 'Card not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    cards.splice(cardIndex, 1);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};