import {
  date,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const organizationsTable = pgTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull(),
  role: text("role").notNull().default("LAWYER"),
  displayName: text("display_name").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const clientsTable = pgTable("clients", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  email: text("email").notNull().default(""),
  phone: text("phone").notNull().default(""),
  tags: text("tags").array().notNull().default([]),
  notes: text("notes").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const casesTable = pgTable("cases", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull(),
  clientId: text("client_id"),
  title: text("title").notNull(),
  caseNumber: text("case_number").notNull(),
  court: text("court").notNull(),
  chamber: text("chamber"),
  category: text("category").notNull(),
  opposingParty: text("opposing_party").notNull(),
  status: text("status").notNull().default("ACTIVE"),
  filingDate: date("filing_date", { mode: "string" }).notNull(),
  summary: text("summary").notNull().default(""),
  tags: text("tags").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const documentsTable = pgTable("documents", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull(),
  caseId: text("case_id"),
  uploaderId: text("uploader_id"),
  filename: text("filename").notNull(),
  category: text("category").notNull(),
  type: text("type").notNull(),
  storagePath: text("storage_path"),
  extractedText: text("extracted_text"),
  processingStatus: text("processing_status").notNull().default("QUEUED"),
  verificationStatus: text("verification_status").notNull().default("DEMO"),
  sizeBytes: integer("size_bytes"),
  tags: text("tags").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const timelineEventsTable = pgTable("timeline_events", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull(),
  caseId: text("case_id").notNull(),
  eventDate: date("event_date", { mode: "string" }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  sourceStatus: text("source_status").notNull().default("DEMO"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const researchTable = pgTable("research", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull(),
  caseId: text("case_id"),
  query: text("query").notNull(),
  issue: text("issue").notNull(),
  result: text("result").notNull(),
  confidence: text("confidence").notNull(),
  sources: jsonb("sources").notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const auditLogsTable = pgTable("audit_logs", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull(),
  userId: text("user_id"),
  action: text("action").notNull(),
  resourceType: text("resource_type"),
  resourceId: text("resource_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const memoryChunksTable = pgTable("memory_chunks", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull(),
  userId: text("user_id"),
  caseId: text("case_id"),
  documentId: text("document_id"),
  collection: text("collection").notNull(),
  content: text("content").notNull(),
  metadata: jsonb("metadata").notNull().default({}),
  embedding: jsonb("embedding"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});