import {
  //Transaction,
 // PublicKey,
 // SystemProgram,
  Connection,
  clusterApiUrl,
 // LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  ACTIONS_CORS_HEADERS,
 // createPostResponse,
  //ActionGetResponse,
  //ActionPostResponse,
} from "@solana/actions";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export const GET = async (req: Request) => {
  try {
    const { pathname } = new URL(req.url);
    const pathSegments = pathname.split("/");
    const uniqueBlinkId = pathSegments[4];

    const blinkData = await prisma.blink.findUnique({
      where: { id: uniqueBlinkId }
    });

    if(!blinkData) {
      return new Response(
        JSON.stringify({ error: "Couldn't find the Blink data!"}),
        {
          status: 404,
          headers: ACTIONS_CORS_HEADERS,
        }
      );
    }

    const payload = {
      icon: blinkData.imageUrl,
      title: `Talk to ${blinkData.codename}`,
      description: blinkData.description,

      label: "Send Mail",
      links : {
        actions : [
          {
            label: "send Mail",
            href: `/api/actions/sendMail/${uniqueBlinkId}`,
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
            type: "transaction",

          },
          
        ],
      },





    };
    return NextResponse.json(payload,  { headers: ACTIONS_CORS_HEADERS});

  } catch (error) {
    console.error("Error processsing request:", error);

    return new Response(JSON.stringify({ error: "Internal server error"}),{
      status: 500,
      headers: ACTIONS_CORS_HEADERS,
    });
  
  }
  

};