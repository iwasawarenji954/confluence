'use client';

import React, { useState, useEffect } from 'react';
import './globals.css'; // Tailwind CSSを読み込む

interface Page {
  id: number;
  title: string;
  content: string;
  children?: Page[];
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [pages, setPages] = useState<Page[]>([]);
  const [openPages, setOpenPages] = useState<number[]>([]); // 開いているページのIDを管理
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, parentTitle: string | null } | null>(null);
  const [pageName, setPageName] = useState('');

  // 初期階層データ
  useEffect(() => {
    const initialPages: Page[] = [
      {
        id: 1,
        title: 'Calculation',
        content: '',
        children: []
      },
      {
        id: 2,
        title: 'Experimental',
        content: '',
        children: [
          {
            id: 3,
            title: 'BootCamp',
            content: '',
            children: [
              { id: 4, title: '顕微鏡', content: '' }
            ]
          }
        ]
      },
      {
        id: 5,
        title: 'LunchMeeting',
        content: '',
        children: []
      }
    ];
    setPages(initialPages);
  }, []);

  // トグルの処理
  const togglePage = (pageId: number) => {
    if (openPages.includes(pageId)) {
      setOpenPages(openPages.filter(id => id !== pageId)); // 開いているページを閉じる
    } else {
      setOpenPages([...openPages, pageId]); // ページを開く
    }
  };

  // 右クリック時のメニュー表示
  const handleContextMenu = (e: React.MouseEvent, pageTitle: string) => {
    e.preventDefault(); // 既定の右クリックメニューを無効化
    e.stopPropagation(); // イベント伝播を防ぐ
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
      parentTitle: pageTitle, // 右クリックされたページのタイトルを設定
    });
  };

  // メニューからページを追加
  const handleAddPage = () => {
    if (contextMenu?.parentTitle && pageName.trim() !== '') {
      const newPage = { id: Date.now(), title: pageName, content: '' };

      // ここで正しい親階層を選び、新しいページをその下に追加する
      const updatedPages = pages.map((page) => {
        return addPageToHierarchy(page, contextMenu.parentTitle || '', newPage); // 親タイトルを渡す
      });

      setPages(updatedPages);
      setPageName('');
      setContextMenu(null); // メニューを閉じる
    }
  };

  // ページ追加をキャンセルする
  const handleCancel = () => {
    setContextMenu(null); // メニューを閉じる
    setPageName(''); // ページ名をリセット
  };

  // 階層にページを追加する再帰的な関数
  const addPageToHierarchy = (page: Page, parentTitle: string, newPage: Page): Page => {
    if (page.title === parentTitle) {
      return {
        ...page,
        children: [...(page.children || []), newPage],
      };
    }

    if (page.children) {
      return {
        ...page,
        children: page.children.map((child) => addPageToHierarchy(child, parentTitle, newPage)),
      };
    }

    return page;
  };

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
          </header>

          {/* メインコンテンツ */}
          <div className="flex flex-1 overflow-hidden">
            {/* サイドバー */}
            <aside className="bg-gray-100 w-64 p-4 overflow-auto">
              <nav>
                <ul>
                  {pages.map((page) => (
                    <PageItem 
                      key={page.id} 
                      page={page} 
                      openPages={openPages} 
                      togglePage={togglePage} 
                      onContextMenu={handleContextMenu}
                    />
                  ))}
                </ul>
              </nav>
            </aside>

            {/* ページ追加用の右クリックメニュー */}
            {contextMenu && (
              <div
                className="absolute bg-white shadow-lg border rounded p-2"
                style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
              >
                <div className="flex justify-between items-center">
                  <input
                    type="text"
                    value={pageName}
                    onChange={(e) => setPageName(e.target.value)}
                    placeholder="新しいページ名"
                    className="border p-1 mb-2 w-full"
                  />
                  <button
                    onClick={handleCancel}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
                <button
                  onClick={handleAddPage}
                  className="bg-green-500 text-white p-1 rounded w-full"
                >
                  ページを追加
                </button>
              </div>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}

// 階層構造を表示するための再帰的コンポーネント
const PageItem = ({ page, openPages, togglePage, onContextMenu }: { page: Page, openPages: number[], togglePage: (id: number) => void, onContextMenu: (e: React.MouseEvent, title: string) => void }) => {
  const isOpen = openPages.includes(page.id); // 開いているかどうかを確認

  return (
    <li>
      <span 
        className="block py-2 px-4 text-gray-700 hover:bg-gray-300 rounded cursor-pointer"
        onClick={() => togglePage(page.id)}
        onContextMenu={(e) => onContextMenu(e, page.title)} // 右クリックメニューの設定
      >
        {/* 三角形アイコンの表示 */}
        <span className="mr-2">{isOpen ? '▼' : '▶'}</span>
        {page.title}
      </span>
      {isOpen && page.children && (
        <ul className="pl-4">
          {page.children.map((child) => (
            <PageItem 
              key={child.id} 
              page={child} 
              openPages={openPages} 
              togglePage={togglePage} 
              onContextMenu={onContextMenu} 
            />
          ))}
        </ul>
      )}
    </li>
  );
};
