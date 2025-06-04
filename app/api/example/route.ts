import { NextRequest, NextResponse } from "next/server";
import { avalancheFuji } from "viem/chains";
import {
  createMetadata,
  Metadata,
  ValidatedMetadata,
  ExecutionResponse,
} from "@sherrylinks/sdk";
import { serialize } from "wagmi";
import { encodeFunctionData, type TransactionSerializable } from "viem";
import { abi } from "./blockchain/abi";

const CONTRACT_ADDRESS = "0x9Da5D4De75832CD63666AC738837B88fCf4b3396";

export async function GET(req: NextRequest) {
  try {
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const serverUrl = `${protocol}://${host}`;

    const metadata: Metadata = {
      url: "https://sherry.social",
      icon: "https://avatars.githubusercontent.com/u/117962315",
      title: "Mensaje con Timestamp",
      baseUrl: serverUrl,
      description:
        "Almacena un mensaje con un timestamp optimizado calculado por nuestro algoritmo",
      actions: [
        {
          type: "dynamic",
          label: "Almacenar Mensaje",
          description:
            "Almacena tu mensaje con un timestamp personalizado calculado para almacenamiento óptimo",
          chains: { source: "fuji" },
          path: `/api/mi-app`,
          params: [
            {
              name: "mensaje",
              label: "¡Tu Mensaje Hermano!",
              type: "text",
              required: true,
              description:
                "Ingresa el mensaje que quieres almacenar en la blockchain",
            },
          ],
        },
      ],
    };

    // Validar metadata usando el SDK
    const validated: ValidatedMetadata = createMetadata(metadata);

    // Retornar con headers CORS para acceso cross-origin
    return NextResponse.json(validated, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      },
    });
  } catch (error) {
    console.error("Error creando metadata:", error);
    return NextResponse.json(
      { error: "Error al crear metadata" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mensaje = searchParams.get("mensaje");

    if (!mensaje) {
      return NextResponse.json(
        { error: "Message parameter is required" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    }

    // Calcular timestamp optimizado usando algoritmo personalizado
    const optimizedTimestamp = calculateOptimizedTimestamp(mensaje);

    // Codificar los datos de la función del contrato
    const data = encodeFunctionData({
      abi: abi,
      functionName: "storeMessage",
      args: [mensaje, BigInt(optimizedTimestamp)],
    });

    // Crear transacción de contrato inteligente
    const tx: TransactionSerializable = {
      to: CONTRACT_ADDRESS,
      data: data,
      chainId: avalancheFuji.id,
      type: "legacy",
    };

    // Serializar transacción
    const serialized = serialize(tx);

    // Crear respuesta
    const resp: ExecutionResponse = {
      serializedTransaction: serialized,
      chainId: avalancheFuji.name,
    };

    // Retornar respuesta exitosa
    return NextResponse.json(resp, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error("Error en petición POST:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Algoritmo personalizado para calcular timestamp optimizado basado en el contenido del mensaje
function calculateOptimizedTimestamp(message: string): number {
  // Obtener el timestamp actual como punto de partida
  const currentTimestamp = Math.floor(Date.now() / 1000);

  // Algoritmo personalizado: Agregar códigos de caracteres para crear un offset único
  // Esta es tu lógica de negocio única - puedes hacer esto tan complejo como necesites
  let offset = 0;

  for (let i = 0; i < message.length; i++) {
    // Sumar códigos de caracteres y usar posición como multiplicador
    offset += message.charCodeAt(i) * (i + 1);
  }

  // Asegurar que el offset sea razonable (máximo 1 hora)
  const maxOffset = 3600;
  offset = offset % maxOffset;

  // Calcular timestamp optimizado final
  return currentTimestamp + offset;
}

// Test commit for GitHub authentication
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204, // Sin Contenido
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
    },
  });
}
