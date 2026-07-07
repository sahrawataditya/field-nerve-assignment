import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Field Nerve API',
      version: '1.0.0',
      description: 'API for managing vendors, works, and document uploads',
    },
    servers: [{ url: 'http://localhost:3030', description: 'Development' }],
    components: {
      schemas: {
        Vendor: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            vendor_type: { type: 'string', nullable: true },
            category: { type: 'string', enum: ['technology', 'healthcare', 'education', 'finance', 'retail', 'logistics'] },
            operating_location: { type: 'string', nullable: true },
            status: { type: 'string', enum: ['free', 'open', 'close'] },
            rating: { type: 'integer', minimum: 0, maximum: 10 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Document: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            doc_url: { type: 'string', format: 'uri' },
            vendorId: { type: 'string', format: 'uuid', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Work: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            category: { type: 'string', enum: ['technology', 'healthcare', 'education', 'finance', 'retail', 'logistics'] },
            location: { type: 'string' },
            estimated_value: { type: 'string', nullable: true },
            priority: { type: 'integer', default: 1 },
            expecetedDate: { type: 'string', format: 'date-time', nullable: true },
          },
        },
        RecommendationResult: {
          type: 'object',
          properties: {
            vendor: { $ref: '#/components/schemas/Vendor' },
            score: { type: 'integer' },
            matched_on: { type: 'array', items: { type: 'string' } },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            success: { type: 'boolean', enum: [false] },
          },
        },
      },
    },
  },
  apis: ['./src/controllers/*.js'],
}

export const swaggerSpec = swaggerJsdoc(options)
