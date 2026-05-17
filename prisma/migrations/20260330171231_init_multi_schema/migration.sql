-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "admin";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "gameplay";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "login";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "master";

-- CreateTable
CREATE TABLE "login"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master"."Team" (
    "id" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "teamShortName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master"."Player" (
    "id" TEXT NOT NULL,
    "playerName" TEXT NOT NULL,
    "playerSkill" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "teamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master"."Match" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "gamedayId" INTEGER NOT NULL,
    "circuitLocation" TEXT NOT NULL,
    "circuitShortName" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin"."Question" (
    "id" SERIAL NOT NULL,
    "questionNo" INTEGER NOT NULL,
    "questionDescription" TEXT NOT NULL,
    "questionStatus" INTEGER NOT NULL,
    "questionType" TEXT NOT NULL,
    "choiceLimit" INTEGER NOT NULL,
    "matchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin"."Option" (
    "id" SERIAL NOT NULL,
    "optionId" INTEGER NOT NULL,
    "optionDesc" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "points" INTEGER NOT NULL DEFAULT 10,
    "position" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gameplay"."Prediction" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" INTEGER NOT NULL,
    "matchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gameplay"."PredictionAnswer" (
    "id" SERIAL NOT NULL,
    "predictionId" INTEGER NOT NULL,
    "optionId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PredictionAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "login"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "login"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Match_matchId_key" ON "master"."Match"("matchId");

-- CreateIndex
CREATE UNIQUE INDEX "Question_matchId_questionNo_key" ON "admin"."Question"("matchId", "questionNo");

-- CreateIndex
CREATE UNIQUE INDEX "Option_optionId_questionId_key" ON "admin"."Option"("optionId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "Prediction_userId_matchId_questionId_key" ON "gameplay"."Prediction"("userId", "matchId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "PredictionAnswer_predictionId_optionId_key" ON "gameplay"."PredictionAnswer"("predictionId", "optionId");

-- AddForeignKey
ALTER TABLE "master"."Player" ADD CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "master"."Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin"."Question" ADD CONSTRAINT "Question_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "master"."Match"("matchId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin"."Option" ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "admin"."Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gameplay"."Prediction" ADD CONSTRAINT "Prediction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "login"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gameplay"."Prediction" ADD CONSTRAINT "Prediction_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "admin"."Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gameplay"."Prediction" ADD CONSTRAINT "Prediction_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "master"."Match"("matchId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gameplay"."PredictionAnswer" ADD CONSTRAINT "PredictionAnswer_predictionId_fkey" FOREIGN KEY ("predictionId") REFERENCES "gameplay"."Prediction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gameplay"."PredictionAnswer" ADD CONSTRAINT "PredictionAnswer_optionId_questionId_fkey" FOREIGN KEY ("optionId", "questionId") REFERENCES "admin"."Option"("optionId", "questionId") ON DELETE RESTRICT ON UPDATE CASCADE;
