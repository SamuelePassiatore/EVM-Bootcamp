import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { account, amount } = body;
        
        if (!account || !amount) {
        return NextResponse.json(
            { message: "Account and amount are required" },
            { status: 400 }
        );
        }
        
        // Call the NestJS backend to mint tokens
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mint`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ account, amount }),
        });
        
        if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json(
            { message: errorData.message || "Failed to mint tokens" },
            { status: response.status }
        );
        }
        
        const data = await response.json();
        return NextResponse.json({ success: true, txHash: data }, { status: 200 });
        
    } catch (error) {
        console.error("Error in mint API route:", error);
        return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
        );
    }
}