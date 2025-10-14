'use client'
import RouteGuard from "@/app/components/RouteGuard";
import Header from '@/app/components/Header';
import LiveChat from '@/app/components/LiveChat';

export default function Index() {
 


  return (
    <RouteGuard>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex flex-col">
          <LiveChat />
        </main>
      </div>
    </RouteGuard>
   
  );
}
