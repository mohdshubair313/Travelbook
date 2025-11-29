-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "city" TEXT,
    "country" TEXT DEFAULT 'India',
    "defaultBudgetMin" INTEGER DEFAULT 0,
    "defaultBudgetMax" INTEGER DEFAULT 10000,
    "preferredCategory" TEXT,
    "preferredTransport" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "olxId" TEXT NOT NULL,
    "olxUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "priceRaw" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "location" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "furnishing" TEXT,
    "images" TEXT[],
    "mainImage" TEXT,
    "sellerName" TEXT NOT NULL,
    "sellerPhone" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "scrapedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedListing" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "notes" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceHistory" (
    "id" TEXT NOT NULL,
    "olxId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PriceHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArchivedListing" (
    "id" TEXT NOT NULL,
    "originalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "priceRaw" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "archivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivedReason" TEXT NOT NULL,

    CONSTRAINT "ArchivedListing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_city_idx" ON "User"("city");

-- CreateIndex
CREATE UNIQUE INDEX "Listing_olxId_key" ON "Listing"("olxId");

-- CreateIndex
CREATE INDEX "Listing_category_city_priceRaw_isActive_idx" ON "Listing"("category", "city", "priceRaw", "isActive");

-- CreateIndex
CREATE INDEX "Listing_olxId_idx" ON "Listing"("olxId");

-- CreateIndex
CREATE INDEX "Listing_expiresAt_idx" ON "Listing"("expiresAt");

-- CreateIndex
CREATE INDEX "SavedListing_userId_idx" ON "SavedListing"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedListing_userId_listingId_key" ON "SavedListing"("userId", "listingId");

-- CreateIndex
CREATE INDEX "PriceHistory_olxId_recordedAt_idx" ON "PriceHistory"("olxId", "recordedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ArchivedListing_originalId_key" ON "ArchivedListing"("originalId");

-- CreateIndex
CREATE INDEX "ArchivedListing_archivedAt_idx" ON "ArchivedListing"("archivedAt");

-- AddForeignKey
ALTER TABLE "SavedListing" ADD CONSTRAINT "SavedListing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedListing" ADD CONSTRAINT "SavedListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
