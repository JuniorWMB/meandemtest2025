import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import swaggerUi from 'swagger-ui-express';

extendZodWithOpenApi(z);

export const PageViewPayloadSchemaGTM = z.object({
  event_type: z.literal('page_view'),
  page_url: z.string(),
});
export const AddToCartPayloadSchemaGTM = z.object({
  event_type: z.literal('add_to_cart'),
  page_url: z.string(),
  product_id: z.string(),
  quantity_added: z.number().int().positive(),
});
export const CheckoutSuccessPayloadSchemaGTM = z.object({
  event_type: z.literal('checkout_success'),
  page_url: z.string(),
  order_id: z.string(),
  total: z.number().nonnegative(),
});

export const PageViewPayloadSchemaAlgolia = z.object({
  event_type: z.literal('page_view'),
  page_url: z.string(),
});
export const AddToCartPayloadSchemaAlgolia = z.object({
  event_type: z.literal('add_to_cart'),
  page_url: z.string(),
  id: z.string(),
  qty_added: z.number().int().positive(),
});
export const CheckoutSuccessPayloadSchemaAlgolia = z.object({
  event_type: z.literal('checkout_success'),
  page_url: z.string(),
  order_ref: z.string(),
  value: z.number().nonnegative(),
});

export const PageViewPayloadSchemaOmetria = z.object({
  event_type: z.literal('page_view'),
  page_url: z.string(),
});
export const AddToCartPayloadSchemaOmetria = z.object({
  event_type: z.literal('add_to_cart'),
  page_url: z.string(),
  item_id: z.string(),
  count_added: z.number().int().positive(),
});
export const CheckoutSuccessPayloadSchemaOmetria = z.object({
  event_type: z.literal('checkout_success'),
  page_url: z.string(),
  order_id: z.string(),
  total: z.number().nonnegative(),
  address: z.object({
    line1: z.string(),
    city: z.string(),
    postcode: z.string(),
    country: z.string(),
  }),
});

export const PageViewPayloadSchemaSecure = z.object({
  event_type: z.literal('page_view'),
  page_url: z.string(),
});
export const AddToCartPayloadSchemaSecure = z.object({
  event_type: z.literal('add_to_cart'),
  page_url: z.string(),
  product_id: z.string(),
  quantity_added: z.number().int().positive(),
});
export const CheckoutSuccessPayloadSchemaSecure = z.object({
  event_type: z.literal('checkout_success'),
  page_url: z.string(),
  order_id: z.string(),
  total: z.number().nonnegative(),
  email: z.string(),
  address: z.object({
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    postcode: z.string(),
    country: z.string(),
  }),
});

const registry = new OpenAPIRegistry();

registry.register('PageViewPayloadSchemaGTM', PageViewPayloadSchemaGTM);
registry.register('AddToCartPayloadSchemaGTM', AddToCartPayloadSchemaGTM);
registry.register('CheckoutSuccessPayloadSchemaGTM', CheckoutSuccessPayloadSchemaGTM);

registry.register('PageViewPayloadSchemaAlgolia', PageViewPayloadSchemaAlgolia);
registry.register('AddToCartPayloadSchemaAlgolia', AddToCartPayloadSchemaAlgolia);
registry.register('CheckoutSuccessPayloadSchemaAlgolia', CheckoutSuccessPayloadSchemaAlgolia);

registry.register('PageViewPayloadSchemaOmetria', PageViewPayloadSchemaOmetria);
registry.register('AddToCartPayloadSchemaOmetria', AddToCartPayloadSchemaOmetria);
registry.register('CheckoutSuccessPayloadSchemaOmetria', CheckoutSuccessPayloadSchemaOmetria);

registry.register('PageViewPayloadSchemaSecure', PageViewPayloadSchemaSecure);
registry.register('AddToCartPayloadSchemaSecure', AddToCartPayloadSchemaSecure);
registry.register('CheckoutSuccessPayloadSchemaSecure', CheckoutSuccessPayloadSchemaSecure);

registry.registerPath({
  method: 'post',
  path: '/collect/gtm',
  operationId: 'collectGTM',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.discriminatedUnion('event_type', [
            PageViewPayloadSchemaGTM,
            AddToCartPayloadSchemaGTM,
            CheckoutSuccessPayloadSchemaGTM,
          ]),
          examples: {
            PageView: {
              value: {
                event_type: 'page_view',
                page_url: 'https://example.com',
              },
            },
            AddToCart: {
              value: {
                event_type: 'add_to_cart',
                page_url: 'https://example.com',
                product_id: '123',
                quantity_added: 2,
              },
            },
            CheckoutSuccess: {
              value: {
                event_type: 'checkout_success',
                page_url: 'https://example.com',
                order_id: 'qsd1w132s',
                total: 99.99,
              },
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Event successfully recorded',
    },
    400: {
      description: 'Invalid payload',
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/collect/algolia',
  operationId: 'collectAlgolia',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.discriminatedUnion('event_type', [
            PageViewPayloadSchemaAlgolia,
            AddToCartPayloadSchemaAlgolia,
            CheckoutSuccessPayloadSchemaAlgolia,
          ]),
          examples: {
            PageView: {
              value: {
                event_type: 'page_view',
                page_url: 'https://example.com',
              },
            },
            AddToCart: {
              value: {
                event_type: 'add_to_cart',
                page_url: 'https://example.com',
                id: '456',
                qty_added: 3,
              },
            },
            CheckoutSuccess: {
              value: {
                event_type: 'checkout_success',
                page_url: 'https://example.com',
                order_ref: '12312sssd',
                value: 150.5,
              },
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Event successfully recorded',
    },
    400: {
      description: 'Invalid payload',
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/collect/ometria',
  operationId: 'collectOmetria',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.discriminatedUnion('event_type', [
            PageViewPayloadSchemaOmetria,
            AddToCartPayloadSchemaOmetria,
            CheckoutSuccessPayloadSchemaOmetria,
          ]),
          examples: {
            PageView: {
              value: {
                event_type: 'page_view',
                page_url: 'https://example.com',
              },
            },
            AddToCart: {
              value: {
                event_type: 'add_to_cart',
                page_url: 'https://example.com',
                item_id: '789',
                count_added: 1,
              },
            },
            CheckoutSuccess: {
              value: {
                event_type: 'checkout_success',
                page_url: 'https://example.com',
                order_id: 'order-omet',
                total: 200,
                address: {
                  line1: '123 Main St',
                  city: 'Anytown',
                  postcode: '12345',
                  country: 'USA',
                },
              },
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Event successfully recorded',
    },
    400: {
      description: 'Invalid payload',
    },
  },
});

registry.registerComponent('securitySchemes', 'ApiKey', {
  type: 'apiKey',
  in: 'header',
  name: 'Authorization',
})

registry.registerPath({
  method: 'post',
  path: '/collect/secure',
  operationId: 'collectSecure',
  security: [{ ApiKey: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.discriminatedUnion('event_type', [
            PageViewPayloadSchemaSecure,
            AddToCartPayloadSchemaSecure,
            CheckoutSuccessPayloadSchemaSecure,
          ]),
          examples: {
            PageView: {
              value: {
                event_type: 'page_view',
                page_url: 'https://example.com',
              },
            },
            AddToCart: {
              value: {
                event_type: 'add_to_cart',
                page_url: 'https://example.com',
                product_id: '321',
                quantity_added: 4,
              },
            },
            CheckoutSuccess: {
              value: {
                event_type: 'checkout_success',
                page_url: 'https://example.com',
                order_id: '12312d1w',
                total: 300,
                email: 'b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514',
                address: {
                  line1: '456 Elm St',
                  line2: 'Apt 7',
                  city: 'Securetown',
                  postcode: '67890',
                  country: 'USA',
                },
              },
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Event successfully recorded',
    },
    400: {
      description: 'Invalid payload',
    },
    401: {
      description: 'Unauthorized. This endpoint requires an Authorization header with value "supersecretkey".',
    },
  },
  description: 'Requires Authorization header: supersecretkey',
});

const app = express();
app.use(cors());
const PORT = 4000;

app.use(express.json());

const endpoints: string[] = [
  '/collect/gtm',
  '/collect/algolia',
  '/collect/ometria',
  '/collect/secure'
];


const eventsFilePath = path.resolve('./mock-server/events/events.json');
if (fs.existsSync(eventsFilePath)) {
  fs.unlinkSync(eventsFilePath);
}

const eventsDir = path.dirname(eventsFilePath);
if (!fs.existsSync(eventsDir)) {
  fs.mkdirSync(eventsDir, { recursive: true });
}
type GTMEvent = z.infer<typeof PageViewPayloadSchemaGTM> | z.infer<typeof AddToCartPayloadSchemaGTM> | z.infer<typeof CheckoutSuccessPayloadSchemaGTM>;
type AlgoliaEvent = z.infer<typeof PageViewPayloadSchemaAlgolia> | z.infer<typeof AddToCartPayloadSchemaAlgolia> | z.infer<typeof CheckoutSuccessPayloadSchemaAlgolia>;
type OmetriaEvent = z.infer<typeof PageViewPayloadSchemaOmetria> | z.infer<typeof AddToCartPayloadSchemaOmetria> | z.infer<typeof CheckoutSuccessPayloadSchemaOmetria>;
type SecureEvent = z.infer<typeof PageViewPayloadSchemaSecure> | z.infer<typeof AddToCartPayloadSchemaSecure> | z.infer<typeof CheckoutSuccessPayloadSchemaSecure>;

type Events = {
  '/collect/gtm'?: Array<{ timestamp: number; payload: GTMEvent }>;
  '/collect/algolia'?: Array<{ timestamp: number; payload: AlgoliaEvent }>;
  '/collect/ometria'?: Array<{ timestamp: number; payload: OmetriaEvent }>;
  '/collect/secure'?: Array<{ timestamp: number; payload: SecureEvent }>;
};

let events: Events = {};
if (fs.existsSync(eventsFilePath)) {
  try {
    events = JSON.parse(fs.readFileSync(eventsFilePath, 'utf-8'));
  } catch {
    events = {};
  }
} else {
  fs.writeFileSync(eventsFilePath, JSON.stringify({}, null, 2));
}

// Define each endpoint handler separately
app.post('/collect/gtm', (req: Request, res: Response) => {
  console.log('Received POST /collect/gtm:', req.body);
  const eventType = req.body.event_type;
  const schemas = {
    page_view: PageViewPayloadSchemaGTM,
    add_to_cart: AddToCartPayloadSchemaGTM,
    checkout_success: CheckoutSuccessPayloadSchemaGTM,
  };
  const schema = schemas[eventType as keyof typeof schemas];
  if (!schema) {
    res.status(400).json({ error: 'Unknown event type for this endpoint' });
    return;
  }
  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Invalid payload', details: result.error.issues });
    return;
  }
  if (!events['/collect/gtm']) events['/collect/gtm'] = [];
  events['/collect/gtm'].push({ timestamp: Date.now(), payload: result.data });
  fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 2));
  res.status(200).json({ status: 'ok' });
});

app.post('/collect/algolia', (req: Request, res: Response) => {
  console.log('Received POST /collect/algolia:', req.body);
  const eventType = req.body.event_type;
  const schemas = {
    page_view: PageViewPayloadSchemaAlgolia,
    add_to_cart: AddToCartPayloadSchemaAlgolia,
    checkout_success: CheckoutSuccessPayloadSchemaAlgolia,
  };
  const schema = schemas[eventType as keyof typeof schemas];
  if (!schema) {
    res.status(400).json({ error: 'Unknown event type for this endpoint' });
    return;
  }
  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Invalid payload', details: result.error.issues });
    return;
  }
  if (!events['/collect/algolia']) events['/collect/algolia'] = [];
  events['/collect/algolia'].push({ timestamp: Date.now(), payload: result.data });
  fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 2));
  res.status(200).json({ status: 'ok' });
});

app.post('/collect/ometria', (req: Request, res: Response) => {
  console.log('Received POST /collect/ometria:', req.body);
  const eventType = req.body.event_type;
  const schemas = {
    page_view: PageViewPayloadSchemaOmetria,
    add_to_cart: AddToCartPayloadSchemaOmetria,
    checkout_success: CheckoutSuccessPayloadSchemaOmetria,
  };
  const schema = schemas[eventType as keyof typeof schemas];
  if (!schema) {
    res.status(400).json({ error: 'Unknown event type for this endpoint' });
    return;
  }
  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Invalid payload', details: result.error.issues });
    return;
  }
  if (!events['/collect/ometria']) events['/collect/ometria'] = [];
  events['/collect/ometria'].push({ timestamp: Date.now(), payload: result.data });
  fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 2));
  res.status(200).json({ status: 'ok' });
});

app.post('/collect/secure', (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (authHeader !== 'supersecretkey') {
    res.status(401).json({ error: 'Unauthorized: missing or invalid Authorization header' });
    return;
  }
  console.log('Received POST /collect/secure:', req.body);
  const eventType = req.body.event_type;
  const schemas = {
    page_view: PageViewPayloadSchemaSecure,
    add_to_cart: AddToCartPayloadSchemaSecure,
    checkout_success: CheckoutSuccessPayloadSchemaSecure,
  };
  const schema = schemas[eventType as keyof typeof schemas];
  if (!schema) {
    res.status(400).json({ error: 'Unknown event type for this endpoint' });
    return;
  }
  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Invalid payload', details: result.error.issues });
    return;
  }
  if (!events['/collect/secure']) events['/collect/secure'] = [];
  events['/collect/secure'].push({ timestamp: Date.now(), payload: result.data });
  fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 2));
  res.status(200).json({ status: 'ok' });
});

const generator = new OpenApiGeneratorV3(registry.definitions);
const document = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Analytics Mockserver',
  },
  servers: [],
});


app.use('/docs', swaggerUi.serve, swaggerUi.setup(document));

// Serve HTML report of event counts per endpoint
app.get('/report', (req: Request, res: Response) => {
  const eventsDir = path.dirname(eventsFilePath);
  if (!fs.existsSync(eventsDir)) {
    fs.mkdirSync(eventsDir, { recursive: true });
  }
  let fileEvents: Events = {};
  if (fs.existsSync(eventsFilePath)) {
    try {
      fileEvents = JSON.parse(fs.readFileSync(eventsFilePath, 'utf-8'));
    } catch {
      fileEvents = {};
    }
  } else {
    fs.writeFileSync(eventsFilePath, JSON.stringify({}, null, 2));
  }

  // Collect all event types
  const eventTypes = ['page_view', 'add_to_cart', 'checkout_success'];

  let html = `<!DOCTYPE html><html><head><title>Analytics Event Report</title><style>body{font-family:sans-serif;}table{border-collapse:collapse;}th,td{border:1px solid #ccc;padding:8px;}th{background:#eee;}</style></head><body>`;
  html += `<h1>Analytics Event Report</h1>`;
  endpoints.forEach(endpoint => {
    html += `<h2>Endpoint: ${endpoint}</h2>`;
    html += `<table><thead><tr><th>Event Type</th><th>Count</th></tr></thead><tbody>`;
    eventTypes.forEach(type => {
      let count = 0;
      // Only use endpoint if it's a key of Events
      type EndpointKey = keyof Events;
      if (["/collect/gtm", "/collect/algolia", "/collect/ometria", "/collect/secure"].includes(endpoint)) {
        const arr = fileEvents[endpoint as EndpointKey];
        arr?.forEach((e) => {
          if (e.payload && e.payload.event_type === type) {
            count++;
          }
        });
      }
      html += `<tr><td>${type}</td><td>${count}</td></tr>`;
    });
    html += `</tbody></table>`;
  });
  html += `</body></html>`;
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Mock analytics server running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  endpoints.forEach(e => console.log(`  POST ${e}`));
});
