-- CreateTable
CREATE TABLE "Folders" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "folderName" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255),
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMP(3) NOT NULL,
    "shared" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Folders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Folders" ADD CONSTRAINT "Folders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
