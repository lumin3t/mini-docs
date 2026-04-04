"use client";

import { ReactNode } from "react";
import { useParams } from "next/navigation";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";

export function Room({ children }: { children: ReactNode }) {
  const params = useParams();
  const roomId = params?.documentId as string | undefined;

  // Prevent rendering until we have a valid ID
  if (!roomId) {
    return <div>Loading room...</div>;
  }

  return (
    <LiveblocksProvider publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!}>
      <RoomProvider id={roomId} initialPresence={{}}>
        <ClientSideSuspense fallback={<div>Loading...</div>}>
          {() => children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}