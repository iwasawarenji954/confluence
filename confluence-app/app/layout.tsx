// app/layout.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import './globals.css'; // Tailwind CSSを読み込む

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <title>Lab. Wiki</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <div className="h-screen flex flex-col">
          {/* ヘッダー */}
          <header className="bg-green-600 text-white p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Lab. Wiki</h1>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              作成
            </button>
          </header>

          {/* メインコンテンツ */}
          <div className="flex flex-1 overflow-hidden">
            {/* サイドバー */}
            <aside className="bg-gray-100 w-64 p-4 overflow-auto">
              <nav>
                <ul>
                  <li>
                    <Link href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-300 rounded">
                      Calculation
                    </Link>
                  </li>
                  <li>
                    <details>
                      <summary className="py-2 px-4 text-gray-700 hover:bg-gray-300 rounded cursor-pointer">
                        Experimental
                      </summary>
                      <ul className="pl-4">
                        <li>
                          <details>
                            <summary className="py-2 px-4 text-gray-700 hover:bg-gray-300 rounded cursor-pointer">
                              BootCamp
                            </summary>
                            <ul className="pl-4">
                              <li>
                                <Link href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-300 rounded">
                                  顕微鏡
                                </Link>
                              </li>
                            </ul>
                          </details>
                        </li>
                      </ul>
                    </details>
                  </li>
                  <li>
                    <Link href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-300 rounded">
                      LunchMeeting
                    </Link>
                  </li>
                </ul>
              </nav>
            </aside>

            {/* メインエリア */}
            <main className="flex-1 p-4 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
