import {
  ACTIONS_CORS_HEADERS,
  ActionPostResponse,
  createPostResponse
} from "@solana/actions";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  Connection,
  clusterApiUrl
} from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const CORS_HEADERS = {
  ...ACTIONS_CORS_HEADERS,
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

export async function GET(req: Request) {
  try {
    const { pathname } = new URL(req.url);
    const pathSegments = pathname.split("/");
    const uniqueBlinkId = pathSegments[4];

    const blinkData = await prisma.blink.findUnique({
      where: { uniqueBlinkId: uniqueBlinkId }
    });

    if (!blinkData) {
      return NextResponse.json(
        { error: "Couldn't find the Blink data!" },
        {
          status: 404,
          headers: CORS_HEADERS,
        }
      );
    }

    const feeInSol = Number(blinkData.askingFee);
    const feeDisplay = feeInSol === 0 ? "Free" : `${feeInSol} SOL`;

    console.log('Fee Debug:', {
      rawFee: blinkData.askingFee,
      feeInSol,
      feeDisplay
    });

    const payload = {
      icon: blinkData.imageUrl || undefined,
      title: `Talk to ${blinkData.codename}`,
      description: blinkData.description || '',
      label: `Send Mail (${feeDisplay})`,
      links: {
        actions: [
          {
            label: `Send Mail (${feeDisplay})`,
            href: `/api/actions/sendMail/${uniqueBlinkId}?codename={codename}&email={email}&description={description}`,
            parameters: [
              {
                type: "text",
                name: "codename",
                label: "Enter your name",
                required: true,
              },
              {
                type: "email",
                name: "email",
                label: "Enter your mail",
                required: true,
              },
              {
                type: "text",
                name: "description",
                label: "Write your mail",
                required: true,
              }
            ],
          },
        ],
      },
    };

    return NextResponse.json(payload, { 
      headers: CORS_HEADERS
    });

  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      {
        status: 500,
        headers: CORS_HEADERS
      }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { pathname } = new URL(req.url);
    const pathSegments = pathname.split("/");
    const uniqueBlinkId = pathSegments[4];

    const body = await req.json();
    const userAddress = new PublicKey(body.account);

    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    const description = url.searchParams.get("description");
    const codename = url.searchParams.get("codename");

    if (!email || !description || !codename) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        {
          status: 400,
          headers: CORS_HEADERS,
        }
      );
    }

    const blinkData = await prisma.blink.findUnique({
      where: { uniqueBlinkId },
    });

    if (!blinkData) {
      return NextResponse.json(
        { error: "Could not find the Blink data!" },
        {
          status: 404,
          headers: CORS_HEADERS,
        }
      );
    }

    const creatorAddress = new PublicKey(blinkData.solanaKey);
    const askingFee = Number(blinkData.askingFee);
    const totalFee = askingFee * LAMPORTS_PER_SOL;
    console.log("totalfee", totalFee);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: userAddress,
        toPubkey: creatorAddress,
        lamports: totalFee,
      })
    );

    transaction.feePayer = userAddress;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        type: "transaction",
        transaction,
        message: totalFee > 0 
          ? `Sending ${askingFee} SOL to contact ${blinkData.codename}`
          : `Sending message to ${blinkData.codename}`,
        links: {
          next: {
            type: "post",
            href: `/api/actions/saveMailData/${uniqueBlinkId}?email=${encodeURIComponent(email)}&description=${encodeURIComponent(description)}&codename=${encodeURIComponent(codename)}`,
          },
        },
      },
    });

    return NextResponse.json(payload, {
      headers: CORS_HEADERS
    });

  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { 
        error: "Failed to process transaction request",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}

export async function OPTIONS(req: Request) {
  return new Response(null, {
    status: 200,
    headers: CORS_HEADERS
  });
}